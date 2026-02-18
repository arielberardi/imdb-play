import { MediaType } from "@/generated/prisma";
import { z } from "zod";

export const upsertProgressSchema = z.object({
  titleId: z.string().trim().regex(/^\d+$/, "Title id must be a positive integer"),
  mediaType: z.nativeEnum(MediaType),
  progressSeconds: z.number().positive("Progress must be greater than 0"),
  durationSeconds: z.number().positive("Duration must be greater than 0"),
});
