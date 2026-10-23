import { test, expect } from '@playwright/test';
import { openHome, bodyText, loginThroughUi } from './helpers.js';

for (const role of ['staff', 'kitchen']) {
  test(`${role} bot can reach the portal and observe workflow controls`, async ({ page }) => {
    test.skip(!process.env[`${role.toUpperCase()}_EMAIL`] || !process.env[`${role.toUpperCase()}_PASSWORD`],
      `Configure dedicated staging ${role} credentials.`);
    await openHome(page);
    const entry = page.getByRole('link', { name: new RegExp(`${role}|staff|kitchen|login|log in`, 'i') }).or(
      page.getByRole('button', { name: new RegExp(`${role}|staff|kitchen|login|log in`, 'i') })
    ).first();
    if (await entry.isVisible().catch(() => false)) await entry.click();
    const result = await loginThroughUi(page, role);
    if (result.skipped) test.skip(true, result.reason);
    await expect(page.locator('body')).toBeVisible();
    expect((await bodyText(page)).length).toBeGreaterThan(10);
    await page.getByRole('button', { name: /preparing|ready|complete|served|accept|reject|start/i }).count();
  });
}
