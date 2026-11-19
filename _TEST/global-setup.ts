import { request as playwrightRequest } from '@playwright/test';
import { URLS } from './playwright.config';

/**
 * Preflight. Without it, a stack that is down (or half up) surfaces as a 60s
 * navigation timeout inside whichever spec ran first, which reads like a
 * product bug. Every check below is a single GET whose failure names the
 * missing service.
 */

const WAIT_MS = Number(process.env.E2E_WAIT_MS ?? 20_000);
const POLL_MS = 1_000;

const CHECKS = [
  { name: 'first-party origin', url: `${URLS.origin}/` },
  // Add one GET per dependency as the stack grows:
  // { name: 'api health', url: `${URLS.api}/healthz` },
];

export default async function globalSetup(): Promise<void> {
  const api = await playwrightRequest.newContext();
  const deadline = Date.now() + WAIT_MS;

  for (const check of CHECKS) {
    let last = '';
    for (;;) {
      try {
        const res = await api.get(check.url, { timeout: 5_000 });
        if (res.ok()) break;
        last = `HTTP ${res.status()}`;
      } catch (e) {
        last = (e as Error).message.split('\n')[0];
      }
      if (Date.now() > deadline) {
        await api.dispose();
        throw new Error(
          `preflight failed: ${check.name} (${check.url}) — ${last}\n` +
            'Is the _DEV stack up? Run `cd _DEV && make up`.',
        );
      }
      await new Promise((r) => setTimeout(r, POLL_MS));
    }
  }

  await api.dispose();
}
