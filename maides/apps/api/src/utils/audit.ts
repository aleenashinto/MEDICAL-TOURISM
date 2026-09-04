import { db } from "../db.js";
import { auditLogs } from "@maides/database";
import type { UserRole } from "@maides/types";

export interface LogAuditParams {
  userId?: string | null;
  userEmail?: string | null;
  userRole?: UserRole | null;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function recordAuditLog(params: LogAuditParams): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      userId: params.userId || null,
      userEmail: params.userEmail || null,
      userRole: params.userRole || null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      details: params.details || null,
      ipAddress: params.ipAddress || null,
      userAgent: params.userAgent || null,
    });
  } catch (error) {
    // Non-blocking logger to ensure main transaction is not disrupted, but logged to stderr
    console.error("[AUDIT_LOG_ERROR] Failed to record audit log:", error);
  }
}
