"use server";

import type {
  AddToWatchlistInput,
  WatchlistActionResult,
  WatchlistItem,
} from "@/features/watchlist/types";
import { addToWatchlistSchema } from "@/features/watchlist/validators";
import { authRateLimitedAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  addToWatchlist,
  listUserWatchlist,
  removeFromWatchlist,
} from "./services/watchlist.service";

const removeFromWatchlistSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Title id must be a positive integer.");

const addToWatchlistSafeAction = authRateLimitedAction({
  keyPrefix: "watchlist:add",
  limit: 20,
  windowMs: 60_000,
})
  .inputSchema(addToWatchlistSchema)
  .action(async ({ parsedInput, ctx }) => {
    await addToWatchlist(ctx.user.id, parsedInput.titleId, parsedInput.mediaType);

    revalidatePath("/");
    revalidatePath(`/movies/${parsedInput.titleId}`);
    revalidatePath(`/series/${parsedInput.titleId}`);

    return {
      success: true,
    } satisfies WatchlistActionResult;
  });

const removeFromWatchlistSafeAction = authRateLimitedAction({
  keyPrefix: "watchlist:remove",
  limit: 20,
  windowMs: 60_000,
})
  .inputSchema(removeFromWatchlistSchema)
  .action(async ({ parsedInput, ctx }) => {
    await removeFromWatchlist(ctx.user.id, parsedInput);

    revalidatePath("/");
    revalidatePath(`/movies/${parsedInput}`);
    revalidatePath(`/series/${parsedInput}`);

    return {
      success: true,
    } satisfies WatchlistActionResult;
  });

const listWatchlistSafeAction = authRateLimitedAction({
  keyPrefix: "watchlist:list",
  limit: 60,
  windowMs: 60_000,
}).action(async ({ ctx }) => {
  return listUserWatchlist(ctx.user.id);
});

export async function addToWatchlistAction(
  input: AddToWatchlistInput,
): Promise<WatchlistActionResult> {
  const parsed = addToWatchlistSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.flatten().fieldErrors.titleId?.[0] ?? "Invalid watchlist request.",
    };
  }

  const result = await addToWatchlistSafeAction(input);

  if (result.data) {
    return result.data;
  }

  if (result.validationErrors) {
    return {
      success: false,
      message: result.validationErrors.fieldErrors.titleId?.[0] ?? "Invalid watchlist request.",
    };
  }

  if (result.serverError === "UNAUTHORIZED") {
    return {
      success: false,
      message: "Please sign in to manage your watchlist.",
    };
  }

  if (result.serverError === "RATE_LIMITED") {
    return {
      success: false,
      message: "Too many watchlist requests. Please try again shortly.",
    };
  }

  return {
    success: false,
    message: "Unable to update watchlist right now.",
  };
}

export async function removeFromWatchlistAction(titleId: string): Promise<WatchlistActionResult> {
  const parsed = removeFromWatchlistSchema.safeParse(titleId);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.flatten().formErrors[0] ?? "Title id is required.",
    };
  }

  const result = await removeFromWatchlistSafeAction(titleId);

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
      message: "Please sign in to manage your watchlist.",
    };
  }

  if (result.serverError === "RATE_LIMITED") {
    return {
      success: false,
      message: "Too many watchlist requests. Please try again shortly.",
    };
  }

  return {
    success: false,
    message: "Unable to update watchlist right now.",
  };
}

export async function listWatchlistAction(): Promise<WatchlistItem[]> {
  const result = await listWatchlistSafeAction();

  if (result.data) {
    return result.data;
  }

  return [];
}
