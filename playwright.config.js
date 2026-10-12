// Browser smoke tests: build an invitation, open it, answer it. Run with
// `npm run test:e2e` (first time: `npx playwright install chromium`).
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    ...devices['Pixel 7'],
    trace: 'retain-on-failure',
    // Cloud sessions: the session hook points this at the container's Chromium when
    // Playwright's pinned build is missing. CI leaves it unset.
    ...(process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } }
      : {}),
  },
  webServer: {
    command: 'node e2e/serve.js',
    url: 'http://localhost:4173/index.html',
    reuseExistingServer: !process.env.CI,
  },
});
