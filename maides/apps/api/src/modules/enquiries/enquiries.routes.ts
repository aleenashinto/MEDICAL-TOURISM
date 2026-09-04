import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  EnquiryCreateSchema,
  EnquiryStatusUpdateSchema,
  EnquiryQuerySchema,
  EnquiryAssignSchema,
  EnquiryOpinionRequestSchema,
} from "@maides/validation";
import { db } from "../../db.js";
import { enquiries, enquiryDocuments, users, hospitals, doctors, eq, and, desc, ilike, sql } from "@maides/database";
import { successResponse, errorResponse } from "../../utils/response.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { recordAuditLog } from "../../utils/audit.js";

export async function enquiryRoutes(app: FastifyInstance) {
  // ─── Create Clinical Enquiry (Patient or Authenticated User) ───────────────
  app.post("/", { preHandler: requireAuth }, async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = EnquiryCreateSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
    }

    const { specialty, medicalSummary, preferredDistrict, budget, timeline } = parseResult.data;
    const patientId = request.user!.sub;

    const [newEnquiry] = await db
      .insert(enquiries)
      .values({
        patientId,
        specialty,
        medicalSummary,
        preferredDistrict,
        budget,
        timeline,
        status: "new",
      })
      .returning();

    // Record audit event
    await recordAuditLog({
      userId: patientId,
      userEmail: request.user!.email,
      userRole: request.user!.role,
      action: "CLINICAL_ENQUIRY_CREATED",
      entityType: "ENQUIRY",
      entityId: newEnquiry.id,
      details: {
        specialty,
        preferredDistrict,
      },
      ipAddress: request.ip,
      userAgent: request.headers["user-agent"],
    });

    return reply.status(201).send(successResponse({ enquiry: newEnquiry }));
  });

  // ─── List Enquiries with Filtering & Role-Based Scope ─────────────────────
  app.get("/", { preHandler: requireAuth }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userRole = request.user!.role;
    const userId = request.user!.sub;

    const parseResult = EnquiryQuerySchema.safeParse(request.query);
    if (!parseResult.success) {
      return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid query parameters", parseResult.error.format()));
    }

    const { status, specialty, patientId, assignedCoordinatorId, assignedHospitalId, assignedDoctorId, page = 1, limit = 20 } = parseResult.data;
    const offset = (page - 1) * limit;

    const conditions = [];

    // Patients can strictly only view their own enquiries
    if (userRole === "patient") {
      conditions.push(eq(enquiries.patientId, userId));
    } else {
      if (patientId) conditions.push(eq(enquiries.patientId, patientId));
      if (assignedCoordinatorId) conditions.push(eq(enquiries.assignedCoordinatorId, assignedCoordinatorId));
      if (assignedHospitalId) conditions.push(eq(enquiries.assignedHospitalId, assignedHospitalId));
      if (assignedDoctorId) conditions.push(eq(enquiries.assignedDoctorId, assignedDoctorId));
    }

    if (status) conditions.push(eq(enquiries.status, status));
    if (specialty) conditions.push(ilike(enquiries.specialty, `%${specialty}%`));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db.query.enquiries.findMany({
      where: whereClause,
      orderBy: [desc(enquiries.createdAt)],
      limit,
      offset,
    });

    return successResponse({
      enquiries: results,
      pagination: { page, limit, count: results.length },
    });
  });

  // ─── Get Single Enquiry Case Details with Linked Documents ────────────────
  app.get("/:id", { preHandler: requireAuth }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const userRole = request.user!.role;
    const userId = request.user!.sub;

    const enquiry = await db.query.enquiries.findFirst({
      where: eq(enquiries.id, id),
    });

    if (!enquiry) {
      return reply.status(404).send(errorResponse("NOT_FOUND", "Enquiry case not found"));
    }

    if (userRole === "patient" && enquiry.patientId !== userId) {
      return reply.status(403).send(errorResponse("FORBIDDEN", "Access denied to this enquiry case"));
    }

    // Fetch associated case documents
    const documents = await db.query.enquiryDocuments.findMany({
      where: eq(enquiryDocuments.enquiryId, id),
      orderBy: [desc(enquiryDocuments.uploadedAt)],
    });

    return successResponse({
      enquiry,
      documents,
    });
  });

  // ─── Update Case Pipeline Status (Medical Coordinators & Super Admins) ─────
  app.patch(
    "/:id/status",
    { preHandler: requireRole("super_admin", "admin", "medical_coordinator", "hospital_manager") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const parseResult = EnquiryStatusUpdateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
      }

      const { status, internalNotes, assignedCoordinatorId, assignedHospitalId, assignedDoctorId } = parseResult.data;

      const existing = await db.query.enquiries.findFirst({
        where: eq(enquiries.id, id),
      });

      if (!existing) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Enquiry case not found"));
      }

      const updatedNotes = internalNotes
        ? existing.internalNotes
          ? `${existing.internalNotes}\n[${new Date().toISOString()}] Status -> ${status}: ${internalNotes}`
          : `[${new Date().toISOString()}] Status -> ${status}: ${internalNotes}`
        : existing.internalNotes;

      const [updated] = await db
        .update(enquiries)
        .set({
          status,
          internalNotes: updatedNotes,
          assignedCoordinatorId: assignedCoordinatorId !== undefined ? assignedCoordinatorId : existing.assignedCoordinatorId,
          assignedHospitalId: assignedHospitalId !== undefined ? assignedHospitalId : existing.assignedHospitalId,
          assignedDoctorId: assignedDoctorId !== undefined ? assignedDoctorId : existing.assignedDoctorId,
          updatedAt: new Date(),
        })
        .where(eq(enquiries.id, id))
        .returning();

      // Record audit event
      await recordAuditLog({
        userId: request.user?.sub,
        userEmail: request.user?.email,
        userRole: request.user?.role,
        action: "CASE_STATUS_UPDATED",
        entityType: "ENQUIRY",
        entityId: id,
        details: {
          previousStatus: existing.status,
          newStatus: status,
          assignedHospitalId,
          assignedDoctorId,
        },
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      });

      return successResponse({ enquiry: updated });
    }
  );

  // ─── Assign Case to Kerala Hospital & Specialist Doctor ───────────────────
  app.post(
    "/:id/assign",
    { preHandler: requireRole("super_admin", "admin", "medical_coordinator") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const parseResult = EnquiryAssignSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
      }

      const { assignedCoordinatorId, assignedHospitalId, assignedDoctorId, internalNotes } = parseResult.data;

      const existing = await db.query.enquiries.findFirst({
        where: eq(enquiries.id, id),
      });

      if (!existing) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Enquiry case not found"));
      }

      const updatedNotes = internalNotes
        ? existing.internalNotes
          ? `${existing.internalNotes}\n[${new Date().toISOString()}] Assignments updated: ${internalNotes}`
          : `[${new Date().toISOString()}] Assignments updated: ${internalNotes}`
        : existing.internalNotes;

      const [updated] = await db
        .update(enquiries)
        .set({
          assignedCoordinatorId: assignedCoordinatorId || existing.assignedCoordinatorId,
          assignedHospitalId: assignedHospitalId || existing.assignedHospitalId,
          assignedDoctorId: assignedDoctorId || existing.assignedDoctorId,
          internalNotes: updatedNotes,
          updatedAt: new Date(),
        })
        .where(eq(enquiries.id, id))
        .returning();

      await recordAuditLog({
        userId: request.user?.sub,
        userEmail: request.user?.email,
        userRole: request.user?.role,
        action: "CASE_ASSIGNED",
        entityType: "ENQUIRY",
        entityId: id,
        details: {
          assignedCoordinatorId,
          assignedHospitalId,
          assignedDoctorId,
        },
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      });

      return successResponse({ enquiry: updated, message: "Case successfully assigned to coordinator, hospital, and specialist." });
    }
  );

  // ─── Request Specialist Second Opinion ────────────────────────────────────
  app.post(
    "/:id/request-opinion",
    { preHandler: requireRole("super_admin", "admin", "medical_coordinator") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const parseResult = EnquiryOpinionRequestSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
      }

      const { doctorId, hospitalId, clinicalNotes, urgency } = parseResult.data;

      const [enquiry, doctor, hospital] = await Promise.all([
        db.query.enquiries.findFirst({ where: eq(enquiries.id, id) }),
        db.query.doctors.findFirst({ where: eq(doctors.id, doctorId) }),
        db.query.hospitals.findFirst({ where: eq(hospitals.id, hospitalId) }),
      ]);

      if (!enquiry) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Enquiry case not found"));
      }

      if (!doctor || !hospital) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Specified doctor or hospital not found"));
      }

      const opinionNote = `[${new Date().toISOString()}] Second opinion requested from ${doctor.name} (${hospital.name}) [Urgency: ${urgency}]: ${clinicalNotes}`;
      const updatedNotes = enquiry.internalNotes
        ? `${enquiry.internalNotes}\n${opinionNote}`
        : opinionNote;

      const [updated] = await db
        .update(enquiries)
        .set({
          status: "opinion_requested",
          assignedDoctorId: doctorId,
          assignedHospitalId: hospitalId,
          internalNotes: updatedNotes,
          updatedAt: new Date(),
        })
        .where(eq(enquiries.id, id))
        .returning();

      await recordAuditLog({
        userId: request.user?.sub,
        userEmail: request.user?.email,
        userRole: request.user?.role,
        action: "SPECIALIST_OPINION_REQUESTED",
        entityType: "ENQUIRY",
        entityId: id,
        details: {
          doctorId,
          doctorName: doctor.name,
          hospitalId,
          hospitalName: hospital.name,
          urgency,
        },
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      });

      return successResponse({
        enquiry: updated,
        message: `Second opinion request dispatched to ${doctor.name} at ${hospital.name}.`,
      });
    }
  );
}

