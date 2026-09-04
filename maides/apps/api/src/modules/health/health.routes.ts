import { FastifyInstance } from "fastify";
import { successResponse } from "../../utils/response.js";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async () => {
    return successResponse({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "maides-api",
      version: "1.0.0",
    });
  });
}
