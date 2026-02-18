import { MediaType } from "@/generated/prisma";
import { describe, expect, it } from "vitest";
import { addToWatchlistSchema } from "../validators";

describe("watchlist validators", () => {
  it("accepts valid payload", () => {
    const parsed = addToWatchlistSchema.safeParse({
      titleId: "123",
      mediaType: MediaType.SERIES,
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects blank title id", () => {
    const parsed = addToWatchlistSchema.safeParse({
      titleId: "  ",
      mediaType: MediaType.SERIES,
    });

    expect(parsed.success).toBe(false);
  });

  it("rejects non-numeric title id", () => {
    const parsed = addToWatchlistSchema.safeParse({
      titleId: "tt123",
      mediaType: MediaType.SERIES,
    });

    expect(parsed.success).toBe(false);
  });
});
