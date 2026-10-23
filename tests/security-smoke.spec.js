import { test, expect } from '@playwright/test';

test('security smoke: public page uses HTTPS and does not load mixed content', async ({ page, baseURL }) => {
  expect(new URL(baseURL).protocol).toBe('https:');
  const insecure = [];
  page.on('request', request => {
    if (request.url().startsWith('http://') && !request.url().startsWith('http://localhost')) {
      insecure.push(request.url());
    }
  });
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
  expect(insecure, 'No insecure HTTP subresources on the HTTPS site').toEqual([]);
});

test('security smoke: forms do not submit credentials to an unrelated origin', async ({ page, baseURL }) => {
  await page.goto('/konto/');
  const baseOrigin = new URL(baseURL).origin;
  const riskyForms = await page.locator('form').evaluateAll(forms => forms.map(form => {
    const action = form.getAttribute('action') || location.href;
    const method = (form.getAttribute('method') || 'get').toLowerCase();
    return { action: new URL(action, location.href).href, method, hasPassword: Boolean(form.querySelector('input[type="password"]')) };
  }));
  const risky = riskyForms.filter(form => form.hasPassword && form.method === 'post' && new URL(form.action).origin !== baseOrigin);
  expect(risky, 'Password forms must not post to a third-party origin').toEqual([]);
});

test('security smoke: new-tab external links have opener protection', async ({ page, baseURL }) => {
  await page.goto('/');
  const unsafe = await page.locator('a[target="_blank"][href]').evaluateAll(links => links
    .filter(link => new URL(link.href, location.href).origin !== location.origin)
    .filter(link => !/(^|\s)(noopener|noreferrer)(\s|$)/i.test(link.getAttribute('rel') || ''))
    .map(link => ({ text: (link.innerText || '').trim().slice(0, 80), href: link.href }))
  );
  expect(unsafe, 'External target=_blank links should use rel=noopener or noreferrer').toEqual([]);
});

test('security smoke: public page does not expose common stack-trace or secret markers', async ({ page }) => {
  await page.goto('/');
  const text = (await page.locator('body').innerText()).slice(0, 20000);
  expect(text).not.toMatch(/(?:password|secret|token)\s*[:=]\s*['"][^'"]{8,}/i);
  expect(text).not.toMatch(/(?:Traceback \(most recent call last\)|at [\w$.]+ \([^\n]+:\d+:\d+\))/);
});
