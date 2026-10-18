import { test, expect } from "@playwright/test";
import { createRequestViaApi, login, logout, uniqueTitle, USERS } from "./helpers.js";

test("TC-E02 request is assigned, worked, resolved and closed; requester sees the outcome", async ({ page, request }, testInfo) => {
  const title = uniqueTitle(testInfo, "E02");
  const comment = `Replaced the bulb and tested the light (${testInfo.project.name}).`;
  const id = await createRequestViaApi(request, title);


  await login(page, "management");
  await page.getByLabel("Search requests, requesters or staff").fill(title);
  await page.getByLabel("Filter by category").selectOption("Maintenance");

  const managementRow = page.getByRole("row", { name: new RegExp(title) });
  await expect(managementRow).toHaveCount(1);
  const currentStatus = managementRow.locator("td").nth(4);
  const assignedStaff = managementRow.locator("td").nth(6);

  await page.getByLabel(`Select staff for request ${id}`).selectOption({ label: USERS.staff.name });
  await page.getByLabel(`Select due date for request ${id}`).fill("2026-12-31");
  await managementRow.getByRole("button", { name: "Assign", exact: true }).click();

  await expect(page.getByText("Staff member and due date saved successfully.")).toBeVisible();
  await expect(currentStatus).toHaveText(/assigned/i);
  await expect(assignedStaff).toHaveText(USERS.staff.name);
  await logout(page);

  // Staff search, inspect and comment on their assigned request (FR-007, FR-008, FR-011).
  await login(page, "staff");
  await page.getByPlaceholder("Search requests...").fill(title);
  await page.getByLabel("Filter by status").selectOption("Assigned");

  const staffRow = page.getByRole("row", { name: new RegExp(title) });
  await expect(staffRow).toHaveCount(1);
  await staffRow.getByText(title).click();

  await expect(page).toHaveURL(new RegExp(`/staff/requests/${id}$`));
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByText(`Requester: ${USERS.requester.name}`)).toBeVisible();

  await page.getByLabel("Add a comment").fill(comment);
  await page.getByRole("button", { name: "Add Comment" }).click();
  await expect(page.getByText("Your comment was added successfully.")).toBeVisible();
  await expect(page.getByText(comment)).toBeVisible();

  // Staff resolve the request before management closes it (FR-010, FR-012).
  await page.getByRole("link", { name: /Back to My Assigned Requests/ }).click();
  await page.getByPlaceholder("Search requests...").fill(title);

  const statusSelect = page.getByLabel(`New status for request ${id}`);
  await statusSelect.selectOption("In Progress");
  await staffRow.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText(`Request #${id} updated to In Progress.`)).toBeVisible();

  await statusSelect.selectOption("Resolved");
  await staffRow.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText(`Request #${id} updated to Resolved.`)).toBeVisible();
  await logout(page);

  await login(page, "management");
  await page.getByLabel("Search requests, requesters or staff").fill(title);
  await page.getByLabel(`Change status for request ${id}`).selectOption("Closed");
  await managementRow.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText("Request status updated successfully.")).toBeVisible();
  await expect(currentStatus).toHaveText(/closed/i);
  await logout(page);

  await login(page, "requester");
  const requesterRow = page.getByRole("link", { name: `View request ${title}` });
  await expect(requesterRow).toContainText(/closed/i);

  await page.getByRole("button", { name: "Notifications" }).click();
  await expect(
    page.getByText(`Your request "${title}" now has the status "Closed".`)
  ).toBeVisible();

  await requesterRow.click();
  await expect(page.getByText(comment)).toBeVisible();
});