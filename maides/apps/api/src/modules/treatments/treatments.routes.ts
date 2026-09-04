import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { db } from "../../db.js";
import { treatments, eq, ilike, and } from "@maides/database";
import { successResponse, errorResponse } from "../../utils/response.js";
import { requireRole } from "../../middleware/auth.js";
import { recordAuditLog } from "../../utils/audit.js";

const TreatmentQuerySchema = z.object({
  specialtyId: z.string().uuid().optional(),
  search: z.string().optional(),
  featured: z.string().transform((v) => v === "true").optional(),
});

const CreateTreatmentSchema = z.object({
  name: z.string().min(2).max(255),
  slug: z.string().min(2).max(150),
  specialtyId: z.string().uuid(),
  tagline: z.string().min(5),
  description: z.string().min(10),
  procedureOverview: z.string().min(10),
  whoRequires: z.array(z.string()).default([]),
  typicalStayDays: z.number().int().min(1).default(7),
  recoveryDays: z.number().int().min(1).default(14),
  minUsd: z.number().int().min(100),
  maxUsd: z.number().int().min(100),
  averageInr: z.number().int().min(1000),
  usComparisonCostUsd: z.number().int().optional(),
  topKeralaDistricts: z.array(z.string()).default([]),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  featured: z.boolean().default(false),
});

export async function treatmentRoutes(app: FastifyInstance) {
  // ─── Public List ──────────────────────────────────────────────────────────
  app.get("/", async (request: FastifyRequest) => {
    const parseResult = TreatmentQuerySchema.safeParse(request.query);
    const query = parseResult.success ? parseResult.data : {};

    const conditions = [eq(treatments.active, true)];
    if (query.specialtyId) conditions.push(eq(treatments.specialtyId, query.specialtyId));
    if (query.featured) conditions.push(eq(treatments.featured, true));
    if (query.search) conditions.push(ilike(treatments.name, `%${query.search}%`));

    const list = await db.query.treatments.findMany({
      where: and(...conditions),
    });

    return successResponse(list);
  });

  // ─── Public Get By Slug ───────────────────────────────────────────────────
  app.get("/:slug", async (request: FastifyRequest, reply: FastifyReply) => {
    const { slug } = request.params as { slug: string };
    const treatment = await db.query.treatments.findFirst({
      where: eq(treatments.slug, slug),
    });
    if (!treatment) {
      return reply.status(404).send(errorResponse("NOT_FOUND", "Treatment not found"));
    }
    return successResponse(treatment);
  });

  // ─── Admin Create ─────────────────────────────────────────────────────────
  app.post(
    "/",
    { preHandler: requireRole("super_admin", "admin") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = CreateTreatmentSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
      }

      const [created] = await db
        .insert(treatments)
        .values(parseResult.data)
        .returning();

      await recordAuditLog({
        userId: request.user?.sub,
        userEmail: request.user?.email,
        userRole: request.user?.role,
        action: "TREATMENT_CREATED",
        entityType: "TREATMENT",
        entityId: created.id,
        details: parseResult.data,
      });

      return reply.status(201).send(successResponse(created));
    }
  );
}
