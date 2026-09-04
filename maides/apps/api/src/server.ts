import { buildApp } from "./app.js";
import { config } from "./config.js";

async function start() {
  try {
    const app = await buildApp();
    await app.listen({ port: config.PORT, host: "0.0.0.0" });
    console.log(`🚀 MAIDES REST API is running on http://localhost:${config.PORT}`);
    console.log(`📖 Swagger API documentation available at http://localhost:${config.PORT}/docs`);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
