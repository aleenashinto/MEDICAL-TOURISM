import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "@maides/auth";
import { config } from "../config.js";
import { errorResponse } from "../utils/response.js";
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
    await requireAuth(request, reply);
    if (!request.user || !allowedRoles.includes(request.user.role)) {
      return reply.status(403).send(errorResponse("FORBIDDEN", "Insufficient permissions"));
    }
  };
}
