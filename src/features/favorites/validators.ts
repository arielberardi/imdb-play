import { MediaType } from "@/generated/prisma";
import { z } from "zod";

export const addFavoriteSchema = z.object({
  imdbId: z.string().trim().min(1, "Title id is required"),
  mediaType: z.nativeEnum(MediaType),
});
