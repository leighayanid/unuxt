import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E test configuration for @unuxt/web
 *
 * Run E2E tests:
 * - pnpm test:e2e              # Run all E2E tests
 * - pnpm test:e2e:ui           # Run with Playwright UI
 * - pnpm test:e2e --headed     # Run in headed mode
 * - pnpm test:e2e --debug      # Debug mode
 */
export default defineConfig({
  testDir: './tests/e2e',

  // Maximum time one test can run
  timeout: 30 * 1000,

  // Test configuration
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: process.env.CI
    ? [['html'], ['github']]
    : [['html'], ['list']],

  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Collect trace on failure
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Uncomment to test on other browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // Mobile viewports
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Run dev server before starting tests
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      // Use test environment variables
      DATABASE_URL: process.env.DATABASE_URL || '',
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || 'test-secret',
      BETTER_AUTH_URL: 'http://localhost:3000',
    },
  },
})
