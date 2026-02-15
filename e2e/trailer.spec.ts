import { expect, test } from "@playwright/test";

const trailerTitleId = process.env.E2E_TRAILER_TITLE_ID;

test.describe("trailer playback", () => {
  test("opens and closes trailer modal", async ({ page }) => {
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!trailerTitleId) {
      return;
    }

    await page.goto(`/movies/${trailerTitleId}`);

    const playButton = page.getByRole("button", { name: "Play Trailer" });
    await expect(playButton).toBeVisible();
    await playButton.click();

    await expect(page.getByTitle(/trailer/i)).toBeVisible();
    await page.getByRole("button", { name: "Close trailer" }).click();
    await expect(page.getByTitle(/trailer/i)).toHaveCount(0);
  });
});
