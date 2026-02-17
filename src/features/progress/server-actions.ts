"use server";

import type {
  ProgressActionResult,
  ProgressItem,
  UpsertProgressInput,
} from "@/features/progress/types";
import { upsertProgressSchema } from "@/features/progress/validators";
import { authRateLimitedAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { listContinueWatching, removeProgress, upsertProgress } from "./services/progress.service";

const removeProgressSchema = z.string().trim().min(1, "Title id is required.");

const upsertProgressSafeAction = authRateLimitedAction({
  keyPrefix: "progress:upsert",
  limit: 30,
  windowMs: 60_000,
})
  .inputSchema(upsertProgressSchema)
  .action(async ({ parsedInput, ctx }) => {
    await upsertProgress(
      ctx.user.id,
      parsedInput.titleId,
      parsedInput.mediaType,
      parsedInput.progressSeconds,
      parsedInput.durationSeconds,
    );

    revalidatePath("/");
    revalidatePath(`/movies/${parsedInput.titleId}`);
    revalidatePath(`/series/${parsedInput.titleId}`);

    return {
      success: true,
    } satisfies ProgressActionResult;
  });

const removeProgressSafeAction = authRateLimitedAction({
  keyPrefix: "progress:remove",
  limit: 30,
  windowMs: 60_000,
})
  .inputSchema(removeProgressSchema)
  .action(async ({ parsedInput, ctx }) => {
    await removeProgress(ctx.user.id, parsedInput);

    revalidatePath("/");
    revalidatePath(`/movies/${parsedInput}`);
    revalidatePath(`/series/${parsedInput}`);

    return {
      success: true,
    } satisfies ProgressActionResult;
  });

const listContinueWatchingSafeAction = authRateLimitedAction({
  keyPrefix: "progress:list",
  limit: 60,
  windowMs: 60_000,
}).action(async ({ ctx }) => {
  return listContinueWatching(ctx.user.id);
});

export async function upsertProgressAction(
  input: UpsertProgressInput,
): Promise<ProgressActionResult> {
  const parsed = upsertProgressSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid progress payload.",
    };
  }

  const result = await upsertProgressSafeAction(input);

  if (result.data) {
    return result.data;
  }

  if (result.validationErrors) {
    return {
      success: false,
      message: "Invalid progress payload.",
    };
  }

  if (result.serverError === "UNAUTHORIZED") {
    return {
      success: false,
      message: "Please sign in to save your watching progress.",
    };
  }

  if (result.serverError === "RATE_LIMITED") {
    return {
      success: false,
      message: "Too many progress updates. Please try again shortly.",
    };
  }

  return {
    success: false,
    message: "Unable to save progress right now.",
  };
}

export async function listContinueWatchingAction(): Promise<ProgressItem[]> {
  const result = await listContinueWatchingSafeAction();

  if (result.data) {
    return result.data;
  }

  return [];
}

export async function removeProgressAction(titleId: string): Promise<ProgressActionResult> {
  const parsed = removeProgressSchema.safeParse(titleId);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.flatten().formErrors[0] ?? "Title id is required.",
    };
  }

  const result = await removeProgressSafeAction(titleId);

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
      message: "Please sign in to manage watch progress.",
    };
  }

  if (result.serverError === "RATE_LIMITED") {
    return {
      success: false,
      message: "Too many progress updates. Please try again shortly.",
    };
  }

  return {
    success: false,
    message: "Unable to clear progress right now.",
  };
}
