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

  // ─── Public: Dynamic Treatment Cost Estimator Calculator ──────────────────
  app.post("/estimate-cost", async (request: FastifyRequest, reply: FastifyReply) => {
    const { CostEstimateCalculatorSchema } = await import("@maides/validation");
    const parseResult = CostEstimateCalculatorSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
    }

    const { treatmentSlug, tier, stayDays, needAirportChauffeur, needAttendantAccommodation } = parseResult.data;

    const treatment = await db.query.treatments.findFirst({
      where: eq(treatments.slug, treatmentSlug),
    });

    if (!treatment) {
      return reply.status(404).send(errorResponse("NOT_FOUND", "Treatment protocol not found"));
    }

    const tierMultipliers: Record<string, number> = {
      "Budget Value": 0.85,
      "Standard Care": 1.0,
      "Platinum VIP": 1.45,
      "Ayurvedic Rejuvenation": 0.95,
    };

    const multiplier = tierMultipliers[tier] || 1.0;
    const baseCostUsd = Math.round(treatment.minUsd * multiplier);
    const duration = stayDays || treatment.typicalStayDays;
    
    // Auxiliary estimates
    const stayDailyRateUsd = tier === "Platinum VIP" ? 180 : tier === "Budget Value" ? 45 : 90;
    const stayCostUsd = duration * stayDailyRateUsd;
    const chauffeurCostUsd = needAirportChauffeur ? (tier === "Platinum VIP" ? 150 : 60) : 0;
    const attendantCostUsd = needAttendantAccommodation ? duration * 40 : 0;
    const preOpInvestigationsUsd = Math.round(baseCostUsd * 0.08);

    const totalEstimatedUsd = baseCostUsd + stayCostUsd + chauffeurCostUsd + attendantCostUsd + preOpInvestigationsUsd;
    const inrConversionRate = 88;
    const totalEstimatedInr = totalEstimatedUsd * inrConversionRate;
    const usBenchmarkCostUsd = treatment.usComparisonCostUsd || totalEstimatedUsd * 8;
    const savingsPercentage = Math.round(((usBenchmarkCostUsd - totalEstimatedUsd) / usBenchmarkCostUsd) * 100);

    return successResponse({
      estimate: {
        treatmentName: treatment.name,
        category: treatment.tagline,
        selectedTier: tier,
        stayDays: duration,
        costBreakdownUsd: {
          procedureBase: baseCostUsd,
          hospitalAndSuiteStay: stayCostUsd,
          preOpDiagnostics: preOpInvestigationsUsd,
          airportAndLocalChauffeur: chauffeurCostUsd,
          attendantHospitality: attendantCostUsd,
        },
        totalEstimatedUsd,
        totalEstimatedInr,
        usBenchmarkCostUsd,
        potentialSavingsUsd: usBenchmarkCostUsd - totalEstimatedUsd,
        savingsPercentage: `${savingsPercentage}%`,
        currency: "USD",
        inclusions: [
          "Specialist surgeon & anesthesia fees",
          "Operating theater and robotic navigation charges",
          "Dedicated Arabic/English medical coordinator",
          "Airport meet & greet assistance",
          "Complimentary 12-month telemedicine follow-up",
        ],
      },
    });
  });
}

