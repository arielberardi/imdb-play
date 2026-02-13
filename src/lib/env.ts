import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  IMDB_API_KEY: z.string().min(1, "IMDB_API_KEY is required"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional().default("info"),
  NODE_ENV: z.enum(["development", "production", "test"]).optional().default("development"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Environment validation failed:");
    if (error instanceof z.ZodError) {
      error.issues.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
    }
    process.exit(1);
  }
}

export const env = validateEnv();
