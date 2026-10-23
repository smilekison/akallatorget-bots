import { expect } from '@playwright/test';

export class JudgeBot {
  constructor(page) { this.page = page; }
  async visiblePage() {
    await expect(this.page.locator('body')).toBeVisible();
    const text = (await this.page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
    expect(text.length, 'Page should contain visible content').toBeGreaterThan(10);
    return text;
  }
  noPageErrors(errors) { expect(errors, 'No uncaught browser errors').toEqual([]); }
  sameSiteAfterClick(beforeUrl) { expect(new URL(this.page.url()).origin).toBe(new URL(beforeUrl).origin); }
}

export class CustomerBot {
  constructor(page) { this.page = page; this.judge = new JudgeBot(page); }
  async visitHome() { await this.page.goto('/'); return this.judge.visiblePage(); }
  async openMenu() { return clickFirstVisible(this.page, [
    this.page.getByRole('link', { name: /menu|order|food/i }),
    this.page.getByRole('button', { name: /menu|order|food/i }),
    this.page.getByText(/menu|order food|take away/i).first()
  ]); }
  async addFirstAvailableItem() { return clickFirstVisible(this.page, [
    this.page.getByRole('button', { name: /add to basket|add to cart|add item/i }),
    this.page.getByRole('button', { name: /^\\+$/ }),
    this.page.locator('[aria-label*="add" i]').first()
  ]); }
  async openBasket() { return clickFirstVisible(this.page, [
    this.page.getByRole('link', { name: /basket|cart|checkout|your order/i }),
    this.page.getByRole('button', { name: /basket|cart|checkout|your order/i }),
    this.page.locator('[aria-label*="basket" i], [aria-label*="cart" i]').first()
  ]); }
  async customizationControlCount() { return this.page.locator('input[type="checkbox"], input[type="radio"], select, [role="checkbox"], [role="radio"]').count(); }
}

export class StaffBot {
  constructor(page) { this.page = page; }
  async login() { return loginViaVisibleForm(this.page, 'STAFF'); }
  async observeOrders() {
    const text = await this.page.locator('body').innerText();
    return { visible: /order|beställ|kitchen|queue|status/i.test(text), text };
  }
}

export class KitchenBot {
  constructor(page) { this.page = page; }
  async login() { return loginViaVisibleForm(this.page, 'KITCHEN'); }
  async observeQueue() {
    const text = await this.page.locator('body').innerText();
    return { visible: /order|queue|preparing|ready|kitchen|beställ/i.test(text), text };
  }
  async statusActionCount() { return this.page.getByRole('button', { name: /start|preparing|ready|complete|served|done/i }).count(); }
}

export class JourneyBot {
  constructor(customerPage, staffPage, kitchenPage) {
    this.customer = new CustomerBot(customerPage);
    this.staff = new StaffBot(staffPage);
    this.kitchen = new KitchenBot(kitchenPage);
  }
}

export async function clickFirstVisible(page, locators) {
  for (const locator of locators) {
    try {
      const first = locator.first();
      if (await first.isVisible()) { await first.click(); return true; }
    } catch { /* try next accessible UI candidate */ }
  }
  return false;
}

export async function loginViaVisibleForm(page, prefix) {
  const email = process.env[`${prefix}_EMAIL`], password = process.env[`${prefix}_PASSWORD`];
  if (!email || !password) return { skipped: true, reason: `Missing dedicated ${prefix.toLowerCase()} test account.` };
  const emailInput = page.locator('input[type="email"], input[autocomplete="username"], input[name*="email" i]').first();
  const passwordInput = page.locator('input[type="password"], input[autocomplete="current-password"]').first();
  if (!await emailInput.isVisible().catch(() => false) || !await passwordInput.isVisible().catch(() => false)) {
    return { skipped: true, reason: 'Could not identify visible login fields.' };
  }
  await emailInput.fill(email);
  await passwordInput.fill(password);
  await clickFirstVisible(page, [page.getByRole('button', { name: /log in|login|sign in|continue/i })]);
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  return { skipped: false };
}
