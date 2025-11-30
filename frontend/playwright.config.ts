import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Run tests sequentially to avoid session conflicts
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for auth tests
  reporter: 'list',
  timeout: 60000, // 60 second timeout per test
  use: {
    baseURL: 'https://hospital.alexandratechlab.com',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on-first-retry',
    // Clear storage between tests
    storageState: undefined,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
