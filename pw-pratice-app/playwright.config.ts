import { defineConfig, devices } from "@playwright/test";
import type { TestOptions } from "./test-options";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  timeout: 10000,
  globalTimeout: 60000,
  expect: {
    timeout: 5000,
  },
  testDir: "./tests",
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    //baseURL: 'http://localhost:4200/',
    baseURL:
      process.env.DEV === "1"
        ? "http://localhost:4200/"
        : process.env.STAGING === "1"
        ? "http://localhost:4201/"
        : "http://localhost:4202/",
    globalsQaURL: "http://localhost:4201/",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    // actionTimeout: 5000,
    navigationTimeout: 5000,
    video: {
      mode: "off",
      size: { width: 1920, height: 1080 },
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "dev",
      use: { baseURL: "http://localhost:4201/" },
      fullyParallel: true,
    },
    {
      name: "chromium",
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],
});
