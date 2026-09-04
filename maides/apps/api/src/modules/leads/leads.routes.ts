import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { db } from "../../db.js";
import { leads, eq, desc } from "@maides/database";
import { successResponse, errorResponse } from "../../utils/response.js";
import { requireRole } from "../../middleware/auth.js";
import { recordAuditLog } from "../../utils/audit.js";

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

  // ─── Staff CRM: List Leads ────────────────────────────────────────────────
  app.get(
    "/",
    { preHandler: requireRole("super_admin", "admin", "sales_crm_agent", "medical_coordinator") },
    async (request: FastifyRequest) => {
      const { status } = request.query as { status?: any };

      const leadList = await db.query.leads.findMany({
        where: status ? eq(leads.status, status) : undefined,
        orderBy: [desc(leads.createdAt)],
      });

      return successResponse({ leads: leadList });
    }
  );
}
