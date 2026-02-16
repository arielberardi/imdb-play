import { expect, test } from "@playwright/test";

const hasCatalogFixtures =
  Boolean(process.env.DATABASE_URL) &&
  Boolean(process.env.SESSION_SECRET) &&
  Boolean(process.env.IMDB_API_KEY);

test.describe("search and filtering", () => {
  test("search bar updates URL query", async ({ page }) => {
    await page.goto("/search");

    const input = page.getByPlaceholder("Search for movies and TV shows...");
    await input.fill("matrix");

    await expect(page).toHaveURL(/\/search\?q=matrix/);
  });

  test("films genre chip applies filtering query params", async ({ page }) => {
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!hasCatalogFixtures) {
      return;
    }

    await page.goto("/films");

    const firstGenreChip = page.locator('a[href^="/films?genre="]').first();
    await expect(firstGenreChip).toBeVisible();
    await firstGenreChip.click();

    await expect(page).toHaveURL(/\/films\?genre=/);
  });
});
