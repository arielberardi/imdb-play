/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-namespace */

import { z } from "zod";
import logger from "./logger";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional().default("info"),
  NODE_ENV: z.enum(["development", "production", "test"]).optional().default("development"),
  TMDB_API_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;
type EnvSchema = z.infer<typeof envSchema>;

export function validateEnv(): void {
  const result = envSchema.safeParse(process.env);

  if (result.success) {
    return;
  }

  logger.error("Environment validation failed");

  result.error.issues.forEach((issue) => {
    logger.error(
      {
        path: issue.path.join("."),
        message: issue.message,
      },
      "Environment validation issue",
    );
  });

  process.exit(1);
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvSchema {}
  }
}

export {};
