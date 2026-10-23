import { test, expect } from '@playwright/test';
import { openHome } from './helpers.js';

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
]) {
  test(`layout has no major horizontal overflow at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await openHome(page);
    const dims = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      page: document.documentElement.scrollWidth
    }));
    expect(dims.viewport).toBeGreaterThan(0);
    expect(dims.page).toBeLessThanOrEqual(dims.viewport + 2);
  });
}
