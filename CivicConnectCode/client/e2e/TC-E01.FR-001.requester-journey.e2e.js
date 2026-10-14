import { test, expect } from "@playwright/test";
import { login, uniqueTitle } from "./helpers.js";

test("TC-E01 requester submits a request and sees its status and history", async ({ page }, testInfo) => {
  const title = uniqueTitle(testInfo, "E01");
  const description = "The hall light outside room 12 keeps flickering.";

  await login(page, "requester");


  await page.getByRole("button", { name: "+ New Request" }).click();
  await expect(page).toHaveURL(/\/requester\/new$/);

  await page.getByLabel("Request Title *").fill(title);
  await page.getByLabel("Category *").selectOption("Maintenance");
  await page.getByLabel("Description *", { exact: true }).fill(description);
  await page.getByLabel("Maintenance Issue Type *").selectOption("Lighting");
  await page.getByLabel("Location *", { exact: true }).fill("Main building, Room 12");
  await page.getByRole("button", { name: "Submit Request" }).click();

  await expect(page).toHaveURL(/\/requester$/);
  const row = page.getByRole("link", { name: `View request ${title}` });
  await expect(row).toBeVisible();
  await expect(row).toContainText("Maintenance");

  await expect(row).toContainText(/open/i);

  await row.click();
  await expect(page).toHaveURL(/\/requester\/requests\/\d+$/);
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByText(description)).toBeVisible();
  await expect(page.locator(".request-detail-heading")).toContainText(/open/i);
});