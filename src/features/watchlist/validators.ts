import { MediaType } from "@/generated/prisma";
import { z } from "zod";

export const addToWatchlistSchema = z.object({
  titleId: z.string().trim().min(1, "Title id is required"),
  mediaType: z.nativeEnum(MediaType),
});
