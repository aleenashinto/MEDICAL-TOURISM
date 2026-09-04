import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { DoctorQuerySchema } from "@maides/validation";
import { db } from "../../db.js";
import { doctors, eq, and, ilike } from "@maides/database";
import { successResponse, errorResponse } from "../../utils/response.js";

export async function doctorRoutes(app: FastifyInstance) {
  // ─── List Doctors ─────────────────────────────────────────────────────────
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

  // ─── Get Doctor By ID / Slug ──────────────────────────────────────────────
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
}
