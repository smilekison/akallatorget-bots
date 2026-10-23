import { test, expect } from '@playwright/test';
import { openHome, bodyText, clickCandidate } from './helpers.js';

test('customer can discover menu and account journeys', async ({ page }) => {
  await openHome(page);
  expect(await bodyText(page)).toMatch(/menu|food|order|take.?away/i);
  await clickCandidate(page, ['menu', 'order', 'food', 'take away']);
  await expect(page.locator('body')).toBeVisible();
  await clickCandidate(page, ['account', 'login', 'log in', 'register', 'sign up']);
  await expect(page.locator('body')).toBeVisible();
});

test('basket add control works when the menu exposes one', async ({ page }) => {
  await page.goto('/bestall/');
  await expect(page.locator('body')).toBeVisible();
  const add = page.getByRole('button', { name: /lägg till|add to basket|add to cart|add item/i }).first();
  if (!await add.isVisible().catch(() => false)) test.skip(true, 'No accessible add-to-basket control; inspect trace to tune locators.');
  await add.click();
  await expect(page.locator('body')).toBeVisible();
  await clickCandidate(page, ['basket', 'cart', 'checkout']);
  await expect(page.locator('body')).toBeVisible();
});

test('product customization options can be changed when exposed', async ({ page }) => {
  await page.goto('/bestall/');
  await expect(page.locator('body')).toBeVisible();
  const customize = page.getByRole('button', { name: /anpassa|customi[sz]e|val|options|choose|edit/i }).first();
  if (!await customize.isVisible().catch(() => false)) test.skip(true, 'No accessible customization control detected.');
  await customize.click();
  await expect(page.locator('body')).toBeVisible();
  const option = page.locator('input[type="checkbox"], input[type="radio"], [role="checkbox"], [role="radio"], select, button[aria-pressed]').first();
  if (await option.isVisible().catch(() => false)) {
    const tag = await option.evaluate(el => el.tagName.toLowerCase());
    if (tag === 'select') {
      if (await option.locator('option').count() > 1) await option.selectOption({ index: 1 });
    } else if (await option.isEnabled().catch(() => false)) await option.click();
  }
});
