import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  DischargeSummaryCreateSchema,
  PatientFeedbackCreateSchema,
} from "@maides/validation";
import { db } from "../../db.js";
import {
  dischargeSummaries,
  patientFeedbacks,
  enquiries,
  doctors,
  hospitals,
  users,
  eq,
  desc,
} from "@maides/database";
import { successResponse, errorResponse } from "../../utils/response.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { recordAuditLog } from "../../utils/audit.js";

export async function followupRoutes(app: FastifyInstance) {
  // ─── Doctor / Hospital: Submit Official Discharge Summary & Recovery Plan ─
  app.post(
    "/discharge",
    {
      preHandler: requireRole(
        "doctor",
        "hospital_manager",
        "super_admin",
        "admin",
        "medical_coordinator"
      ),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = DischargeSummaryCreateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply
          .status(400)
          .send(errorResponse("VALIDATION_ERROR", "Invalid discharge summary payload", parseResult.error.format()));
      }

      const input = parseResult.data;

      // Verify enquiry exists
      const enquiry = await db.query.enquiries.findFirst({
        where: eq(enquiries.id, input.enquiryId),
      });

      if (!enquiry) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Enquiry not found"));
      }

      const [newDischarge] = await db
        .insert(dischargeSummaries)
        .values({
          enquiryId: input.enquiryId,
          patientId: input.patientId,
          hospitalId: input.hospitalId,
          doctorId: input.doctorId,
          admissionDate: new Date(input.admissionDate),
          dischargeDate: new Date(input.dischargeDate),
          finalDiagnosis: input.finalDiagnosis,
          procedurePerformed: input.procedurePerformed,
          hospitalCourse: input.hospitalCourse,
          medicationsOnDischarge: input.medicationsOnDischarge,
          dietaryInstructions: input.dietaryInstructions || null,
          activityRestrictions: input.activityRestrictions || null,
          emergencyWarningSigns: input.emergencyWarningSigns,
          fitToFlyDate: input.fitToFlyDate ? new Date(input.fitToFlyDate) : null,
          fitToFlyCertified: input.fitToFlyCertified,
          nextFollowupDate: input.nextFollowupDate ? new Date(input.nextFollowupDate) : null,
        })
        .returning();

      // Automatically transition enquiry case status to follow_up
      await db
        .update(enquiries)
        .set({ status: "follow_up", updatedAt: new Date() })
        .where(eq(enquiries.id, input.enquiryId));

      await recordAuditLog({
        userId: request.user!.sub,
        userEmail: request.user!.email,
        userRole: request.user!.role,
        action: "DISCHARGE_SUMMARY_ISSUED",
        entityType: "discharge_summary",
        entityId: newDischarge.id,
        details: {
          enquiryId: input.enquiryId,
          procedurePerformed: input.procedurePerformed,
          fitToFlyCertified: input.fitToFlyCertified,
        },
      });

      return reply.status(201).send(
        successResponse({
          dischargeSummary: newDischarge,
          message: "Discharge summary & recovery plan recorded successfully; case moved to follow_up",
        })
      );
    }
  );

  // ─── Fetch Discharge & Recovery Protocol for a Case ────────────────────────
  app.get(
    "/enquiry/:enquiryId",
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { enquiryId } = request.params as { enquiryId: string };

      const enquiry = await db.query.enquiries.findFirst({
        where: eq(enquiries.id, enquiryId),
      });

      if (!enquiry) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Enquiry not found"));
      }

      if (request.user!.role === "patient" && enquiry.patientId !== request.user!.sub) {
        return reply.status(403).send(errorResponse("FORBIDDEN", "Access denied"));
      }

      const summaries = await db.query.dischargeSummaries.findMany({
        where: eq(dischargeSummaries.enquiryId, enquiryId),
        orderBy: [desc(dischargeSummaries.createdAt)],
      });

      const feedbacks = await db.query.patientFeedbacks.findMany({
        where: eq(patientFeedbacks.enquiryId, enquiryId),
        orderBy: [desc(patientFeedbacks.createdAt)],
      });

      return reply.send(
        successResponse({
          enquiryId,
          caseStatus: enquiry.status,
          dischargeSummaries: summaries,
          patientFeedbacks: feedbacks,
        })
      );
    }
  );

  // ─── Patient: Submit Feedback, Star Ratings & NPS Survey ───────────────────
  app.post(
    "/feedback",
    { preHandler: requireRole("patient", "super_admin", "admin") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = PatientFeedbackCreateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply
          .status(400)
          .send(errorResponse("VALIDATION_ERROR", "Invalid feedback payload", parseResult.error.format()));
      }

      const input = parseResult.data;

      if (request.user!.role === "patient" && input.patientId !== request.user!.sub) {
        return reply.status(403).send(errorResponse("FORBIDDEN", "Cannot submit feedback on behalf of another patient"));
      }

      const [newFeedback] = await db
        .insert(patientFeedbacks)
        .values({
          enquiryId: input.enquiryId,
          patientId: input.patientId,
          hospitalId: input.hospitalId,
          doctorId: input.doctorId || null,
          overallRating: input.overallRating,
          hospitalRating: input.hospitalRating,
          doctorRating: input.doctorRating,
          coordinatorRating: input.coordinatorRating,
          npsScore: input.npsScore,
          reviewComments: input.reviewComments || null,
          testimonialPermissionGranted: input.testimonialPermissionGranted,
        })
        .returning();

      await recordAuditLog({
        userId: request.user!.sub,
        userEmail: request.user!.email,
        userRole: request.user!.role,
        action: "PATIENT_FEEDBACK_SUBMITTED",
        entityType: "patient_feedback",
        entityId: newFeedback.id,
        details: {
          enquiryId: input.enquiryId,
          overallRating: input.overallRating,
          npsScore: input.npsScore,
        },
      });

      return reply.status(201).send(
        successResponse({
          feedback: newFeedback,
          message: "Thank you for sharing your Kerala medical experience feedback!",
        })
      );
    }
  );
}
