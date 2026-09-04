import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { HospitalQuerySchema } from "@maides/validation";
import { db } from "../../db.js";
import { hospitals, eq, and, ilike } from "@maides/database";
import { successResponse, errorResponse } from "../../utils/response.js";

export async function hospitalRoutes(app: FastifyInstance) {
  // ─── List Hospitals ───────────────────────────────────────────────────────
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

  // ─── Get Hospital By ID / Slug ────────────────────────────────────────────
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

    return successResponse(hospital);
  });
}
