import Fastify, { FastifyInstance, FastifyError } from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { config } from "./config.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { enquiryRoutes } from "./modules/enquiries/enquiries.routes.js";
import { hospitalRoutes } from "./modules/hospitals/hospitals.routes.js";
import { doctorRoutes } from "./modules/doctors/doctors.routes.js";
import { documentRoutes } from "./modules/documents/documents.routes.js";
import { errorResponse } from "./utils/response.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: config.NODE_ENV === "development",
  });

  // ─── Plugins ──────────────────────────────────────────────────────────────
  await app.register(cors, {
    origin: config.ALLOWED_ORIGINS.split(",").map((o) => o.trim()),
    credentials: true,
  });

  await app.register(cookie, {
    secret: config.COOKIE_SECRET,
  });

  await app.register(multipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB max file size (scans/DICOMs)
    },
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  // ─── Swagger Documentation ────────────────────────────────────────────────
  await app.register(swagger, {
    openapi: {
      info: {
        title: "MAIDES REST API",
        description: "Kerala Medical Tourism & International Patient Assistance Platform Backend",
        version: "1.0.0",
      },
      servers: [
        {
          url: `http://localhost:${config.PORT}`,
          description: "Local development server",
        },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
  });

  // ─── Global Error Handler ─────────────────────────────────────────────────
  app.setErrorHandler((error: FastifyError, _request, reply) => {
    app.log.error(error);
    const statusCode = error.statusCode || 500;
    return reply.status(statusCode).send(
      errorResponse(
        error.code || "INTERNAL_SERVER_ERROR",
        error.message || "An unexpected error occurred"
      )
    );
  });

  // ─── Register API Routes ──────────────────────────────────────────────────
  await app.register(healthRoutes, { prefix: "/api/v1" });
  await app.register(authRoutes, { prefix: "/api/v1/auth" });
  await app.register(enquiryRoutes, { prefix: "/api/v1/enquiries" });
  await app.register(hospitalRoutes, { prefix: "/api/v1/hospitals" });
  await app.register(doctorRoutes, { prefix: "/api/v1/doctors" });
  await app.register(documentRoutes, { prefix: "/api/v1/documents" });

  return app;
}
