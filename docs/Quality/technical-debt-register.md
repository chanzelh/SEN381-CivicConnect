# CivicConnect Technical Debt Register

## Milestone Four — Final

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026/10/14 | Register created; debt identified during M3 construction and verification |
| 2.0 | 2026/10/17 | **M4 closure:** final status for every item; TD-008 added (deferred dependency updates) |

**See also:** `defect-register.md` and the `decision-log.md` (for the decisions behind accepted debt).

Technical debt records design and maintainability compromises accepted during M3 and retained at M4 closure, with their future costs. Incorrect behaviour is recorded separately in `defect-register.md`.


| ID | Debt | Why accepted | Consequence if left | Planned action | Related |
| --- | --- | --- | --- | --- | --- |
| TD-001 | Database schema kept as a hand-edited `server/db/schema.sql`; no versioned migrations | Deadline pressure; a migration tool (e.g. node-pg-migrate) added a learning curve | Schema changes must be applied by hand to every database; environments can drift apart | Retained at M4 closure. Introduce versioned migrations before future schema changes to a database that already holds data | #12, DEF-001 |
| TD-002 | Overdue is calculated in the client (`client/src/utils/overdue.js`); no server `isOverdue` or `/reports/summary` endpoint, contrary to the M2 API contract (3.7.4, 3.8) | Avoided changing the API under deadline; dashboard already worked client-side | Any other consumer must re-implement the rule; reports can't be produced server-side; rule depends on the browser's timezone | Move the rule to the backend and return `isOverdue`/`overdueCount` from the API | FR-014, RISK-011, TC-U02, TC-I08 |
| TD-003 | 5 client pages load data with setState inside `useEffect` (`Navbar`, `ManagementDashboard`, `RequesterRequestDetails`, `StaffDashboard`, `StaffRequestDetails`); scoped ESLint exceptions in place; `pages/RequestDetails.jsx` is unreferenced | Refactoring 5 components without component tests under the M3 deadline risked regressions | Extra renders on page load; 5 lint exceptions and 3 `exhaustive-deps` warnings to maintain; dead page file | Refactor to a shared data-loading hook (or a library such as React Query), remove the exceptions, delete the unused page | SA-008, SA-009, SA-004 |
| TD-004 | No version field or stale-update check; the M2 contract's `version` + `409 STALE_UPDATE` (3.9 step 5) was not built | Out of reach in the M3 timeframe | Two users can overwrite each other's changes ("last write wins"); `FOR UPDATE` only stops simultaneous writes interleaving | Add a `version` column and compare it on update | RISK-009, TC-I07 (not applicable) |
| TD-005 | Notification retry and recovery not implemented; failures are only logged (M2 contract 3.10.4: up to 3 retries, failed notifications retryable) | Core request flow prioritised; failure is already tolerated safely (TC-U05) | A failed notification is lost; the requester may miss feedback | Store failed notifications with a status and add retry | FR-005, RISK-010, TC-U05 |
| TD-006 | API deviates from the M2 contract format: base path `/api` instead of `/api/v1`, errors as `{ message }` instead of `{ error: { code, message } }`, no `Rejected` status | Implementation evolved before the contract was enforced | Clients can't rely on error codes; no versioning path for breaking changes; FR-005 reject feedback not possible | Recorded as a controlled change (DEC-007); align or update the contract after the project | FR-005, DEC-007 |
| TD-007 | Test gaps at API level: login/signup (signup untested), comment endpoints, notification list/mark-read API, and cross-user access ("requester A reads requester B") | Tests were prioritised by risk for the M3 baseline; login and comments are exercised only through E2E | A regression in these areas would only be caught by E2E, or not at all for signup | Add API tests for these areas (see `coverage-report.md` section 4) | NFR-001, FR-011, FR-005, NFR-002, RISK-013 |
| TD-008 | Major dependency updates deferred: Dependabot PRs for jsdom 30, actions/checkout 7, actions/setup-node 7, actions/upload-artifact 7 | Changing CI tooling right before the M3/M4 submission baseline risked breaking the evidence pipeline | Tooling falls behind; future security fixes in these packages would be missed until updated | Apply one at a time after the project, each with a green CI run | `security-scanning.md`, NFR-004 |

## Milestone Four: Final Status

No debt was repaid during M4: the brief asks for finalisation, not new work, and each item was retained deliberately with its consequence stated.

| ID | Final status | Consequence for a future team | Suggested priority |
| --- | --- | --- | --- |
| TD-004 | Retained | Silent overwrites between staff remain possible (RISK-009). **Most important to fix:** it can lose a user's work without anyone noticing | 1 |
| TD-007 | Retained | Signup and comment APIs have no direct tests (RISK-013) | 2 |
| TD-005 | Retained | Failed notifications are lost (RISK-010; FR-005 partially met) | 3 |
| TD-002 | Retained | Overdue logic exists only in the browser | 4 |
| TD-006 | Retained | API format differs from the M2 contract; no Rejected status | 5 |
| TD-001 | Retained | Schema changes must be applied by hand; becomes urgent once a database holds real data | 6 |
| TD-003 | Retained | Lint exceptions and extra renders in 5 pages | 7 |
| TD-008 | Retained | Major tooling updates pending | 8 |
