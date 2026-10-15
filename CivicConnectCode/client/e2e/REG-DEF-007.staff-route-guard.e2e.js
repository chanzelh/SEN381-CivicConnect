import { test, expect } from "@playwright/test";
import { login } from "./helpers.js";
 
test.describe("DEF-007 regression: staff request page is guarded", () => {
  test("a logged-out visitor is sent to the login page", async ({ page }) => {
    await page.goto("/staff/requests/1");
    await expect(page).toHaveURL(/\/login$/);
  });
 
  test("a requester is sent back to their own dashboard", async ({ page }) => {
    await login(page, "requester");
    await page.goto("/staff/requests/1");
    await expect(page).toHaveURL(/\/requester$/);
  });
});