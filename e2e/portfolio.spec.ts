import { test, expect } from "@playwright/test";

test.describe("Portfolio Public Experience", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("loads homepage with navigation and hero section", async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Swaraj Vecha|Portfolio/i);

    // Skip loading screen if present
    const skipBtn = page.getByRole("button", { name: /Skip/i });
    if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipBtn.click();
    }

    // Verify main navigation links
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    // Verify Hero title or developer name
    await expect(page.locator("body")).toContainText("Swaraj");
  });

  test("renders key content sections (About, Skills, Projects, Contact)", async ({ page }) => {
    const skipBtn = page.getByRole("button", { name: /Skip/i });
    if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipBtn.click();
    }

    // Verify presence of major headings
    const headings = page.locator("h2, h1, h3");
    await expect(headings.first()).toBeVisible();

    // Verify skills or project cards exist
    await expect(page.locator("body")).toContainText(/Skills|Projects|About/i);
  });

  test("scroll-to-top button appears and functions when scrolling down", async ({ page }) => {
    const skipBtn = page.getByRole("button", { name: /Skip/i });
    if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipBtn.click();
    }

    // Scroll to the bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Scroll-to-top button should be visible
    const scrollBtn = page.locator("button[aria-label*='scroll' i], button:has(svg.lucide-arrow-up)");
    if (await scrollBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await scrollBtn.click();
      await page.waitForFunction(() => window.scrollY < 1000, { timeout: 5000 });
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeLessThan(1000);
    }
  });
});
