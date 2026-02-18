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
      id: 1,
      userId: 1,
      titleId: 10,
      mediaType: MediaType.MOVIE,
      progressSeconds: 300,
      durationSeconds: 1000,
      updatedAt: new Date(),
    } as never);

    const result = await upsertProgress("1", "10", MediaType.MOVIE, 300, 1000);

    expect(result.progressPercent).toBe(30);
    expect(result.titleId).toBe("10");
    expect(prisma.continueWatching.upsert).toHaveBeenCalled();
  });

  it("returns null when progress missing", async () => {
    vi.mocked(prisma.continueWatching.findUnique).mockResolvedValue(null);

    await expect(getProgress("1", "10")).resolves.toBeNull();
  });

  it("returns computed progress for existing record", async () => {
    vi.mocked(prisma.continueWatching.findUnique).mockResolvedValue({
      id: 1,
      userId: 1,
      titleId: 10,
      mediaType: MediaType.SERIES,
      progressSeconds: 30,
      durationSeconds: 60,
      updatedAt: new Date(),
    } as never);

    const result = await getProgress("1", "10");

    expect(result?.progressPercent).toBe(50);
    expect(result?.titleId).toBe("10");
  });

  it("filters near-complete items from continue watching", async () => {
    vi.mocked(prisma.continueWatching.findMany).mockResolvedValue([
      {
        id: 1,
        userId: 1,
        titleId: 10,
        mediaType: MediaType.MOVIE,
        progressSeconds: 95,
        durationSeconds: 100,
        updatedAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        titleId: 20,
        mediaType: MediaType.MOVIE,
        progressSeconds: 20,
        durationSeconds: 100,
        updatedAt: new Date(),
      },
    ] as never);

    const result = await listContinueWatching("1");

    expect(result).toHaveLength(1);
    expect(result[0]?.titleId).toBe("20");
  });

  it("deletes progress", async () => {
    await removeProgress("1", "10");

    expect(prisma.continueWatching.deleteMany).toHaveBeenCalledWith({
      where: { userId: 1, titleId: 10 },
    });
  });
});
