import { AuthRequiredError } from "@/features/auth/errors";
import { MediaType } from "@/generated/prisma";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  listContinueWatchingAction,
  removeProgressAction,
  upsertProgressAction,
} from "../server-actions";

vi.mock("@/features/auth/services/session.service", () => ({
  requireUser: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("../services/progress.service", () => ({
  listContinueWatching: vi.fn(),
  removeProgress: vi.fn(),
  upsertProgress: vi.fn(),
}));

import { requireUser } from "@/features/auth/services/session.service";
import { revalidatePath } from "next/cache";
import { listContinueWatching, removeProgress, upsertProgress } from "../services/progress.service";

describe("progress server-actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid upsert payload", async () => {
    const result = await upsertProgressAction({
      titleId: "",
      mediaType: MediaType.MOVIE,
      progressSeconds: 0,
      durationSeconds: 0,
    });

    expect(result).toEqual({ success: false, message: "Invalid progress payload." });
    expect(upsertProgress).not.toHaveBeenCalled();
  });

  it("returns auth error for upsert", async () => {
    vi.mocked(requireUser).mockRejectedValue(new AuthRequiredError());

    const result = await upsertProgressAction({
      titleId: "1",
      mediaType: MediaType.MOVIE,
      progressSeconds: 10,
      durationSeconds: 100,
    });

    expect(result.success).toBe(false);
  });

  it("upserts progress and revalidates", async () => {
    vi.mocked(requireUser).mockResolvedValue({ id: 1, email: "x@y.com" });

    const result = await upsertProgressAction({
      titleId: "1",
      mediaType: MediaType.MOVIE,
      progressSeconds: 10,
      durationSeconds: 100,
    });

    expect(result).toEqual({ success: true });
    expect(upsertProgress).toHaveBeenCalledWith(1, "1", MediaType.MOVIE, 10, 100);
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("lists continue watching and falls back to empty", async () => {
    vi.mocked(requireUser).mockResolvedValue({ id: 1, email: "x@y.com" });
    vi.mocked(listContinueWatching).mockResolvedValue([]);

    await expect(listContinueWatchingAction()).resolves.toEqual([]);

    vi.mocked(requireUser).mockRejectedValue(new AuthRequiredError());
    await expect(listContinueWatchingAction()).resolves.toEqual([]);
  });

  it("rejects blank remove input", async () => {
    const result = await removeProgressAction(" ");

    expect(result).toEqual({ success: false, message: "Title id must be a positive integer." });
  });

  it("removes progress", async () => {
    vi.mocked(requireUser).mockResolvedValue({ id: 1, email: "x@y.com" });

    const result = await removeProgressAction("1");

    expect(result).toEqual({ success: true });
    expect(removeProgress).toHaveBeenCalledWith(1, "1");
  });
});
