import { test, expect } from '@playwright/test';
import { openHome } from './helpers.js';

async function inventory(page, label) {
  const snapshot = await page.evaluate(() => {
    const visible = el => {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
    };
    const text = el => (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').replace(/\s+/g, ' ').trim().slice(0, 160);
    return {
      title: document.title,
      url: location.href,
      headings: [...document.querySelectorAll('h1,h2,h3')].filter(visible).map(text).slice(0, 50),
      buttons: [...document.querySelectorAll('button,[role="button"]')].filter(visible).map(text).slice(0, 80),
      links: [...document.querySelectorAll('a[href]')].filter(visible).map(el => ({ text: text(el), href: el.getAttribute('href') })).slice(0, 100),
      inputs: [...document.querySelectorAll('input,select,textarea')].filter(visible).map(el => ({
        type: el.type || el.tagName.toLowerCase(), name: el.name, placeholder: el.placeholder, label: el.labels?.[0]?.innerText || el.getAttribute('aria-label') || ''
      })).slice(0, 50),
      bodyText: (document.body.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 2500)
    };
  });
  console.log(`UI_INVENTORY_${label}=${JSON.stringify(snapshot)}`);
}

test('diagnostic: record visible homepage and menu UI for locator calibration', async ({ page }) => {
  await openHome(page);
  await inventory(page, 'HOME');
  const menu = page.getByRole('link', { name: /menu|order|food/i }).or(
    page.getByRole('button', { name: /menu|order|food/i })
  ).first();
  if (await menu.isVisible().catch(() => false)) {
    await menu.click();
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    await inventory(page, 'AFTER_MENU_ENTRY');
  }
  expect(await page.locator('body').innerText()).toBeTruthy();
});
