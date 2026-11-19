import { expect, test } from '@playwright/test';
import { URLS } from '../../playwright.config';

/**
 * Smoke: the first-party origin answers and is the only surface tests talk to.
 * Replace/extend this with the project's critical journeys.
 */
test.describe('platform — smoke', () => {
  test('first-party origin is reachable', async ({ request }) => {
    const res = await request.get(`${URLS.origin}/`);
    expect(res.status()).toBe(200);
  });
});
