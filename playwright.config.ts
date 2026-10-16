import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests/e2e",
  fullyParallel: true,
  retries: 1,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    // Mascara elementos dinâmicos (como IDs e timestamps) para regressão visual estável
    testIdAttribute: "data-testid",
  },
  projects: [
    {
      name: "Chromium Desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Chromium Mobile",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
