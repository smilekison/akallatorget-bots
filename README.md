# akallatorget-bots

Independent black-box browser test bots for Akalla Torget. Tests observe the website only through Playwright browser interactions. They do not inspect application source, use private APIs, or connect to any database.

## Environments

- **Staging:** browser smoke tests and opt-in full customer/staff/kitchen journey.
- **Production:** read-only smoke tests only.
- Staging default: `https://akallatorget.smilekisan.com`

## Quick start

```bash
npm ci
npx playwright install --with-deps chromium
cp .env.example .env
npm run smoke:staging
```

Full staging order journey requires dedicated test accounts, simulated payment, and an explicit opt-in:

```bash
ENABLE_STAGING_MUTATIONS=true npm run e2e:staging
```

Production URL must be configured and verified before running `npm run smoke:production`. Production suite is guarded against order creation and other mutating flows.

## Bots

- **CustomerBot:** website navigation, menu, customization, basket, checkout UI.
- **StaffBot:** staff sign-in and observable order-management UI.
- **KitchenBot:** kitchen sign-in, queue and status control discovery.
- **JudgeBot:** deterministic visible-state assertions and browser failure checks.
- **JourneyBot:** coordinates isolated browser contexts for a restaurant workflow.

## Coverage

Home/navigation, menu discovery, product/basket controls, customization, checkout/payment-mode safety, customer account entry points, staff/kitchen login, order confirmation, responsive layout, basic accessibility, JavaScript/page errors, and Playwright screenshots/traces/videos for failures. See `docs/feature-matrix.md`.

## Test accounts

Set `CUSTOMER_EMAIL`, `CUSTOMER_PASSWORD`, `STAFF_EMAIL`, `STAFF_PASSWORD`, `KITCHEN_EMAIL`, and `KITCHEN_PASSWORD` in a local `.env` or GitHub Actions secrets. Use dedicated, least-privilege staging accounts only. Never commit credentials or reuse real customer accounts.

## Important limits

This is strict black-box UI testing: it can validate user-visible state transitions across separate role sessions, but cannot directly prove database integrity. Registration that depends on email verification/CAPTCHA is not auto-created; create dedicated test accounts through the normal website UI. Locators may need calibration against current deployed labels using browser traces. No brute force, destructive admin actions, load tests, or production writes are performed.
