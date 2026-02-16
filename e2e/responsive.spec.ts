import { expect, test } from "@playwright/test";

test.describe("responsive behavior", () => {
  test("search page remains usable on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/search");

    await expect(page.getByRole("heading", { name: "Search", level: 1 })).toBeVisible();

    const input = page.getByPlaceholder("Search for movies and TV shows...");
    await input.fill("test");
    await expect(input).toHaveValue("test");
  });
});
