import { expect, test } from "@playwright/test";

const hasAuthFixtures =
  Boolean(process.env.DATABASE_URL) &&
  Boolean(process.env.SESSION_SECRET) &&
  Boolean(process.env.IMDB_API_KEY);

test.describe("auth flow", () => {
  test("renders sign in and sign up screens", async ({ page }) => {
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!hasAuthFixtures) {
      return;
    }

    await page.goto("/auth/sign-in");
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();

    await page.goto("/auth/sign-up");
    await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();
  });
});
