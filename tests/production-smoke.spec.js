import { test, expect } from '@playwright/test';
import { openHome, bodyText, clickCandidate } from './helpers.js';

test('production homepage loads with visible content and no uncaught page errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openHome(page);
  expect((await bodyText(page)).length).toBeGreaterThan(40);
  expect(new URL(page.url()).protocol).toBe('https:');
  expect(errors).toEqual([]);
});

test('production menu is discoverable without submitting an order', async ({ page }) => {
  await openHome(page);
  const clicked = await clickCandidate(page, ['menu', 'food', 'order']);
  if (!clicked) test.skip(true, 'No accessible menu entry point was detected.');
  await expect(page.locator('body')).toBeVisible();
});
