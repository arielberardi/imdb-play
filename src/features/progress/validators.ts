import { MediaType } from "@/generated/prisma";
import { z } from "zod";

export const upsertProgressSchema = z.object({
  imdbId: z.string().trim().min(1, "Title id is required"),
  mediaType: z.nativeEnum(MediaType),
  progressSeconds: z.number().positive("Progress must be greater than 0"),
  durationSeconds: z.number().positive("Duration must be greater than 0"),
});
