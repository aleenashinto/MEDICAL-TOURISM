import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const ConfigSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().default("postgresql://maides:maides_dev_password@localhost:5432/maides"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  JWT_SECRET: z.string().min(16).default("super_secret_jwt_key_32_characters_minimum"),
  JWT_EXPIRY: z.string().default("7d"),
  COOKIE_SECRET: z.string().min(16).default("super_secret_cookie_key_32_chars"),
  ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),
  S3_ENDPOINT: z.string().optional(),
  S3_BUCKET: z.string().default("maides-documents"),
  S3_ACCESS_KEY: z.string().default("maides_minio"),
  S3_SECRET_KEY: z.string().default("maides_minio_secret"),
});

export const config = ConfigSchema.parse(process.env);
