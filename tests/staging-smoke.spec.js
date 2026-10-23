import { test, expect } from '@playwright/test';
import { openHome, bodyText, clickCandidate } from './helpers.js';

test('staging homepage renders meaningful visible content without page errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openHome(page);
  expect((await bodyText(page)).length).toBeGreaterThan(40);
  expect(errors).toEqual([]);
});

test('menu or order entry point is discoverable', async ({ page }) => {
  await openHome(page);
  expect(await bodyText(page)).toMatch(/menu|food|order|take.?away|eat.?in/i);
  const before = page.url();
  if (await clickCandidate(page, ['menu', 'order', 'food', 'take away'])) {
    await expect(page.locator('body')).toBeVisible();
    expect(new URL(page.url()).origin).toBe(new URL(before).origin);
  }
});

test('no failed same-origin document navigations on initial page load', async ({ page }) => {
  const failed = [];
  const origin = new URL(process.env.STAGING_BASE_URL || 'https://akallatorget.smilekisan.com').origin;
  page.on('requestfailed', request => {
    if (request.isNavigationRequest() && request.url().startsWith(origin)) failed.push(request.url());
  });
  await openHome(page);
  expect(failed).toEqual([]);
});

test('homepage does not display raw JavaScript object placeholders', async ({ page }) => {
  await openHome(page);
  await expect(page.locator('body')).not.toContainText(/\\[object Object\\]/);
});
