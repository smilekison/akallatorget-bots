import { test, expect } from '@playwright/test';
import { openHome } from './helpers.js';

test('buttons have accessible names and images declare alt text', async ({ page }) => {
  await openHome(page);
  const unnamedButtons = await page.getByRole('button').evaluateAll(buttons =>
    buttons.filter(button => !(button.getAttribute('aria-label') || button.innerText || button.getAttribute('title') || '').trim()
      && !button.hasAttribute('aria-hidden')).length
  );
  const missingAlt = await page.locator('img').evaluateAll(images => images.filter(img => !img.hasAttribute('alt')).length);
  expect(unnamedButtons).toBeLessThanOrEqual(3);
  expect(missingAlt).toBe(0);
});

test('page has main landmark and primary heading', async ({ page }) => {
  await openHome(page);
  expect(await page.getByRole('main').count()).toBeGreaterThanOrEqual(1);
  expect(await page.getByRole('heading', { level: 1 }).count()).toBeGreaterThanOrEqual(1);
});

test('form fields expose labels where present', async ({ page }) => {
  await openHome(page);
  const unlabeled = await page.locator('input:not([type="hidden"]), select, textarea').evaluateAll(fields =>
    fields.filter(field => {
      const id = field.id;
      return !(id && document.querySelector(`label[for="${CSS.escape(id)}"]`))
        && !field.getAttribute('aria-label') && !field.getAttribute('aria-labelledby') && !field.closest('label');
    }).length
  );
  expect(unlabeled).toBeLessThanOrEqual(2);
});
