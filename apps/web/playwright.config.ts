import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "corepack pnpm@11.15.0 dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "mobile-320",
      use: {
        browserName: "chromium",
        viewport: { width: 320, height: 740 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "mobile-390",
      use: { ...devices["iPhone 13"], browserName: "chromium" },
    },
    {
      name: "mobile-428",
      use: {
        browserName: "chromium",
        viewport: { width: 428, height: 926 },
        isMobile: true,
        hasTouch: true,
      },
    },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
});
