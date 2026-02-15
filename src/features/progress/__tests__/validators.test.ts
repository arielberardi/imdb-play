import { MediaType } from "@/generated/prisma";
import { describe, expect, it } from "vitest";
import { upsertProgressSchema } from "../validators";

describe("progress validators", () => {
  it("accepts valid payload", () => {
    const parsed = upsertProgressSchema.safeParse({
      titleId: "tt123",
      mediaType: MediaType.MOVIE,
      progressSeconds: 120,
      durationSeconds: 3600,
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects non-positive duration", () => {
    const parsed = upsertProgressSchema.safeParse({
      titleId: "tt123",
      mediaType: MediaType.MOVIE,
      progressSeconds: 120,
      durationSeconds: 0,
    });

    expect(parsed.success).toBe(false);
  });
});
