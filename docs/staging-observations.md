# Staging observations

Latest confirmed browser run: GitHub Actions run [39915556524](https://github.com/smilekison/akallatorget-bots/actions/runs/39915556524), 2026-10-23.

These are observations from public HTTP/browser behavior only. The bots do not access application source or databases.

## Findings to verify/fix in the application repository

| Severity | Route/resource | Observed result | Evidence |
|---|---|---|---|
| High | `/hitta-hit/` | HTTP 500 | Navigation route assertion and internal-link check failed |
| High | `/integritetspolicy/` | HTTP 500 | Internal-link check failed |
| High | `/cookies/` | HTTP 500 | Internal-link check failed |
| High | `/kopvillkor/` | HTTP 500 | Internal-link check failed |
| High | `/allergener/` | HTTP 500 | Internal-link check failed |
| Medium | `/manual/Akalla_Torget_Demo_Test_Guide.pdf` | HTTP 404 | Internal-link check failed |
| Medium | `/manual/Akalla_Torget_Demo_Test_Guide.docx` | HTTP 404 | Internal-link check failed |

The latest run reproduced all five HTTP 500 responses and both manual 404 responses. The route-inventory diagnostics ran after assertions failed and captured `An unexpected error occurred.` for each 500 route. These are confirmed repeated observations across consecutive staging CI runs, not a single isolated failure. The application team should inspect server-side error logs for these routes; the black-box bots cannot infer the underlying server exception.

## Additional UI observation\n\n- The homepage body text includes a literal `[object Object]` near the hero/contact content. A regression assertion has been added to the staging smoke suite to prevent this placeholder from silently returning.\n\n## Test-suite caveats

- The customer, staff and kitchen suites remain partly conditional because controls and role credentials must be discovered/configured.
- Full order creation remains disabled by default and must only run against staging with dedicated accounts and a verified simulated-payment path.
- Production must remain read-only.
