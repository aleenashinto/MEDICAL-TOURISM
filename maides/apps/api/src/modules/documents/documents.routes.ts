import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { DocumentUploadSchema } from "@maides/validation";
import { db } from "../../db.js";
import { enquiryDocuments, enquiries, eq } from "@maides/database";
import { successResponse, errorResponse } from "../../utils/response.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";

export async function documentRoutes(app: FastifyInstance) {
  // ─── Upload Document Metadata (S3 Integration Hook) ───────────────────────
  app.post(
    "/upload",
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send(errorResponse("NO_FILE", "No file uploaded"));
      }

      const enquiryId = (data.fields.enquiryId as any)?.value;
      const documentType = (data.fields.documentType as any)?.value || "other";

      const parseResult = DocumentUploadSchema.safeParse({ enquiryId, documentType });
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid metadata", parseResult.error.format()));
      }

      // Check enquiry access
      const enquiry = await db.query.enquiries.findFirst({
        where: eq(enquiries.id, enquiryId),
      });

      if (!enquiry) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Enquiry not found"));
      }

      if (request.user!.role === "patient" && enquiry.patientId !== request.user!.sub) {
        return reply.status(403).send(errorResponse("FORBIDDEN", "Access denied"));
      }

      const buffer = await data.toBuffer();
      const storageKey = `enquiries/${enquiryId}/${Date.now()}_${data.filename}`;

      // In development/MinIO: simulated storage path
      const [newDoc] = await db
        .insert(enquiryDocuments)
        .values({
          enquiryId,
          patientId: request.user!.sub,
          documentType: parseResult.data.documentType,
          originalFileName: data.filename,
          storagePath: storageKey,
          fileSizeBytes: buffer.length,
          mimeType: data.mimetype,
        })
        .returning();

      return reply.status(201).send(successResponse({ document: newDoc }));
    }
  );

  // ─── Staff: Create Formal Treatment Quotation ────────────────────────────
  app.post(
    "/quotations",
    { preHandler: requireRole("super_admin", "admin", "medical_coordinator", "hospital_manager") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { QuotationCreateSchema } = await import("@maides/validation");
      const { quotations, enquiries } = await import("@maides/database");
      const { recordAuditLog } = await import("../../utils/audit.js");

      const parseResult = QuotationCreateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
      }

      const data = parseResult.data;

      const totalCostUsd =
        data.baseProcedureCostUsd +
        data.stayCostUsd +
        data.investigationsCostUsd +
        data.medicationsCostUsd +
        data.logisticsCostUsd;

      const totalCostInr = totalCostUsd * 88;
      const validUntil = new Date(Date.now() + (data.validityDays || 30) * 24 * 60 * 60 * 1000);

      const [newQuotation] = await db
        .insert(quotations)
        .values({
          enquiryId: data.enquiryId,
          patientId: data.patientId,
          hospitalId: data.hospitalId,
          doctorId: data.doctorId,
          title: data.title,
          tier: data.tier,
          treatmentName: data.treatmentName,
          baseProcedureCostUsd: data.baseProcedureCostUsd,
          hospitalStayDays: data.hospitalStayDays,
          stayCostUsd: data.stayCostUsd,
          investigationsCostUsd: data.investigationsCostUsd,
          medicationsCostUsd: data.medicationsCostUsd,
          logisticsCostUsd: data.logisticsCostUsd,
          totalCostUsd,
          totalCostInr,
          currency: "USD",
          inclusions: data.inclusions,
          exclusions: data.exclusions,
          termsAndConditions: data.termsAndConditions,
          status: "sent",
          validUntil,
        })
        .returning();

      // Update case status to quotation_sent
      await db
        .update(enquiries)
        .set({ status: "treatment_planned", updatedAt: new Date() })
        .where(eq(enquiries.id, data.enquiryId));

      await recordAuditLog({
        userId: request.user?.sub,
        userEmail: request.user?.email,
        userRole: request.user?.role,
        action: "QUOTATION_CREATED",
        entityType: "QUOTATION",
        entityId: newQuotation.id,
        details: { totalCostUsd, tier: data.tier, hospitalId: data.hospitalId },
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      });

      return reply.status(201).send(successResponse({ quotation: newQuotation }));
    }
  );

  // ─── Patient / Staff: Get Quotations For Case ─────────────────────────────
  app.get(
    "/quotations/enquiry/:enquiryId",
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { quotations, enquiries } = await import("@maides/database");
      const { enquiryId } = request.params as { enquiryId: string };

      const enquiry = await db.query.enquiries.findFirst({
        where: eq(enquiries.id, enquiryId),
      });

      if (!enquiry) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Enquiry case not found"));
      }

      if (request.user!.role === "patient" && enquiry.patientId !== request.user!.sub) {
        return reply.status(403).send(errorResponse("FORBIDDEN", "Access denied"));
      }

      const quoteList = await db.query.quotations.findMany({
        where: eq(quotations.enquiryId, enquiryId),
      });

      return successResponse({ quotations: quoteList });
    }
  );

  // ─── Patient: Accept / Reject Quotation ───────────────────────────────────
  app.patch(
    "/quotations/:id/status",
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { QuotationUpdateSchema } = await import("@maides/validation");
      const { quotations } = await import("@maides/database");
      const { recordAuditLog } = await import("../../utils/audit.js");
      const { id } = request.params as { id: string };

      const parseResult = QuotationUpdateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
      }

      const quote = await db.query.quotations.findFirst({
        where: eq(quotations.id, id),
      });

      if (!quote) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Quotation not found"));
      }

      if (request.user!.role === "patient" && quote.patientId !== request.user!.sub) {
        return reply.status(403).send(errorResponse("FORBIDDEN", "Access denied"));
      }

      const [updated] = await db
        .update(quotations)
        .set({
          status: parseResult.data.status || quote.status,
          updatedAt: new Date(),
        })
        .where(eq(quotations.id, id))
        .returning();

      await recordAuditLog({
        userId: request.user?.sub,
        userEmail: request.user?.email,
        userRole: request.user?.role,
        action: "QUOTATION_STATUS_UPDATED",
        entityType: "QUOTATION",
        entityId: id,
        details: { status: parseResult.data.status },
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      });

      return successResponse({ quotation: updated });
    }
  );
}

