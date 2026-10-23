# Feature matrix

These checks are black-box browser interactions. Status below reflects completed staging CI runs as of 2026-10-23; rerun after app fixes before marking a defect resolved.

| Area | Coverage | Mutation | Current result |
|---|---|---:|---|
| Home and core navigation | visible content, menu entry, browser errors | No | **Pass:** 3 staging smoke checks passed |
| Primary navigation | visible links to menu, lunch, drink, order and account journeys | No | **Pass:** primary navigation assertions passed |
| Public route health | HTTP response, expected visible content, uncaught browser errors | No | **Failures observed:** `/hitta-hit/`, `/allergener/`, `/integritetspolicy/`, `/cookies/`, `/kopvillkor/` returned HTTP 500 in run 39915170998 |
| Linked manuals | public link health | No | **Failures observed:** PDF and DOCX manual URLs returned HTTP 404 in run 39915170998 |
| Menu and products | menu discovery, product/add-control discovery | Local basket only | Discovery implemented; localized add-to-basket selectors are being calibrated |
| Customisation | open options and choose a visible option | Local UI state | Locator calibration pending |
| Basket and checkout | basket/cart and checkout entry point | Local UI state | Locator calibration pending |
| Customer account | account/login/register entry point | No account creation | Route discovery passed; authentication workflow not yet verified |
| Demo payment and order | refuses to submit unless visible demo option | Creates staging order | Explicit opt-in only; not yet verified end to end |
| Staff | dedicated account login and visible order controls | Login only except full journey | Requires dedicated credentials and locator calibration |
| Kitchen | queue and status-action discovery | Status action only in explicit full journey | Requires dedicated credentials and locator calibration |
| Responsive layout | mobile/tablet/desktop overflow | No | **Pass:** 3 viewport checks passed |
| Accessibility heuristics | button names, form labels, image alt, main/H1 | No | **Pass:** 3 heuristic checks passed |
| Security smoke | HTTPS, mixed content, password-form destination, external target-blank links, public error/secret markers | No | Added; awaiting completed CI result |
| Production | read-only homepage and menu smoke | No | Requires verified production URL; not run |
| Internal database consistency | intentionally not accessed | N/A | Out of scope |

See [staging observations](staging-observations.md) for details. Failures are intentionally retained as failing tests; do not weaken assertions merely to make CI green. Fix the application or correct a proven URL mapping, then rerun.
