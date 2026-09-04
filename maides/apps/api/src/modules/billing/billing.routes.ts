import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  InvoiceCreateSchema,
  PaymentInitiateSchema,
  PaymentWebhookSchema,
} from "@maides/validation";
import { db } from "../../db.js";
import {
  invoices,
  payments,
  enquiries,
  hospitals,
  users,
  eq,
  desc,
} from "@maides/database";
import { successResponse, errorResponse } from "../../utils/response.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { recordAuditLog } from "../../utils/audit.js";
import crypto from "node:crypto";

export async function billingRoutes(app: FastifyInstance) {
  // ─── Create Treatment / Hospital Invoice ──────────────────────────────────
  app.post(
    "/invoices",
    {
      preHandler: requireRole(
        "super_admin",
        "admin",
        "medical_coordinator",
        "hospital_manager"
      ),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = InvoiceCreateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply
          .status(400)
          .send(errorResponse("VALIDATION_ERROR", "Invalid invoice payload", parseResult.error.format()));
      }

      const input = parseResult.data;

      // Verify enquiry exists
      const enquiry = await db.query.enquiries.findFirst({
        where: eq(enquiries.id, input.enquiryId),
      });

      if (!enquiry) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Enquiry not found"));
      }

      // Generate invoice number: INV-2026-XXXXX
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const invoiceNumber = `INV-${new Date().getFullYear()}-${randomSuffix}`;

      const [newInvoice] = await db
        .insert(invoices)
        .values({
          invoiceNumber,
          enquiryId: input.enquiryId,
          patientId: input.patientId,
          hospitalId: input.hospitalId,
          quotationId: input.quotationId || null,
          title: input.title,
          items: input.items,
          subtotalUsd: input.subtotalUsd,
          taxUsd: input.taxUsd,
          totalUsd: input.totalUsd,
          totalInr: input.totalInr,
          exchangeRate: String(input.exchangeRate),
          currency: input.currency,
          amountPaidUsd: 0,
          balanceDueUsd: input.totalUsd,
          status: "issued",
          dueDate: new Date(input.dueDate),
        })
        .returning();

      await recordAuditLog({
        userId: request.user!.sub,
        userEmail: request.user!.email,
        userRole: request.user!.role,
        action: "INVOICE_GENERATED",
        entityType: "invoice",
        entityId: newInvoice.id,
        details: {
          invoiceNumber,
          enquiryId: input.enquiryId,
          totalUsd: input.totalUsd,
        },
      });

      return reply.status(201).send(
        successResponse({
          invoice: newInvoice,
          message: "Invoice issued successfully",
        })
      );
    }
  );

  // ─── List Invoices for a Case / Enquiry ────────────────────────────────────
  app.get(
    "/invoices/enquiry/:enquiryId",
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

      const invoiceList = await db.query.invoices.findMany({
        where: eq(invoices.enquiryId, enquiryId),
        orderBy: [desc(invoices.createdAt)],
      });

      return reply.send(
        successResponse({
          enquiryId,
          totalInvoices: invoiceList.length,
          invoices: invoiceList,
        })
      );
    }
  );

  // ─── Initiate Online Deposit / Treatment Payment ───────────────────────────
  app.post(
    "/payments/initiate",
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = PaymentInitiateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply
          .status(400)
          .send(errorResponse("VALIDATION_ERROR", "Invalid payment request", parseResult.error.format()));
      }

      const input = parseResult.data;

      const invoice = await db.query.invoices.findFirst({
        where: eq(invoices.id, input.invoiceId),
      });

      if (!invoice) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Invoice not found"));
      }

      if (request.user!.role === "patient" && invoice.patientId !== request.user!.sub) {
        return reply.status(403).send(errorResponse("FORBIDDEN", "Access denied"));
      }

      const paymentTxRef = `tx-${crypto.randomBytes(12).toString("hex")}`;
      const exchangeRateNum = parseFloat(invoice.exchangeRate);
      const amountInr = Math.round(input.amountUsd * exchangeRateNum);

      const [newPayment] = await db
        .insert(payments)
        .values({
          invoiceId: invoice.id,
          patientId: invoice.patientId,
          paymentTransactionRef: paymentTxRef,
          amountUsd: input.amountUsd,
          amountInr,
          currency: invoice.currency,
          paymentMethod: input.paymentMethod,
          gatewayProvider: input.paymentMethod === "razorpay" ? "razorpay" : "stripe",
          status: "initiated",
        })
        .returning();

      return reply.send(
        successResponse({
          payment: newPayment,
          clientSecret: `pi_test_${crypto.randomBytes(16).toString("hex")}_secret`,
          gatewayCheckoutUrl: `https://checkout.stripe.com/pay/${paymentTxRef}`,
          message: "Payment transaction initiated successfully",
        })
      );
    }
  );

  // ─── Payment Gateway Webhook Receiver ──────────────────────────────────────
  app.post(
    "/payments/webhook",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = PaymentWebhookSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply
          .status(400)
          .send(errorResponse("VALIDATION_ERROR", "Invalid webhook data", parseResult.error.format()));
      }

      const { paymentTransactionRef, invoiceId, amountUsd, gatewayStatus } = parseResult.data;

      const invoice = await db.query.invoices.findFirst({
        where: eq(invoices.id, invoiceId),
      });

      if (!invoice) {
        return reply.status(404).send(errorResponse("NOT_FOUND", "Invoice not found"));
      }

      if (gatewayStatus === "succeeded" || gatewayStatus === "paid") {
        const newPaid = invoice.amountPaidUsd + amountUsd;
        const newBalance = Math.max(0, invoice.totalUsd - newPaid);
        const newStatus = newBalance === 0 ? "paid" : "partially_paid";

        await db
          .update(invoices)
          .set({
            amountPaidUsd: newPaid,
            balanceDueUsd: newBalance,
            status: newStatus,
            updatedAt: new Date(),
          })
          .where(eq(invoices.id, invoiceId));

        await db
          .update(payments)
          .set({
            status: "successful",
            paidAt: new Date(),
          })
          .where(eq(payments.paymentTransactionRef, paymentTransactionRef));

        await recordAuditLog({
          userId: invoice.patientId,
          action: "PAYMENT_SUCCEEDED",
          entityType: "invoice",
          entityId: invoiceId,
          details: { amountUsd, newBalance, status: newStatus },
        });

        return reply.send(
          successResponse({
            received: true,
            invoiceStatus: newStatus,
            balanceDueUsd: newBalance,
          })
        );
      } else {
        await db
          .update(payments)
          .set({ status: "failed" })
          .where(eq(payments.paymentTransactionRef, paymentTransactionRef));

        return reply.send(successResponse({ received: true, invoiceStatus: invoice.status }));
      }
    }
  );
}
