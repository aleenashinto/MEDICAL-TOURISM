import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import {
  LeadQuerySchema,
  LeadStatusUpdateSchema,
  LeadAssignSchema,
  LeadNoteSchema,
  LeadConvertSchema,
} from "@maides/validation";
import { db } from "../../db.js";
import { leads, users, enquiries, eq, and, desc, ilike, sql } from "@maides/database";
import { successResponse, errorResponse } from "../../utils/response.js";
import { requireRole } from "../../middleware/auth.js";
import { recordAuditLog } from "../../utils/audit.js";
import { hashPassword } from "@maides/auth";

const PublicEnquirySchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(6, "Valid phone number is required"),
  country: z.string().min(2, "Country is required"),
  specialty: z.string().min(2, "Specialty is required"),
  treatmentName: z.string().optional(),
  preferredDistrict: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  medicalSummary: z.string().min(10, "Please describe your clinical requirements"),
  source: z.string().default("website"),
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: "You must consent to data processing under DPDP Act" }),
  }),
});

export async function leadRoutes(app: FastifyInstance) {
  // ─── Public Lead Capture (Anonymous Medical Enquiry) ───────────────────────
  app.post("/enquire", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = PublicEnquirySchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
    }

    const leadData = parseResult.data;

    const [newLead] = await db
      .insert(leads)
      .values({
        ...leadData,
        status: "new",
      })
      .returning();

    // Record audit event
    await recordAuditLog({
      userEmail: newLead.email,
      action: "PUBLIC_LEAD_CREATED",
      entityType: "LEAD",
      entityId: newLead.id,
      details: {
        specialty: newLead.specialty,
        country: newLead.country,
        source: newLead.source,
      },
      ipAddress: request.ip,
      userAgent: request.headers["user-agent"],
    });

    return reply.status(201).send(
      successResponse({
        leadId: newLead.id,
        status: newLead.status,
        message: "Your medical enquiry has been registered. Our Kerala medical coordinator will review your case shortly.",
      })
    );
  });

  // ─── Staff CRM: List Leads with Filtering & Search ─────────────────────────
  app.get(
    "/",
    { preHandler: requireRole("super_admin", "admin", "sales_crm_agent", "medical_coordinator") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = LeadQuerySchema.safeParse(request.query);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid query parameters", parseResult.error.format()));
      }

      const { status, specialty, country, assignedAgentId, search, page = 1, limit = 20 } = parseResult.data;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (status) conditions.push(eq(leads.status, status));
      if (specialty) conditions.push(ilike(leads.specialty, `%${specialty}%`));
      if (country) conditions.push(ilike(leads.country, `%${country}%`));
      if (assignedAgentId) conditions.push(eq(leads.assignedAgentId, assignedAgentId));
      if (search) {
        conditions.push(
          sql`(${leads.fullName} ILIKE ${`%${search}%`} OR ${leads.email} ILIKE ${`%${search}%`} OR ${leads.phone} ILIKE ${`%${search}%`})`
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const leadList = await db.query.leads.findMany({
        where: whereClause,
        orderBy: [desc(leads.createdAt)],
        limit,
        offset,
      });

      return successResponse({
        leads: leadList,
        pagination: { page, limit, count: leadList.length },
      });
    }
  );

  // ─── Staff CRM: Get Single Lead Details ────────────────────────────────────
  app.get(
    "/:id",
    { preHandler: requireRole("super_admin", "admin", "sales_crm_agent", "medical_coordinator") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      const lead = await db.query.leads.findFirst({
        where: eq(leads.id, id),
      });

      if (!lead) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Lead record not found"));
      }

      return successResponse({ lead });
    }
  );

  // ─── Staff CRM: Update Lead Pipeline Status ────────────────────────────────
  app.patch(
    "/:id/status",
    { preHandler: requireRole("super_admin", "admin", "sales_crm_agent", "medical_coordinator") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const parseResult = LeadStatusUpdateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
      }

      const { status, notes } = parseResult.data;

      const existing = await db.query.leads.findFirst({
        where: eq(leads.id, id),
      });

      if (!existing) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Lead record not found"));
      }

      const updatedNotes = notes
        ? existing.notes
          ? `${existing.notes}\n[${new Date().toISOString()}] Status -> ${status}: ${notes}`
          : `[${new Date().toISOString()}] Status -> ${status}: ${notes}`
        : existing.notes;

      const [updatedLead] = await db
        .update(leads)
        .set({
          status,
          notes: updatedNotes,
          updatedAt: new Date(),
        })
        .where(eq(leads.id, id))
        .returning();

      // Record audit event
      await recordAuditLog({
        userId: request.user?.sub,
        userEmail: request.user?.email,
        userRole: request.user?.role,
        action: "LEAD_STATUS_UPDATED",
        entityType: "LEAD",
        entityId: id,
        details: {
          previousStatus: existing.status,
          newStatus: status,
          notes,
        },
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      });

      return successResponse({ lead: updatedLead });
    }
  );

  // ─── Staff CRM: Assign Lead to Agent / Coordinator ────────────────────────
  app.post(
    "/:id/assign",
    { preHandler: requireRole("super_admin", "admin", "sales_crm_agent", "medical_coordinator") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const parseResult = LeadAssignSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
      }

      const { assignedAgentId, notes } = parseResult.data;

      const [lead, agent] = await Promise.all([
        db.query.leads.findFirst({ where: eq(leads.id, id) }),
        db.query.users.findFirst({ where: eq(users.id, assignedAgentId) }),
      ]);

      if (!lead) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Lead record not found"));
      }

      if (!agent) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Assigned agent/coordinator not found"));
      }

      const updatedNotes = notes
        ? lead.notes
          ? `${lead.notes}\n[${new Date().toISOString()}] Assigned to ${agent.fullName} (${agent.role}): ${notes}`
          : `[${new Date().toISOString()}] Assigned to ${agent.fullName} (${agent.role}): ${notes}`
        : lead.notes;

      const [updatedLead] = await db
        .update(leads)
        .set({
          assignedAgentId,
          notes: updatedNotes,
          updatedAt: new Date(),
        })
        .where(eq(leads.id, id))
        .returning();

      // Record audit event
      await recordAuditLog({
        userId: request.user?.sub,
        userEmail: request.user?.email,
        userRole: request.user?.role,
        action: "LEAD_ASSIGNED",
        entityType: "LEAD",
        entityId: id,
        details: {
          assignedAgentId,
          agentName: agent.fullName,
          agentRole: agent.role,
        },
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      });

      return successResponse({ lead: updatedLead });
    }
  );

  // ─── Staff CRM: Append Note / Communication Log ───────────────────────────
  app.post(
    "/:id/notes",
    { preHandler: requireRole("super_admin", "admin", "sales_crm_agent", "medical_coordinator") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const parseResult = LeadNoteSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
      }

      const { note } = parseResult.data;

      const lead = await db.query.leads.findFirst({
        where: eq(leads.id, id),
      });

      if (!lead) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Lead record not found"));
      }

      const author = request.user?.email || "Staff";
      const appendedNotes = lead.notes
        ? `${lead.notes}\n[${new Date().toISOString()}] by ${author}: ${note}`
        : `[${new Date().toISOString()}] by ${author}: ${note}`;

      const [updatedLead] = await db
        .update(leads)
        .set({
          notes: appendedNotes,
          updatedAt: new Date(),
        })
        .where(eq(leads.id, id))
        .returning();

      return successResponse({ lead: updatedLead });
    }
  );

  // ─── Staff CRM: Convert Lead to Patient Case ──────────────────────────────
  app.post(
    "/:id/convert",
    { preHandler: requireRole("super_admin", "admin", "sales_crm_agent", "medical_coordinator") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const parseResult = LeadConvertSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
      }

      const { assignedCoordinatorId, assignedHospitalId, assignedDoctorId, notes } = parseResult.data;

      const lead = await db.query.leads.findFirst({
        where: eq(leads.id, id),
      });

      if (!lead) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Lead record not found"));
      }

      if (lead.status === "converted" && lead.convertedPatientId) {
        return reply.status(409).send(errorResponse("ALREADY_CONVERTED", "This lead has already been converted to a patient case"));
      }

      // Step 1: Check or provision patient user account
      let patient = await db.query.users.findFirst({
        where: eq(users.email, lead.email.toLowerCase()),
      });

      if (!patient) {
        // Generate secure temporary random password
        const tempPasswordHash = await hashPassword(`Maides@${Math.random().toString(36).slice(-8)}!`);
        const [newPatient] = await db
          .insert(users)
          .values({
            email: lead.email.toLowerCase(),
            passwordHash: tempPasswordHash,
            fullName: lead.fullName,
            phone: lead.phone,
            country: lead.country,
            role: "patient",
            preferredLanguage: "English",
            emailVerified: false,
            active: true,
          })
          .returning();
        patient = newPatient;
      }

      // Step 2: Spawn official clinical enquiry case
      const [newEnquiry] = await db
        .insert(enquiries)
        .values({
          patientId: patient.id,
          specialty: lead.specialty,
          medicalSummary: lead.medicalSummary,
          preferredDistrict: lead.preferredDistrict,
          budget: lead.budget,
          timeline: lead.timeline,
          status: "medical_review",
          assignedCoordinatorId: assignedCoordinatorId || request.user?.sub,
          assignedHospitalId: assignedHospitalId || null,
          assignedDoctorId: assignedDoctorId || null,
          internalNotes: notes || `Converted from Lead ID ${lead.id}`,
        })
        .returning();

      // Step 3: Update Lead to converted status
      const updatedNotes = notes
        ? lead.notes
          ? `${lead.notes}\n[${new Date().toISOString()}] Converted to Patient Case (Enquiry ID: ${newEnquiry.id}): ${notes}`
          : `[${new Date().toISOString()}] Converted to Patient Case (Enquiry ID: ${newEnquiry.id}): ${notes}`
        : lead.notes;

      const [convertedLead] = await db
        .update(leads)
        .set({
          status: "converted",
          convertedPatientId: patient.id,
          notes: updatedNotes,
          updatedAt: new Date(),
        })
        .where(eq(leads.id, id))
        .returning();

      // Step 4: Record audit event
      await recordAuditLog({
        userId: request.user?.sub,
        userEmail: request.user?.email,
        userRole: request.user?.role,
        action: "LEAD_CONVERTED_TO_PATIENT_CASE",
        entityType: "LEAD",
        entityId: id,
        details: {
          patientId: patient.id,
          patientEmail: patient.email,
          enquiryId: newEnquiry.id,
          specialty: newEnquiry.specialty,
        },
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      });

      return successResponse({
        lead: convertedLead,
        patient: {
          id: patient.id,
          email: patient.email,
          fullName: patient.fullName,
        },
        enquiry: newEnquiry,
        message: "Lead successfully converted to active patient enquiry case.",
      });
    }
  );
}

