"use server";

import type {
  AddFavoriteInput,
  FavoriteActionResult,
  FavoriteItem,
} from "@/features/favorites/types";
import { addFavoriteSchema } from "@/features/favorites/validators";
import { authRateLimitedAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addFavorite, listUserFavorites, removeFavorite } from "./services/favorites.service";

const removeFavoriteSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Title id must be a positive integer.");

const addFavoriteSafeAction = authRateLimitedAction({
  keyPrefix: "favorites:add",
  limit: 20,
  windowMs: 60_000,
})
  .inputSchema(addFavoriteSchema)
  .action(async ({ parsedInput, ctx }) => {
    await addFavorite(ctx.user.id, parsedInput.titleId, parsedInput.mediaType);

    revalidatePath("/");
    revalidatePath(`/movies/${parsedInput.titleId}`);
    revalidatePath(`/series/${parsedInput.titleId}`);

    return {
      success: true,
    } satisfies FavoriteActionResult;
  });

const removeFavoriteSafeAction = authRateLimitedAction({
  keyPrefix: "favorites:remove",
  limit: 20,
  windowMs: 60_000,
})
  .inputSchema(removeFavoriteSchema)
  .action(async ({ parsedInput, ctx }) => {
    await removeFavorite(ctx.user.id, parsedInput);

    revalidatePath("/");
    revalidatePath(`/movies/${parsedInput}`);
    revalidatePath(`/series/${parsedInput}`);

    return {
      success: true,
    } satisfies FavoriteActionResult;
  });

const listFavoritesSafeAction = authRateLimitedAction({
  keyPrefix: "favorites:list",
  limit: 60,
  windowMs: 60_000,
}).action(async ({ ctx }) => {
  return listUserFavorites(ctx.user.id);
});

export async function addFavoriteAction(input: AddFavoriteInput): Promise<FavoriteActionResult> {
  const parsed = addFavoriteSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.flatten().fieldErrors.titleId?.[0] ?? "Invalid favorite request.",
    };
  }

  const result = await addFavoriteSafeAction(input);

  if (result.data) {
    return result.data;
  }

  if (result.validationErrors) {
    return {
      success: false,
      message: result.validationErrors.fieldErrors.titleId?.[0] ?? "Invalid favorite request.",
    };
  }

  if (result.serverError === "UNAUTHORIZED") {
    return {
      success: false,
      message: "Please sign in to save favorites.",
    };
  }

  if (result.serverError === "RATE_LIMITED") {
    return {
      success: false,
      message: "Too many favorite requests. Please try again shortly.",
    };
  }

  return {
    success: false,
    message: "Unable to save favorite right now.",
  };
}

export async function removeFavoriteAction(titleId: string): Promise<FavoriteActionResult> {
  const parsed = removeFavoriteSchema.safeParse(titleId);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.flatten().formErrors[0] ?? "Title id is required.",
    };
  }

  const result = await removeFavoriteSafeAction(titleId);

  if (result.data) {
    return result.data;
  }

  if (result.validationErrors) {
    return {
      success: false,
      message: result.validationErrors.formErrors[0] ?? "Title id is required.",
    };
  }

  if (result.serverError === "UNAUTHORIZED") {
    return {
      success: false,
      message: "Please sign in to update favorites.",
    };
  }

  if (result.serverError === "RATE_LIMITED") {
    return {
      success: false,
      message: "Too many favorite requests. Please try again shortly.",
    };
  }

  return {
    success: false,
    message: "Unable to remove favorite right now.",
  };
}

export async function listFavoritesAction(): Promise<FavoriteItem[]> {
  const result = await listFavoritesSafeAction();

  if (result.data) {
    return result.data;
  }

  return [];
}
