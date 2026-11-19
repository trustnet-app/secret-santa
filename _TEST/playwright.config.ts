import { defineConfig, devices } from '@playwright/test';

/**
 * Addresses of the _DEV stack. Overridable by env so CI can point at a
 * differently-mapped stack without editing tests.
 *
 * `origin` is the ONE first-party origin: Quiet Santa serves pages, forms,
 * OIDC, and webhooks from the same Node process. Tests never reach an internal
 * service directly.
 */
export const URLS = {
  origin: process.env.APP_ORIGIN ?? 'http://localhost:5556',
};

/** Shape produced by `uniqueEmail()`; teardown deletes only this shape. */
export const E2E_EMAIL_RE = /^[A-Za-z0-9]+-\d{13}-\d{1,6}@example\.test$/;

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  // Shared server-side state (sessions, flows) makes parallel flows interleave.
  workers: 1,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: URLS.origin,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
