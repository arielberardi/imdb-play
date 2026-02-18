import { MediaType } from "@/generated/prisma";
import { describe, expect, it } from "vitest";
import { addFavoriteSchema } from "../validators";

describe("favorites validators", () => {
  it("accepts valid payload", () => {
    const parsed = addFavoriteSchema.safeParse({
      titleId: "123",
      mediaType: MediaType.MOVIE,
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects blank title id", () => {
    const parsed = addFavoriteSchema.safeParse({
      titleId: "   ",
      mediaType: MediaType.SERIES,
    });

    expect(parsed.success).toBe(false);
  });

  it("rejects non-numeric title id", () => {
    const parsed = addFavoriteSchema.safeParse({
      titleId: "tt123",
      mediaType: MediaType.SERIES,
    });

    expect(parsed.success).toBe(false);
  });
});
