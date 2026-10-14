import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.js",
  fullyParallel: false,
  workers: 1,
  retries: 0, 
  timeout: 90_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "msedge", use: { ...devices["Desktop Edge"], channel: "msedge" } },
  ],
  webServer: [
    {
      command: "node -r dotenv/config src/server.js",
      cwd: "../server",
      url: "http://localhost:5000/api/requests", 
      env: { DOTENV_CONFIG_PATH: ".env.test" },
      reuseExistingServer: !isCI,
      timeout: 60_000,
    },
    {
      command: "npm run dev -- --port 5173 --strictPort",
      url: "http://localhost:5173",
      reuseExistingServer: !isCI,
      timeout: 60_000,
    },
  ],
});