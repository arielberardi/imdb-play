"use server";

import { AuthRequiredError } from "@/features/auth/errors";
import { requireUser } from "@/features/auth/services/session.service";
import type {
  AddToWatchlistInput,
  WatchlistActionResult,
  WatchlistItem,
} from "@/features/watchlist/types";
import { addToWatchlistSchema } from "@/features/watchlist/validators";
import { revalidatePath } from "next/cache";
import {
  addToWatchlist,
  listUserWatchlist,
  removeFromWatchlist,
} from "./services/watchlist.service";

export async function addToWatchlistAction(
  input: AddToWatchlistInput,
): Promise<WatchlistActionResult> {
  const parsed = addToWatchlistSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.flatten().fieldErrors.imdbId?.[0] ?? "Invalid watchlist request.",
    };
  }

  try {
    const user = await requireUser();
    await addToWatchlist(user.id, parsed.data.imdbId, parsed.data.mediaType);

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
        message: "Please sign in to manage your watchlist.",
      };
    }

    return {
      success: false,
      message: "Unable to update watchlist right now.",
    };
  }
}

export async function removeFromWatchlistAction(imdbId: string): Promise<WatchlistActionResult> {
  if (!imdbId || imdbId.trim().length === 0) {
    return {
      success: false,
      message: "Title id is required.",
    };
  }

  try {
    const user = await requireUser();
    await removeFromWatchlist(user.id, imdbId);

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
        message: "Please sign in to manage your watchlist.",
      };
    }

    return {
      success: false,
      message: "Unable to update watchlist right now.",
    };
  }
}

export async function listWatchlistAction(): Promise<WatchlistItem[]> {
  try {
    const user = await requireUser();
    return await listUserWatchlist(user.id);
  } catch {
    return [];
  }
}
