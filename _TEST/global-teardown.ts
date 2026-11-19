/**
 * Best-effort cleanup of data the run created. Never fail the suite here.
 *
 * The template is a no-op. When the project creates accounts/fixtures, delete
 * only the shapes the helpers produce (e.g. E2E_EMAIL_RE from
 * playwright.config.ts), so hand-made data on the same domain is left alone.
 * Respect E2E_KEEP_STATE=1 to skip cleanup while inspecting state.
 */
export default async function globalTeardown(): Promise<void> {
  if (process.env.E2E_KEEP_STATE === '1') return;

  try {
    // Example:
    // const api = await playwrightRequest.newContext();
    // const res = await api.get(`${URLS.api}/admin/e2e-accounts`);
    // ... delete accounts matching E2E_EMAIL_RE ...
    // await api.dispose();
  } catch {
    // teardown is best-effort
  }
}
