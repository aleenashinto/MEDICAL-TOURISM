import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { DoctorQuerySchema, DoctorCreateSchema, DoctorUpdateSchema, DoctorOpinionResponseSchema } from "@maides/validation";
import { db } from "../../db.js";
import { doctors, enquiries, eq, and, ilike, desc } from "@maides/database";
import { successResponse, errorResponse } from "../../utils/response.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { recordAuditLog } from "../../utils/audit.js";

export async function doctorRoutes(app: FastifyInstance) {
  // ─── Public: List Doctors with Filters ─────────────────────────────────────
  app.get("/", async (request: FastifyRequest) => {
    const parseResult = DoctorQuerySchema.safeParse(request.query);
    const query = parseResult.success ? parseResult.data : { page: 1, limit: 20 };

    const conditions = [eq(doctors.active, true)];

    if (query.specialty) {
      conditions.push(ilike(doctors.specialty, `%${query.specialty}%`));
    }
    if (query.hospitalId) {
      conditions.push(eq(doctors.hospitalId, query.hospitalId));
    }
    if (query.featured) {
      conditions.push(eq(doctors.featured, true));
    }
    if (query.videoConsult) {
      conditions.push(eq(doctors.videoConsultationAvailable, true));
    }
    if (query.search) {
      conditions.push(ilike(doctors.name, `%${query.search}%`));
    }

    const results = await db.query.doctors.findMany({
      where: and(...conditions),
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
    });

    return successResponse(results, {
      page: query.page,
      limit: query.limit,
      total: results.length,
    });
  });

  // ─── Public: Get Doctor By ID / Slug ──────────────────────────────────────
  app.get("/:idOrSlug", async (request: FastifyRequest, reply: FastifyReply) => {
    const { idOrSlug } = request.params as { idOrSlug: string };

    const doctor = await db.query.doctors.findFirst({
      where: idOrSlug.includes("-")
        ? eq(doctors.slug, idOrSlug)
        : eq(doctors.id, idOrSlug),
    });

    if (!doctor) {
      return reply.status(404).send(errorResponse("NOT_FOUND", "Doctor not found"));
    }

    return successResponse(doctor);
  });

  // ─── Admin / Hospital Manager: Create Doctor Profile ──────────────────────
  app.post(
    "/",
    { preHandler: requireRole("super_admin", "admin", "hospital_manager") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = DoctorCreateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
      }

      const data = parseResult.data;

      const [newDoctor] = await db
        .insert(doctors)
        .values({
          ...data,
          rating: "4.95",
        })
        .returning();

      await recordAuditLog({
        userId: request.user?.sub,
        userEmail: request.user?.email,
        userRole: request.user?.role,
        action: "DOCTOR_CREATED",
        entityType: "DOCTOR",
        entityId: newDoctor.id,
        details: { name: newDoctor.name, specialty: newDoctor.specialty, hospitalId: newDoctor.hospitalId },
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      });

      return reply.status(201).send(successResponse({ doctor: newDoctor }));
    }
  );

  // ─── Admin / Doctor: Update Doctor Profile ─────────────────────────────────
  app.patch(
    "/:id",
    { preHandler: requireRole("super_admin", "admin", "hospital_manager", "doctor") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const parseResult = DoctorUpdateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
      }

      const [updatedDoctor] = await db
        .update(doctors)
        .set(parseResult.data as any)
        .where(eq(doctors.id, id))
        .returning();

      if (!updatedDoctor) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Doctor not found"));
      }

      await recordAuditLog({
        userId: request.user?.sub,
        userEmail: request.user?.email,
        userRole: request.user?.role,
        action: "DOCTOR_UPDATED",
        entityType: "DOCTOR",
        entityId: id,
        details: parseResult.data,
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      });

      return successResponse({ doctor: updatedDoctor });
    }
  );

  // ─── Doctor Portal: Get Assigned Clinical Cases ───────────────────────────
  app.get(
    "/:id/cases",
    { preHandler: requireRole("super_admin", "admin", "doctor", "medical_coordinator") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      const assignedCases = await db.query.enquiries.findMany({
        where: eq(enquiries.assignedDoctorId, id),
        orderBy: [desc(enquiries.createdAt)],
      });

      return successResponse({ cases: assignedCases, count: assignedCases.length });
    }
  );

  // ─── Doctor Portal: Submit Clinical Second Opinion / Treatment Protocol ───
  app.post(
    "/:id/opinions/:enquiryId",
    { preHandler: requireRole("super_admin", "admin", "doctor", "medical_coordinator") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id, enquiryId } = request.params as { id: string; enquiryId: string };
      const parseResult = DoctorOpinionResponseSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
      }

      const [doctor, enquiry] = await Promise.all([
        db.query.doctors.findFirst({ where: eq(doctors.id, id) }),
        db.query.enquiries.findFirst({ where: eq(enquiries.id, enquiryId) }),
      ]);

      if (!doctor) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Doctor not found"));
      }
      if (!enquiry) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Enquiry case not found"));
      }

      const { clinicalAssessment, treatmentRecommendation, estimatedStayDays, estimatedRecoveryDays, estimatedCostRangeUsd, fitToFlyNotes } = parseResult.data;

      const opinionBlock = `[${new Date().toISOString()}] CLINICAL OPINION SUBMITTED BY ${doctor.name}:\n` +
        `- Assessment: ${clinicalAssessment}\n` +
        `- Recommended Protocol: ${treatmentRecommendation}\n` +
        `- Hospital Stay: ${estimatedStayDays} days | Recovery: ${estimatedRecoveryDays} days\n` +
        `- Estimated Cost: $${estimatedCostRangeUsd.min} - $${estimatedCostRangeUsd.max} USD` +
        (fitToFlyNotes ? `\n- Fit to Fly: ${fitToFlyNotes}` : "");

      const updatedNotes = enquiry.internalNotes
        ? `${enquiry.internalNotes}\n\n${opinionBlock}`
        : opinionBlock;

      const [updatedCase] = await db
        .update(enquiries)
        .set({
          status: "opinion_received",
          internalNotes: updatedNotes,
          updatedAt: new Date(),
        })
        .where(eq(enquiries.id, enquiryId))
        .returning();

      await recordAuditLog({
        userId: request.user?.sub,
        userEmail: request.user?.email,
        userRole: request.user?.role,
        action: "CLINICAL_OPINION_SUBMITTED",
        entityType: "ENQUIRY",
        entityId: enquiryId,
        details: {
          doctorId: id,
          doctorName: doctor.name,
          estimatedCostRangeUsd,
          estimatedStayDays,
        },
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      });

      return successResponse({
        enquiry: updatedCase,
        message: "Clinical second opinion and treatment plan successfully recorded.",
      });
    }
  );
}

