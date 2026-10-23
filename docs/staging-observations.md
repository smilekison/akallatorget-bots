# Staging observations

Last confirmed browser run: GitHub Actions run [39915170998](https://github.com/smilekison/akallatorget-bots/actions/runs/39915170998), 2026-10-23.

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

These statuses were returned by the staging host in the run above. Re-run the latest workflow to determine whether they are persistent or transient before closing application issues.

## Test-suite caveats

- The customer, staff and kitchen suites remain partly conditional because controls and role credentials must be discovered/configured.
- Full order creation remains disabled by default and must only run against staging with dedicated accounts and a verified simulated-payment path.
- Production must remain read-only.
