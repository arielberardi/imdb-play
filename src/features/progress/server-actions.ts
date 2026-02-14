"use server";

import { AuthRequiredError } from "@/features/auth/errors";
import { requireUser } from "@/features/auth/services/session.service";
import type {
  ProgressActionResult,
  ProgressItem,
  UpsertProgressInput,
} from "@/features/progress/types";
import { upsertProgressSchema } from "@/features/progress/validators";
import { revalidatePath } from "next/cache";
import { listContinueWatching, removeProgress, upsertProgress } from "./services/progress.service";

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

  try {
    const user = await requireUser();
    await upsertProgress(
      user.id,
      parsed.data.imdbId,
      parsed.data.mediaType,
      parsed.data.progressSeconds,
      parsed.data.durationSeconds,
    );

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
        message: "Please sign in to save your watching progress.",
      };
    }

    return {
      success: false,
      message: "Unable to save progress right now.",
    };
  }
}

export async function listContinueWatchingAction(): Promise<ProgressItem[]> {
  try {
    const user = await requireUser();
    return await listContinueWatching(user.id);
  } catch {
    return [];
  }
}

export async function removeProgressAction(imdbId: string): Promise<ProgressActionResult> {
  if (!imdbId || imdbId.trim().length === 0) {
    return {
      success: false,
      message: "Title id is required.",
    };
  }

  try {
    const user = await requireUser();
    await removeProgress(user.id, imdbId);

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
        message: "Please sign in to manage watch progress.",
      };
    }

    return {
      success: false,
      message: "Unable to clear progress right now.",
    };
  }
}
