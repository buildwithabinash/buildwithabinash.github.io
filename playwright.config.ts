import { defineConfig, devices } from "@playwright/test";

/**
 * The tests run against the real static export in out/, served the way
 * GitHub Pages serves it, so they check what visitors actually get.
 * Build first:
 *
 *   npm run build && npm test
 *
 * The maths tests import money.ts directly and need no browser; the rest
 * open every page in Chrome, Safari and Firefox, on desktops and phones.
 */
const PORT = 4173;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "maths", testMatch: /maths\.spec\.ts/ },
    { name: "desktop", testIgnore: /maths\.spec\.ts/, use: { ...devices["Desktop Chrome"] } },
    { name: "phone", testIgnore: /maths\.spec\.ts/, use: { ...devices["Pixel 7"] } },
    // Safari's engine, on a Mac and on an iPhone: a large share of visitors.
    { name: "safari", testIgnore: /maths\.spec\.ts/, use: { ...devices["Desktop Safari"] } },
    { name: "iphone", testIgnore: /maths\.spec\.ts/, use: { ...devices["iPhone 15"] } },
    { name: "firefox", testIgnore: /maths\.spec\.ts/, use: { ...devices["Desktop Firefox"] } },
  ],
  webServer: {
    command: `node scripts/serve-out.mjs ${PORT}`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
