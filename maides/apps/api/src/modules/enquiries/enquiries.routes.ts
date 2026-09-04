import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { EnquiryCreateSchema, EnquiryStatusUpdateSchema } from "@maides/validation";
import { db } from "../../db.js";
import { enquiries, eq, desc } from "@maides/database";
import { successResponse, errorResponse } from "../../utils/response.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";

export async function enquiryRoutes(app: FastifyInstance) {
  // ─── Create Enquiry (Patient or Guest with Auth) ───────────────────────────
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

    return reply.status(201).send(successResponse({ enquiry: newEnquiry }));
  });

  // ─── List Enquiries (Patient gets their own, Staff gets all) ───────────────
  app.get("/", { preHandler: requireAuth }, async (request: FastifyRequest) => {
    const userRole = request.user!.role;
    const userId = request.user!.sub;

    let results;
    if (userRole === "patient") {
      results = await db.query.enquiries.findMany({
        where: eq(enquiries.patientId, userId),
        orderBy: [desc(enquiries.createdAt)],
      });
    } else {
      results = await db.query.enquiries.findMany({
        orderBy: [desc(enquiries.createdAt)],
      });
    }

    return successResponse({ enquiries: results });
  });

  // ─── Get Enquiry By ID ────────────────────────────────────────────────────
  app.get("/:id", { preHandler: requireAuth }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const userRole = request.user!.role;
    const userId = request.user!.sub;

    const enquiry = await db.query.enquiries.findFirst({
      where: eq(enquiries.id, id),
    });

    if (!enquiry) {
      return reply.status(404).send(errorResponse("NOT_FOUND", "Enquiry not found"));
    }

    if (userRole === "patient" && enquiry.patientId !== userId) {
      return reply.status(403).send(errorResponse("FORBIDDEN", "Access denied to this enquiry"));
    }

    return successResponse({ enquiry });
  });

  // ─── Update Enquiry Status (Staff Only) ────────────────────────────────────
  app.patch(
    "/:id/status",
    { preHandler: requireRole("super_admin", "admin", "coordinator", "hospital_partner") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const parseResult = EnquiryStatusUpdateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
      }

      const { status, internalNotes, assignedCoordinatorId, assignedHospitalId, assignedDoctorId } = parseResult.data;

      const [updated] = await db
        .update(enquiries)
        .set({
          status,
          internalNotes,
          assignedCoordinatorId,
          assignedHospitalId,
          assignedDoctorId,
          updatedAt: new Date(),
        })
        .where(eq(enquiries.id, id))
        .returning();

      if (!updated) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Enquiry not found"));
      }

      return successResponse({ enquiry: updated });
    }
  );
}
