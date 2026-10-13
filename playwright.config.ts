/// <reference types="node" />

import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html',{open : 'never'}],['list']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    video : 'retain-on-first-failure',
    trace: 'retain-on-first-failure',
    headless: !!process.env.CI,
  },

  projects: [
    {
      name: 'api-only',
      testDir: './tests/api',
      testMatch: '**/*.spec.ts',
    },
    {
      name: 'ui-chromium',
      testDir: './tests/ui',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'ui-firefox',
      testDir: './tests/ui',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'ui-webkit',
      testDir: './tests/ui',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'hybrid-chromium',
      testDir: './tests/hybrid',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'hybrid-firefox',
      testDir: './tests/hybrid',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'hybrid-webkit',
      testDir: './tests/hybrid',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
