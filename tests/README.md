# Browser test suites

- `staging-smoke.spec.js`: low-impact staging availability, navigation, page errors.
- `customer.spec.js`: customer navigation, basket controls, and customisation UI discovery.
- `operations.spec.js`: staff/kitchen login and visible workflow surfaces (credentials required).
- `staging-journey.spec.js`: opt-in customer order flow with a visible simulated payment, then staff and kitchen sessions.
- `responsive.spec.js`: mobile/tablet/desktop viewport overflow.
- `accessibility.spec.js`: browser-visible accessibility heuristics.
- `production-smoke.spec.js`: production homepage/menu only; never submits forms or changes order status.

All selectors are black-box UI selectors and should be calibrated using Playwright traces after an initial staging run. Do not replace them with direct database checks or private API calls.
