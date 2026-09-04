import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { HospitalQuerySchema, HospitalCreateSchema, HospitalUpdateSchema } from "@maides/validation";
import { db } from "../../db.js";
import { hospitals, doctors, enquiries, eq, and, ilike, desc } from "@maides/database";
import { successResponse, errorResponse } from "../../utils/response.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { recordAuditLog } from "../../utils/audit.js";

export async function hospitalRoutes(app: FastifyInstance) {
  // ─── Public: List Hospitals with Filters ───────────────────────────────────
  app.get("/", async (request: FastifyRequest) => {
    const parseResult = HospitalQuerySchema.safeParse(request.query);
    const query = parseResult.success ? parseResult.data : { page: 1, limit: 20 };

    const conditions = [eq(hospitals.active, true)];

    if (query.region) {
      conditions.push(eq(hospitals.region, query.region));
    }
    if (query.type) {
      conditions.push(eq(hospitals.type, query.type));
    }
    if (query.featured) {
      conditions.push(eq(hospitals.featured, true));
    }
    if (query.search) {
      conditions.push(ilike(hospitals.name, `%${query.search}%`));
    }

    const results = await db.query.hospitals.findMany({
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

  // ─── Public: Get Hospital By ID / Slug with Doctors ────────────────────────
  app.get("/:idOrSlug", async (request: FastifyRequest, reply: FastifyReply) => {
    const { idOrSlug } = request.params as { idOrSlug: string };

    const hospital = await db.query.hospitals.findFirst({
      where: idOrSlug.includes("-")
        ? eq(hospitals.slug, idOrSlug)
        : eq(hospitals.id, idOrSlug),
    });

    if (!hospital) {
      return reply.status(404).send(errorResponse("NOT_FOUND", "Hospital not found"));
    }

    const hospitalDoctors = await db.query.doctors.findMany({
      where: and(eq(doctors.hospitalId, hospital.id), eq(doctors.active, true)),
    });

    return successResponse({
      ...hospital,
      doctors: hospitalDoctors,
    });
  });

  // ─── Admin / Hospital Manager: Create Hospital Profile ─────────────────────
  app.post(
    "/",
    { preHandler: requireRole("super_admin", "admin", "hospital_manager") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = HospitalCreateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
      }

      const data = parseResult.data;

      const [newHospital] = await db
        .insert(hospitals)
        .values({
          ...data,
          rating: data.rating || "4.9",
        })
        .returning();

      await recordAuditLog({
        userId: request.user?.sub,
        userEmail: request.user?.email,
        userRole: request.user?.role,
        action: "HOSPITAL_CREATED",
        entityType: "HOSPITAL",
        entityId: newHospital.id,
        details: { name: newHospital.name, city: newHospital.city, district: newHospital.district },
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      });

      return reply.status(201).send(successResponse({ hospital: newHospital }));
    }
  );

  // ─── Admin / Hospital Manager: Update Hospital Profile ─────────────────────
  app.patch(
    "/:id",
    { preHandler: requireRole("super_admin", "admin", "hospital_manager") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const parseResult = HospitalUpdateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
      }

      const [updatedHospital] = await db
        .update(hospitals)
        .set(parseResult.data as any)
        .where(eq(hospitals.id, id))
        .returning();

      if (!updatedHospital) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Hospital not found"));
      }

      await recordAuditLog({
        userId: request.user?.sub,
        userEmail: request.user?.email,
        userRole: request.user?.role,
        action: "HOSPITAL_UPDATED",
        entityType: "HOSPITAL",
        entityId: id,
        details: parseResult.data,
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      });

      return successResponse({ hospital: updatedHospital });
    }
  );

  // ─── Hospital Portal: Get Assigned Clinical Cases ─────────────────────────
  app.get(
    "/:id/cases",
    { preHandler: requireRole("super_admin", "admin", "hospital_manager", "medical_coordinator") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      const assignedCases = await db.query.enquiries.findMany({
        where: eq(enquiries.assignedHospitalId, id),
        orderBy: [desc(enquiries.createdAt)],
      });

      return successResponse({ cases: assignedCases, count: assignedCases.length });
    }
  );
}

