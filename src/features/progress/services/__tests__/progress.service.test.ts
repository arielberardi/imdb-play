import { MediaType } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getProgress,
  listContinueWatching,
  removeProgress,
  upsertProgress,
} from "../progress.service";

vi.mock("@/lib/prisma", () => ({
  default: {
    continueWatching: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

describe("progress.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("upserts progress and computes percent", async () => {
    vi.mocked(prisma.continueWatching.upsert).mockResolvedValue({
      id: "p1",
      userId: "user-1",
      titleId: "tt1",
      mediaType: MediaType.MOVIE,
      progressSeconds: 300,
      durationSeconds: 1000,
      updatedAt: new Date(),
    } as never);

    const result = await upsertProgress("user-1", "tt1", MediaType.MOVIE, 300, 1000);

    expect(result.progressPercent).toBe(30);
    expect(prisma.continueWatching.upsert).toHaveBeenCalled();
  });

  it("returns null when progress missing", async () => {
    vi.mocked(prisma.continueWatching.findUnique).mockResolvedValue(null);

    await expect(getProgress("user-1", "tt1")).resolves.toBeNull();
  });

  it("returns computed progress for existing record", async () => {
    vi.mocked(prisma.continueWatching.findUnique).mockResolvedValue({
      id: "p1",
      userId: "user-1",
      titleId: "tt1",
      mediaType: MediaType.SERIES,
      progressSeconds: 30,
      durationSeconds: 60,
      updatedAt: new Date(),
    } as never);

    const result = await getProgress("user-1", "tt1");

    expect(result?.progressPercent).toBe(50);
  });

  it("filters near-complete items from continue watching", async () => {
    vi.mocked(prisma.continueWatching.findMany).mockResolvedValue([
      {
        id: "p1",
        userId: "user-1",
        titleId: "tt1",
        mediaType: MediaType.MOVIE,
        progressSeconds: 95,
        durationSeconds: 100,
        updatedAt: new Date(),
      },
      {
        id: "p2",
        userId: "user-1",
        titleId: "tt2",
        mediaType: MediaType.MOVIE,
        progressSeconds: 20,
        durationSeconds: 100,
        updatedAt: new Date(),
      },
    ] as never);

    const result = await listContinueWatching("user-1");

    expect(result).toHaveLength(1);
    expect(result[0]?.titleId).toBe("tt2");
  });

  it("deletes progress", async () => {
    await removeProgress("user-1", "tt1");

    expect(prisma.continueWatching.deleteMany).toHaveBeenCalledWith({
      where: { userId: "user-1", titleId: "tt1" },
    });
  });
});
