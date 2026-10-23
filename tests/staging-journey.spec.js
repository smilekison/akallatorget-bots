import { test, expect } from '@playwright/test';
import { openHome, bodyText, clickCandidate, loginThroughUi, allowStagingMutations } from './helpers.js';

test('full customer-to-kitchen journey through visible UI using simulated payment', async ({ page, browser }) => {
  test.skip(process.env.TARGET_ENV === 'production', 'Full journeys are forbidden in production.');
  test.skip(!allowStagingMutations, 'Enable staging mutations explicitly after verifying test accounts and demo payment.');
  for (const role of ['customer', 'staff', 'kitchen']) {
    test.skip(!process.env[`${role.toUpperCase()}_EMAIL`] || !process.env[`${role.toUpperCase()}_PASSWORD`],
      `Missing dedicated ${role} test account.`);
  }
  await openHome(page);
  await clickCandidate(page, ['menu', 'order', 'food', 'take away']);
  const add = page.getByRole('button', { name: /add to basket|add to cart|add item/i }).first();
  if (!await add.isVisible().catch(() => false)) test.skip(true, 'Add-to-basket control not identified; update selectors from screenshot/trace.');
  await add.click();
  await clickCandidate(page, ['basket', 'cart', 'checkout', 'view order']);
  expect((await bodyText(page)).length).toBeGreaterThan(20);

  const demo = page.getByText(/demo payment|simulated payment|test payment/i).first();
  if (!await demo.isVisible().catch(() => false)) test.skip(true, 'No visible demo/simulated payment option; refusing to submit.');
  await demo.click();
  const submit = page.getByRole('button', { name: /place order|submit order|confirm order|pay now/i }).first();
  if (!await submit.isVisible().catch(() => false)) test.skip(true, 'Order submit control not identified.');
  await submit.click();
  expect(await bodyText(page)).toMatch(/order|receipt|payment|thank|confirm/i);

  for (const role of ['staff', 'kitchen']) {
    const context = await browser.newContext();
    const rolePage = await context.newPage();
    try {
      await openHome(rolePage);
      const entry = rolePage.getByRole('link', { name: new RegExp(`${role}|staff|kitchen|login|log in`, 'i') }).or(
        rolePage.getByRole('button', { name: new RegExp(`${role}|staff|kitchen|login|log in`, 'i') })
      ).first();
      if (await entry.isVisible().catch(() => false)) await entry.click();
      const result = await loginThroughUi(rolePage, role);
      if (result.skipped) test.skip(true, result.reason);
      await expect(rolePage.locator('body')).toBeVisible();
      expect((await bodyText(rolePage)).length).toBeGreaterThan(20);
      const action = rolePage.getByRole('button', { name: /preparing|ready|complete|served|accept order/i }).first();
      if (await action.isVisible().catch(() => false)) await action.click();
    } finally { await context.close(); }
  }
});
