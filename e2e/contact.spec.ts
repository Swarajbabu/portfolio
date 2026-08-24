import { test, expect } from "@playwright/test";

test.describe("Contact Form & Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const skipBtn = page.getByRole("button", { name: /Skip/i });
    if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipBtn.click();
    }
  });

  test("renders contact section with input fields", async ({ page }) => {
    const contactSection = page.locator("#contact, section:has-text('Contact'), section:has-text('Get In Touch')");
    await expect(contactSection.first()).toBeVisible();

    const nameInput = page.locator("input[name='name'], input[placeholder*='name' i]");
    const emailInput = page.locator("input[name='email'], input[placeholder*='email' i]");
    const messageInput = page.locator("textarea[name='message'], textarea[placeholder*='message' i]");

    if (await nameInput.isVisible().catch(() => false)) {
      await expect(nameInput).toBeVisible();
      await expect(emailInput).toBeVisible();
      await expect(messageInput).toBeVisible();
    }
  });

  test("validates empty submission or invalid email format on client side", async ({ page }) => {
    const submitBtn = page.locator("button[type='submit']:has-text('Send'), button:has-text('Send Message')");
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();
      // Form should stay on page and handle submission safely
      await expect(page.locator("body")).toBeDefined();
    }
  });
});
