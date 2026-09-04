import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { db } from "../../db.js";
import { specialties, eq } from "@maides/database";
import { successResponse, errorResponse } from "../../utils/response.js";
import { requireRole } from "../../middleware/auth.js";
import { recordAuditLog } from "../../utils/audit.js";

const CreateSpecialtySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(150),
  description: z.string().min(10),
  iconName: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export async function specialtyRoutes(app: FastifyInstance) {
  // ─── Public List ──────────────────────────────────────────────────────────
  app.get("/", async () => {
    const list = await db.query.specialties.findMany({
      where: eq(specialties.active, true),
    });
    return successResponse(list);
  });

  // ─── Public Get By Slug ───────────────────────────────────────────────────
  app.get("/:slug", async (request: FastifyRequest, reply: FastifyReply) => {
    const { slug } = request.params as { slug: string };
    const specialty = await db.query.specialties.findFirst({
      where: eq(specialties.slug, slug),
    });
    if (!specialty) {
      return reply.status(404).send(errorResponse("NOT_FOUND", "Specialty not found"));
    }
    return successResponse(specialty);
  });

  // ─── Admin Create ─────────────────────────────────────────────────────────
  app.post(
    "/",
    { preHandler: requireRole("super_admin", "admin") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = CreateSpecialtySchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
      }

      const [created] = await db
        .insert(specialties)
        .values(parseResult.data)
        .returning();

      await recordAuditLog({
        userId: request.user?.sub,
        userEmail: request.user?.email,
        userRole: request.user?.role,
        action: "SPECIALTY_CREATED",
        entityType: "SPECIALTY",
        entityId: created.id,
        details: parseResult.data,
      });

      return reply.status(201).send(successResponse(created));
    }
  );
}
