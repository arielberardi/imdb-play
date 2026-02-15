import { expect, test } from "@playwright/test";

const hasCatalogFixtures =
  Boolean(process.env.DATABASE_URL) &&
  Boolean(process.env.SESSION_SECRET) &&
  Boolean(process.env.IMDB_API_KEY);

test.describe("catalog browsing", () => {
  test("renders movies and series catalog screens", async ({ page }) => {
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!hasCatalogFixtures) {
      return;
    }

    await page.goto("/films");
    await expect(page.getByRole("heading", { name: "Movies" })).toBeVisible();

    await page.goto("/series");
    await expect(page.getByRole("heading", { name: "TV Series" })).toBeVisible();
  });

  test("can navigate from home rail to details page", async ({ page }) => {
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!hasCatalogFixtures) {
      return;
    }

    await page.goto("/");

    const firstCardLink = page.locator('a[href^="/movies/"], a[href^="/series/"]').first();
    await expect(firstCardLink).toBeVisible();
    await firstCardLink.click();

    await expect(page).toHaveURL(/\/(movies|series)\/.+/);
  });
});
