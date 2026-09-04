import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  TravelBookingCreateSchema,
  TravelBookingUpdateSchema,
  VisaInvitationCreateSchema,
} from "@maides/validation";
import { db } from "../../db.js";
import {
  travelBookings,
  visaInvitations,
  enquiries,
  hospitals,
  doctors,
  users,
  eq,
  desc,
} from "@maides/database";
import { successResponse, errorResponse } from "../../utils/response.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { recordAuditLog } from "../../utils/audit.js";

export async function travelRoutes(app: FastifyInstance) {
  // ─── Create Travel / Accommodation / Logistics Booking ─────────────────────
  app.post(
    "/bookings",
    {
      preHandler: requireRole(
        "super_admin",
        "admin",
        "travel_coordinator",
        "medical_coordinator"
      ),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = TravelBookingCreateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply
          .status(400)
          .send(errorResponse("VALIDATION_ERROR", "Invalid travel booking data", parseResult.error.format()));
      }

      const input = parseResult.data;

      // Verify enquiry exists
      const enquiry = await db.query.enquiries.findFirst({
        where: eq(enquiries.id, input.enquiryId),
      });

      if (!enquiry) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Enquiry not found"));
      }

      const [newBooking] = await db
        .insert(travelBookings)
        .values({
          enquiryId: input.enquiryId,
          patientId: input.patientId,
          coordinatorId: request.user!.sub,
          bookingType: input.bookingType,
          providerName: input.providerName,
          referenceNumber: input.referenceNumber || null,
          details: input.details,
          pickupLocation: input.pickupLocation || null,
          dropoffLocation: input.dropoffLocation || null,
          startDate: input.startDate ? new Date(input.startDate) : null,
          endDate: input.endDate ? new Date(input.endDate) : null,
          costUsd: input.costUsd,
          costInr: input.costInr,
          status: "confirmed",
          notes: input.notes || null,
        })
        .returning();

      await recordAuditLog({
        userId: request.user!.sub,
        userEmail: request.user!.email,
        userRole: request.user!.role,
        action: "TRAVEL_BOOKING_CREATED",
        entityType: "travel_booking",
        entityId: newBooking.id,
        details: {
          enquiryId: input.enquiryId,
          bookingType: input.bookingType,
          providerName: input.providerName,
        },
      });

      return reply.status(201).send(
        successResponse({
          booking: newBooking,
          message: `Travel booking for ${input.bookingType} confirmed successfully`,
        })
      );
    }
  );

  // ─── List Travel Bookings for a Case / Enquiry ─────────────────────────────
  app.get(
    "/bookings/enquiry/:enquiryId",
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { enquiryId } = request.params as { enquiryId: string };

      const enquiry = await db.query.enquiries.findFirst({
        where: eq(enquiries.id, enquiryId),
      });

      if (!enquiry) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Enquiry not found"));
      }

      // Patient access control check
      if (request.user!.role === "patient" && enquiry.patientId !== request.user!.sub) {
        return reply.status(403).send(errorResponse("FORBIDDEN", "Access denied"));
      }

      const bookingsList = await db.query.travelBookings.findMany({
        where: eq(travelBookings.enquiryId, enquiryId),
        orderBy: [desc(travelBookings.createdAt)],
      });

      return reply.send(
        successResponse({
          enquiryId,
          totalBookings: bookingsList.length,
          bookings: bookingsList,
        })
      );
    }
  );

  // ─── Update Travel Booking Status / Reference ──────────────────────────────
  app.patch(
    "/bookings/:id/status",
    {
      preHandler: requireRole(
        "super_admin",
        "admin",
        "travel_coordinator",
        "medical_coordinator"
      ),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const parseResult = TravelBookingUpdateSchema.safeParse(request.body);

      if (!parseResult.success) {
        return reply
          .status(400)
          .send(errorResponse("VALIDATION_ERROR", "Invalid update payload", parseResult.error.format()));
      }

      const existing = await db.query.travelBookings.findFirst({
        where: eq(travelBookings.id, id),
      });

      if (!existing) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Travel booking not found"));
      }

      const updateData: Record<string, any> = {
        updatedAt: new Date(),
      };

      if (parseResult.data.status) updateData.status = parseResult.data.status;
      if (parseResult.data.referenceNumber) updateData.referenceNumber = parseResult.data.referenceNumber;
      if (parseResult.data.notes) updateData.notes = parseResult.data.notes;
      if (parseResult.data.details) updateData.details = parseResult.data.details;

      const [updatedBooking] = await db
        .update(travelBookings)
        .set(updateData)
        .where(eq(travelBookings.id, id))
        .returning();

      await recordAuditLog({
        userId: request.user!.sub,
        userEmail: request.user!.email,
        userRole: request.user!.role,
        action: "TRAVEL_BOOKING_STATUS_UPDATED",
        entityType: "travel_booking",
        entityId: id,
        details: { status: updatedBooking.status },
      });

      return reply.send(
        successResponse({
          booking: updatedBooking,
          message: `Booking status updated to ${updatedBooking.status}`,
        })
      );
    }
  );

  // ─── Generate Official Hospital Medical Visa (e-Med Visa) Invitation Letter ─
  app.post(
    "/visa-invitation",
    {
      preHandler: requireRole(
        "super_admin",
        "admin",
        "medical_coordinator",
        "travel_coordinator",
        "hospital_manager"
      ),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = VisaInvitationCreateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply
          .status(400)
          .send(errorResponse("VALIDATION_ERROR", "Invalid visa invitation payload", parseResult.error.format()));
      }

      const input = parseResult.data;

      // Verify Hospital exists
      const hospital = await db.query.hospitals.findFirst({
        where: eq(hospitals.id, input.hospitalId),
      });

      if (!hospital) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Hospital partner not found"));
      }

      // Generate unique official Indian Medical Visa reference code: e.g. KL-MEDVISA-2026-XXXXX
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const invitationNumber = `KL-MEDVISA-${new Date().getFullYear()}-${randomSuffix}`;

      const [invitation] = await db
        .insert(visaInvitations)
        .values({
          enquiryId: input.enquiryId,
          patientId: input.patientId,
          hospitalId: input.hospitalId,
          doctorId: input.doctorId || null,
          invitationNumber,
          patientPassportNumber: input.patientPassportNumber,
          patientNationality: input.patientNationality,
          attendantName: input.attendantName || null,
          attendantPassportNumber: input.attendantPassportNumber || null,
          diagnosis: input.diagnosis,
          recommendedTreatment: input.recommendedTreatment,
          expectedArrivalDate: new Date(input.expectedArrivalDate),
          stayDurationDays: input.stayDurationDays,
          embassyCity: input.embassyCity || "Embassy of India",
          status: "issued",
          documentPath: `/documents/visa-invitations/${invitationNumber}.pdf`,
        })
        .returning();

      await recordAuditLog({
        userId: request.user!.sub,
        userEmail: request.user!.email,
        userRole: request.user!.role,
        action: "VISA_INVITATION_LETTER_ISSUED",
        entityType: "visa_invitation",
        entityId: invitation.id,
        details: {
          invitationNumber,
          hospitalName: hospital.name,
          patientPassport: input.patientPassportNumber,
        },
      });

      return reply.status(201).send(
        successResponse({
          invitation,
          hospitalDetails: {
            name: hospital.name,
            district: hospital.district,
            city: hospital.city,
            accreditations: hospital.accreditations,
            nearestAirport: hospital.nearestAirport,
          },
          message: "Official Medical Visa invitation letter generated successfully",
        })
      );
    }
  );

  // ─── Fetch Visa Invitations for a Case ─────────────────────────────────────
  app.get(
    "/visa-invitations/:enquiryId",
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

      const letters = await db.query.visaInvitations.findMany({
        where: eq(visaInvitations.enquiryId, enquiryId),
        orderBy: [desc(visaInvitations.issuedAt)],
      });

      return reply.send(
        successResponse({
          enquiryId,
          totalInvitations: letters.length,
          invitations: letters,
        })
      );
    }
  );
}
