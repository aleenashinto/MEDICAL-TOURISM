import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { DocumentUploadSchema } from "@maides/validation";
import { db } from "../../db.js";
import { enquiryDocuments, enquiries, eq } from "@maides/database";
import { successResponse, errorResponse } from "../../utils/response.js";
import { requireAuth } from "../../middleware/auth.js";

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

  // ─── Get Documents For Enquiry ────────────────────────────────────────────
  app.get(
    "/enquiry/:enquiryId",
    { preHandler: requireAuth },
    async (request: FastifyRequest, _reply: FastifyReply) => {
      const { enquiryId } = request.params as { enquiryId: string };

      const docs = await db.query.enquiryDocuments.findMany({
        where: eq(enquiryDocuments.enquiryId, enquiryId),
      });

      return successResponse({ documents: docs });
    }
  );
}
