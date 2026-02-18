import { MediaType } from "@/generated/prisma";
import { z } from "zod";

export const addToWatchlistSchema = z.object({
  titleId: z.string().trim().regex(/^\d+$/, "Title id must be a positive integer"),
  mediaType: z.nativeEnum(MediaType),
});
