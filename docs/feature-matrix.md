# Feature matrix

Checks are implemented as black-box browser interactions, but each needs a real staging run before it can be marked verified.

| Area | Coverage | Mutation | Current confidence |
|---|---|---:|---|
| Home and core navigation | visible content, menu entry, browser errors | No | Implemented, run pending |
| Menu and products | menu discovery, product/add-control discovery | local basket | Selector calibration pending |
| Customisation | open options and choose a visible option | local UI state | Selector calibration pending |
| Basket and checkout | basket/cart and checkout entry point | local UI state | Selector calibration pending |
| Customer account | account/login/register entry point | No account creation | Discovery only |
| Demo payment and order | refuses to submit unless visible demo option | Creates staging order | Explicit opt-in only |
| Staff | dedicated account login and visible order controls | Login only except full journey | Credentials and locator calibration pending |
| Kitchen | queue and status-action discovery | Status action only in explicit full journey | Locator calibration pending |
| Responsive layout | mobile/tablet/desktop overflow | No | Implemented, run pending |
| Accessibility heuristics | button names, form labels, image alt, main/H1 | No | Implemented, run pending |
| Production | read-only homepage and menu smoke | No | Requires verified production URL |
| Internal database consistency | intentionally not accessed | N/A | Out of scope |
