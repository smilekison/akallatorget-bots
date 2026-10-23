import { test } from '@playwright/test';

const routes = [
  ['order', '/bestall/'],
  ['account', '/konto/'],
  ['pizza-menu', '/meny/pizza/'],
  ['a-la-carte', '/meny/a-la-carte/'],
  ['lunch', '/meny/lunch/'],
  ['find-us', '/hitta-hit/'],
  ['table-order', '/bord/'],
  ['english-home', '/en/'],
  ['allergens', '/allergener/'],
  ['privacy', '/integritetspolicy/'],
  ['cookies', '/cookies/'],
  ['terms', '/kopvillkor/']
];

test('diagnostic: inventory key customer-facing routes without submitting forms', async ({ page }) => {
  for (const [name, path] of routes) {
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' }).catch(() => null);
    await page.locator('body').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    const snapshot = await page.evaluate(() => {
      const visible = el => {
        const style = getComputedStyle(el), rect = el.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      };
      const label = el => (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').replace(/\s+/g, ' ').trim().slice(0, 120);
      return {
        title: document.title,
        headings: [...document.querySelectorAll('h1,h2,h3')].filter(visible).map(label).slice(0, 25),
        buttons: [...document.querySelectorAll('button,[role="button"]')].filter(visible).map(label).slice(0, 80),
        links: [...document.querySelectorAll('a[href]')].filter(visible).map(a => ({text:label(a),href:a.getAttribute('href')})).slice(0, 80),
        inputs: [...document.querySelectorAll('input,select,textarea')].filter(visible).map(el => ({type:el.type||el.tagName.toLowerCase(),name:el.name,placeholder:el.placeholder,label:el.labels?.[0]?.innerText||el.getAttribute('aria-label')||''})).slice(0,40),
        bodyText: (document.body.innerText||'').replace(/\s+/g,' ').trim().slice(0,1600)
      };
    }).catch(() => ({error:'Could not inventory route'}));
    console.log(`ROUTE_INVENTORY_${name.toUpperCase()}=${JSON.stringify({status:response?.status() ?? null,url:page.url(),...snapshot})}`);
  }
});
