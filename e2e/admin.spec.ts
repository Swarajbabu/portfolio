import { test, expect } from "@playwright/test";

test.describe("Admin Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin", { waitUntil: "domcontentloaded" });
  });

  test("renders security lock dialog for unauthenticated visitors", async ({ page }) => {
    // Should show the Admin Portal Lock heading
    await expect(page.getByText("Admin Portal Lock")).toBeVisible({ timeout: 10000 });

    // Should show the passcode input field and unlock button
    const passcodeInput = page.locator("input[type='password']");
    await expect(passcodeInput).toBeVisible();

    const unlockButton = page.getByRole("button", { name: /Unlock/i });
    await expect(unlockButton).toBeVisible();
  });

  test("displays error message upon entering incorrect passcode", async ({ page }) => {
    await expect(page.getByText("Admin Portal Lock")).toBeVisible({ timeout: 10000 });

    const passcodeInput = page.locator("input[type='password']");
    await passcodeInput.fill("wrong_attempt_12345");

    const unlockButton = page.getByRole("button", { name: /Unlock/i });
    await unlockButton.click();

    // Verify error message appears
    const errorMsg = page.locator("text=/invalid|failed|could not reach|login failed/i");
    await expect(errorMsg.first()).toBeVisible({ timeout: 10000 });
  });
});
