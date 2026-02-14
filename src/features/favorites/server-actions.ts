"use server";

import { AuthRequiredError } from "@/features/auth/errors";
import { requireUser } from "@/features/auth/services/session.service";
import type {
  AddFavoriteInput,
  FavoriteActionResult,
  FavoriteItem,
} from "@/features/favorites/types";
import { addFavoriteSchema } from "@/features/favorites/validators";
import { revalidatePath } from "next/cache";
import { addFavorite, listUserFavorites, removeFavorite } from "./services/favorites.service";

export async function addFavoriteAction(input: AddFavoriteInput): Promise<FavoriteActionResult> {
  const parsed = addFavoriteSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.flatten().fieldErrors.imdbId?.[0] ?? "Invalid favorite request.",
    };
  }

  try {
    const user = await requireUser();
    await addFavorite(user.id, parsed.data.imdbId, parsed.data.mediaType);

    revalidatePath("/");
    revalidatePath(`/movies/${parsed.data.imdbId}`);
    revalidatePath(`/series/${parsed.data.imdbId}`);

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof AuthRequiredError) {
      return {
        success: false,
        message: "Please sign in to save favorites.",
      };
    }

    return {
      success: false,
      message: "Unable to save favorite right now.",
    };
  }
}

export async function removeFavoriteAction(imdbId: string): Promise<FavoriteActionResult> {
  if (!imdbId || imdbId.trim().length === 0) {
    return {
      success: false,
      message: "Title id is required.",
    };
  }

  try {
    const user = await requireUser();
    await removeFavorite(user.id, imdbId);

    revalidatePath("/");
    revalidatePath(`/movies/${imdbId}`);
    revalidatePath(`/series/${imdbId}`);

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof AuthRequiredError) {
      return {
        success: false,
        message: "Please sign in to update favorites.",
      };
    }

    return {
      success: false,
      message: "Unable to remove favorite right now.",
    };
  }
}

export async function listFavoritesAction(): Promise<FavoriteItem[]> {
  try {
    const user = await requireUser();
    return await listUserFavorites(user.id);
  } catch {
    return [];
  }
}
