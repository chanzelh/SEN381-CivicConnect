import { expect } from "@playwright/test";

const API = "http://localhost:5000/api";


export const USERS = {
  requester: { email: "requester@test.civicconnect.local", name: "Test Requester" },
  staff: { email: "staff@test.civicconnect.local", name: "Test Staff" },
  management: { email: "management@test.civicconnect.local", name: "Test Management" },
};
const PASSWORD = "CivicTest#2026";

export function uniqueTitle(testInfo, label) {
  return `E2E ${label} ${testInfo.project.name} ${Date.now()}`;
}

export async function login(page, role) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(USERS[role].email);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "LOGIN" }).click();

  await expect(page).toHaveURL(new RegExp(`/${role}$`));
}

export async function logout(page) {
  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page).toHaveURL(/\/login$/);
}

export async function createRequestViaApi(request, title) {
  const loginRes = await request.post(`${API}/auth/login`, {
    data: { email: USERS.requester.email, password: PASSWORD },
  });
  expect(loginRes.ok()).toBeTruthy();
  const { token } = await loginRes.json();

  const createRes = await request.post(`${API}/requests`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      title,
      description: "The hall light outside room 12 keeps flickering.",
      category: "Maintenance",
      location: "Main building, Room 12",
    },
  });
  expect(createRes.status()).toBe(201);
  const { request: created } = await createRes.json();
  return created.id;
}