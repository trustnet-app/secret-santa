import { expect, type Page } from '@playwright/test';

/**
 * Shared helpers. Keep specs readable: a spec should say what the user does,
 * not how the fixtures are built.
 */

let counter = 0;

/** A unique email in the shape `E2E_EMAIL_RE` matches. */
export function uniqueEmail(prefix = 'e2e'): string {
  const ms = Date.now();
  const rand = counter++ % 1_000_000;
  return `${prefix}-${ms}-${rand}@example.test`;
}

/** Navigate and assert the page is the one the test expects. */
export async function open(page: Page, path: string, testId: string): Promise<void> {
  await page.goto(path);
  await expect(page.getByTestId(testId)).toBeVisible();
}

/** Click a `data-testid` control and wait for navigation when applicable. */
export async function clickTestId(page: Page, testId: string): Promise<void> {
  await page.getByTestId(testId).click();
}
