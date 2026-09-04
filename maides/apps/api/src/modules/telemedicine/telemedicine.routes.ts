import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  TelemedicineScheduleSchema,
  TelemedicineCompleteSchema,
} from "@maides/validation";
import { db } from "../../db.js";
import {
  consultationSessions,
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
import crypto from "node:crypto";

export async function telemedicineRoutes(app: FastifyInstance) {
  // ─── Schedule Video Consultation / Telemedicine Session ───────────────────
  app.post(
    "/sessions",
    {
      preHandler: requireRole(
        "super_admin",
        "admin",
        "medical_coordinator",
        "patient",
        "hospital_manager"
      ),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = TelemedicineScheduleSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply
          .status(400)
          .send(errorResponse("VALIDATION_ERROR", "Invalid telemedicine session data", parseResult.error.format()));
      }

      const input = parseResult.data;

      // Patient self-authorization check
      if (request.user!.role === "patient" && input.patientId !== request.user!.sub) {
        return reply.status(403).send(errorResponse("FORBIDDEN", "Cannot schedule consultation for another user"));
      }

      // Verify enquiry exists
      const enquiry = await db.query.enquiries.findFirst({
        where: eq(enquiries.id, input.enquiryId),
      });

      if (!enquiry) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Enquiry not found"));
      }

      // Generate secure unique WebRTC/Daily meeting room ID
      const roomId = `room-med-${crypto.randomBytes(8).toString("hex")}`;
      const meetingJoinUrl = `https://telemed.maides.in/rooms/${roomId}`;

      const [newSession] = await db
        .insert(consultationSessions)
        .values({
          enquiryId: input.enquiryId,
          patientId: input.patientId,
          doctorId: input.doctorId,
          hospitalId: input.hospitalId,
          scheduledAt: new Date(input.scheduledAt),
          durationMinutes: input.durationMinutes,
          meetingRoomId: roomId,
          meetingJoinUrl,
          patientSymptoms: input.patientSymptoms,
          feeUsd: input.feeUsd,
          feeInr: input.feeInr,
          status: "scheduled",
        })
        .returning();

      await recordAuditLog({
        userId: request.user!.sub,
        userEmail: request.user!.email,
        userRole: request.user!.role,
        action: "TELEMEDICINE_SESSION_SCHEDULED",
        entityType: "consultation_session",
        entityId: newSession.id,
        details: {
          enquiryId: input.enquiryId,
          doctorId: input.doctorId,
          scheduledAt: input.scheduledAt,
        },
      });

      return reply.status(201).send(
        successResponse({
          session: newSession,
          message: "Telemedicine consultation scheduled successfully",
        })
      );
    }
  );

  // ─── List Telemedicine Sessions for an Enquiry / Case ───────────────────────
  app.get(
    "/sessions/enquiry/:enquiryId",
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

      const sessions = await db.query.consultationSessions.findMany({
        where: eq(consultationSessions.enquiryId, enquiryId),
        orderBy: [desc(consultationSessions.scheduledAt)],
      });

      return reply.send(
        successResponse({
          enquiryId,
          totalSessions: sessions.length,
          sessions,
        })
      );
    }
  );

  // ─── Join Secure Telemedicine Room (Generate Access Token) ─────────────────
  app.post(
    "/sessions/:id/join",
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      const session = await db.query.consultationSessions.findFirst({
        where: eq(consultationSessions.id, id),
      });

      if (!session) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Consultation session not found"));
      }

      // Check user authorization to join room
      const userRole = request.user!.role;
      const isAuthorized =
        userRole === "super_admin" ||
        userRole === "admin" ||
        userRole === "medical_coordinator" ||
        (userRole === "patient" && session.patientId === request.user!.sub) ||
        (userRole === "doctor" && session.doctorId === request.user!.sub);

      if (!isAuthorized) {
        return reply.status(403).send(errorResponse("FORBIDDEN", "Not authorized to join this consultation"));
      }

      // In production: generate Daily.co / Agora WebRTC room token
      const roomToken = crypto.randomBytes(24).toString("hex");

      // Mark session in progress if not already completed
      if (session.status === "scheduled") {
        await db
          .update(consultationSessions)
          .set({ status: "in_progress", startedAt: new Date(), updatedAt: new Date() })
          .where(eq(consultationSessions.id, id));
      }

      await recordAuditLog({
        userId: request.user!.sub,
        userEmail: request.user!.email,
        userRole: request.user!.role,
        action: "TELEMEDICINE_ROOM_JOINED",
        entityType: "consultation_session",
        entityId: id,
        details: { meetingRoomId: session.meetingRoomId },
      });

      return reply.send(
        successResponse({
          sessionId: session.id,
          roomId: session.meetingRoomId,
          roomToken,
          joinUrl: `${session.meetingJoinUrl}?token=${roomToken}`,
          role: userRole,
        })
      );
    }
  );

  // ─── Doctor: Complete Telemedicine Consultation & Submit Clinical Summary ─
  app.post(
    "/sessions/:id/complete",
    { preHandler: requireRole("doctor", "super_admin", "admin", "medical_coordinator") },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const parseResult = TelemedicineCompleteSchema.safeParse(request.body);

      if (!parseResult.success) {
        return reply
          .status(400)
          .send(errorResponse("VALIDATION_ERROR", "Invalid completion payload", parseResult.error.format()));
      }

      const session = await db.query.consultationSessions.findFirst({
        where: eq(consultationSessions.id, id),
      });

      if (!session) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Consultation session not found"));
      }

      const [completedSession] = await db
        .update(consultationSessions)
        .set({
          status: "completed",
          doctorPrescription: parseResult.data.doctorPrescription,
          clinicalRecommendations: parseResult.data.clinicalRecommendations,
          recordingUrl: parseResult.data.recordingUrl || null,
          endedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(consultationSessions.id, id))
        .returning();

      await recordAuditLog({
        userId: request.user!.sub,
        userEmail: request.user!.email,
        userRole: request.user!.role,
        action: "TELEMEDICINE_SESSION_COMPLETED",
        entityType: "consultation_session",
        entityId: id,
        details: { doctorPrescription: parseResult.data.doctorPrescription },
      });

      return reply.send(
        successResponse({
          session: completedSession,
          message: "Consultation marked completed with clinical prescription recorded",
        })
      );
    }
  );
}
