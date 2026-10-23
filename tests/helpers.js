import { expect } from '@playwright/test';

export const targetEnv = process.env.TARGET_ENV || 'staging';
export const allowStagingMutations = targetEnv === 'staging' && process.env.ENABLE_STAGING_MUTATIONS === 'true';

export async function openHome(page) {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('body')).not.toBeEmpty();
}
export async function bodyText(page) {
  return (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
}
export async function clickCandidate(page, names) {
  for (const name of names) {
    const candidates = [
      page.getByRole('link', { name: new RegExp(name, 'i') }),
      page.getByRole('button', { name: new RegExp(name, 'i') }),
      page.getByText(new RegExp(name, 'i')).first()
    ];
    for (const locator of candidates) {
      try { if (await locator.first().isVisible()) { await locator.first().click(); return true; } }
      catch { /* try another browser-visible candidate */ }
    }
  }
  return false;
}
export async function loginThroughUi(page, role) {
  const email = process.env[`${role.toUpperCase()}_EMAIL`];
  const password = process.env[`${role.toUpperCase()}_PASSWORD`];
  if (!email || !password) return { skipped: true, reason: `Missing dedicated ${role.toUpperCase()} credentials.` };
  const emailInput = page.locator('input[type="email"], input[name*="email" i], input[autocomplete="username"]').first();
  const passwordInput = page.locator('input[type="password"], input[autocomplete="current-password"]').first();
  if (!await emailInput.isVisible().catch(() => false) || !await passwordInput.isVisible().catch(() => false)) {
    return { skipped: true, reason: 'Visible login form not detected; inspect screenshot/trace and calibrate selectors.' };
  }
  await emailInput.fill(email);
  await passwordInput.fill(password);
  await clickCandidate(page, ['log in', 'login', 'sign in', 'continue']);
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  return { skipped: false };
}
