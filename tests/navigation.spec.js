import { test, expect } from '@playwright/test';

const publicRoutes = [
  { path: '/', label: /pizza|restaurang|akalla/i },
  { path: '/meny/pizza/', label: /pizza/i },
  { path: '/meny/a-la-carte/', label: /à la carte|a la carte|kött|pasta|burgare/i },
  { path: '/meny/lunch/', label: /lunch/i },
  { path: '/veckans-tips/', label: /veckans tips|favoriter|köksmästar/i },
  { path: '/meny/dryck/', label: /dryck|bar|öl|vin/i },
  { path: '/hitta-hit/', label: /hitta|öppettider|adress|väg/i },
  { path: '/bestall/', label: /beställ|order|mat|hämt/i },
  { path: '/konto/', label: /konto|medlem|logga|registr/i },
  { path: '/allergener/', label: /allergen|specialkost|allergi/i },
  { path: '/integritetspolicy/', label: /integritet|privacy|personuppgift/i },
  { path: '/cookies/', label: /cookie|kaka|lagring/i },
  { path: '/kopvillkor/', label: /köpvillkor|villkor|terms/i },
  { path: '/en/', label: /pizza|restaurant|akalla/i },
  { path: '/en/menu/pizza/', label: /pizza/i },
  { path: '/en/menu/a-la-carte/', label: /à la carte|a la carte|meat|pasta|burger/i },
  { path: '/en/menu/lunch/', label: /lunch/i },
  { path: '/en/menu/drinks/', label: /drinks|bar|beer|wine/i },
  { path: '/en/find-us/', label: /find us|opening hours|address|directions/i },
  { path: '/en/order/', label: /order|food|pickup|pick up/i },
  { path: '/en/account/', label: /account|member|log in|register/i },
  { path: '/en/allergens/', label: /allergen|special diet|allergy/i },
  { path: '/en/privacy/', label: /privacy|personal data/i },
  { path: '/en/cookies/', label: /cookie|storage/i },
  { path: '/en/terms/', label: /terms|purchase/i }
];

test('primary navigation exposes core customer journeys', async ({ page }) => {
  await page.goto('/');
  for (const label of [/hem/i, /pizza/i, /à la carte/i, /lunch/i, /dryck/i, /hitta hit/i, /beställ online/i]) {
    await expect(page.getByRole('link', { name: label }).first()).toBeVisible();
  }
});

for (const route of publicRoutes) {
  test(`public route ${route.path} returns a usable page`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    expect(response, `Expected document response for ${route.path}`).not.toBeNull();
    expect(response.status(), `Unexpected HTTP status for ${route.path}`).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).not.toBeEmpty();
    await expect(page.locator('body')).toContainText(route.label);
    expect(errors, `Uncaught browser errors on ${route.path}`).toEqual([]);
  });
}

test('internal navigation links do not point to broken same-origin pages', async ({ page, request, baseURL }) => {
  await page.goto('/');
  const hrefs = await page.locator('a[href]').evaluateAll(links =>
    [...new Set(links.map(link => link.getAttribute('href')).filter(Boolean))]
      .filter(href => href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/#'))
      .slice(0, 20)
  );
  const results = await Promise.all(hrefs.map(async href => {
    const response = await request.get(new URL(href, baseURL).toString(), { timeout: 7000 }).catch(() => null);
    return { href, status: response?.status() ?? 'network-error' };
  }));
  const broken = results.filter(result => typeof result.status !== 'number' || result.status >= 400);
  expect(broken, 'All sampled internal navigation targets should return a non-error response').toEqual([]);
});
