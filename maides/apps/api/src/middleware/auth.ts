import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "@maides/auth";
import { config } from "../config.js";
import { errorResponse } from "../utils/response.js";
import { recordAuditLog } from "../utils/audit.js";
import type { AuthTokenPayload, UserRole } from "@maides/types";

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthTokenPayload;
  }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const cookieToken = request.cookies.token;
  const authHeader = request.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const token = cookieToken || bearerToken;

  if (!token) {
    return reply.status(401).send(errorResponse("UNAUTHORIZED", "Authentication required"));
  }

  try {
    const decoded = verifyToken(token, config.JWT_SECRET);
    request.user = decoded;
  } catch {
    return reply.status(401).send(errorResponse("INVALID_TOKEN", "Invalid or expired token"));
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const cookieToken = request.cookies.token;
    const authHeader = request.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = cookieToken || bearerToken;

    if (!token) {
      return reply.status(401).send(errorResponse("UNAUTHORIZED", "Authentication required"));
    }

    let decoded: AuthTokenPayload;
    try {
      decoded = verifyToken(token, config.JWT_SECRET);
      request.user = decoded;
    } catch {
      return reply.status(401).send(errorResponse("INVALID_TOKEN", "Invalid or expired token"));
    }

    if (!allowedRoles.includes(decoded.role)) {
      // Record unauthorized breach attempt to audit log
      await recordAuditLog({
        userId: decoded.sub,
        userEmail: decoded.email,
        userRole: decoded.role,
        action: "RBAC_ACCESS_DENIED",
        entityType: "ROUTE_ENDPOINT",
        entityId: request.url,
        details: {
          requiredRoles: allowedRoles,
          actualRole: decoded.role,
        },
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      });

      return reply.status(403).send(errorResponse("FORBIDDEN", "Insufficient permissions for this operation"));
    }
  };
}
