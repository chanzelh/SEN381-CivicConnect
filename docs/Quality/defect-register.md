# CivicConnect Defect Register
# Milestone Four - Final

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026/10/14 | Register created during M3 testing (DEF-001–008) |
| 1.1 | 2026/10/16 | Added DEF-009 (shared test database, parallel test runs) |
| 2.0 | 2026/10/17 | M4 closure: final status recorded for every defect |

**See Also:** `test-evidence.md`, `test-plan.md`, `static-analysis.md`, `security-scanning.md`, `technical-debt-register.md`

**Severity of each defect :** Critical (core flow is unusable, data loss or security), Major (a requirement fails but a workaround exists), Minor (low impact). 
**Status of each defect :** Open/In Progress/Fixed/Deferred/Won't fix. A won't fix and deferred needs a reason and feeds residual risk.

## Summary
**Defects Logged :** 9
**Fixed :**  8
**Deferred :** 1 (DEF-006)
**Open :** 0
**Critical :**  0
**Major :** 5
**Minor :** 4

**How each were found:**
No defect was found by a user and all of them rather by a quality activity. 
- The first CI runs (DEF-001 till DEF-002)
- Code review while designing tests (DEF-003, DEF-004, DEF-007, DEF-008)
- Unit test design (DEF-005)
- Static Analysis (DEF-006)

## Defect Log from All Tests
| Defect ID | Found by | Description | Related req/risk | Severity | Priority | Status | Fix PR | Regression test |
|---|---|---|---|---|---|---|---|---|
| DEF-001 | First CI run (PR "Rename of files") | `seed.sql` referenced the local `postgres` role. It failed in CI, where the DB user is `civic`. Worked locally but wasn't portable | NFR-010, NFR-007 | Major | High | Fixed | #99 | CI step "Create schema and seed" runs `seed.sql` as a non-postgres user on every PR |
| DEF-002 | Chanzél (no checks on PR #95) | Workflow stored in `.github/Workflows` (capital W); GitHub ignored it, so #95 merged with no CI run | NFR-010 | Major | High | Fixed | #99 | `build-and-test` is a required check: a missing or misnamed workflow blocks every merge |
| DEF-003 | Code review during test design (Chanzél) | Status could change to any status the role allowed, regardless of current status (e.g. Pending → Closed). No transition rule existed | FR-010, FR-012 | Major | High | Fixed | #75 | TC-U01, TC-B06 |
| DEF-004 | Code review during test design (Chanzél) | Status changes and assignments never wrote to `request_status_history` (0 rows); no transaction | NFR-009, RISK-008 | Major | High | Fixed | #75 | TC-I04, TC-I05 (shown to fail when the transaction is split) |
| DEF-005 | Unit test design for TC-U02 (Chanzél) | `pg` converted DATE columns to local-midnight timestamps; in SAST the API sent the previous day, so due dates showed a day early, requests went overdue a day early, and reassigning without editing the date saved the earlier day. Not visible in CI (UTC) | FR-014, FR-009, RISK-011 | Major | High | Fixed | #102 | TC-I03 (dueDate returned as YYYY-MM-DD; shown to fail without the fix) |
| DEF-006 | ESLint finding SA-002 (Chanzél) | Optional date fields (`incidentDate`, `dateLost`) are not validated: the helper `isValidDateOnly` existed but was never called. An invalid date reaches PostgreSQL and returns 500 instead of a 400 with a message | NFR-011 | Minor | Low | Deferred: the UI date picker only sends valid dates; dead helper removed (SA-002) | — | — |
| DEF-007 | Code review for E2E (Chanzél) | Route `/staff/requests/:id` in `App.jsx` was not wrapped in `RequireAuth`, so any visitor could open the staff detail page shell. The API still refused the data (TC-I01/I02), so no data leaked | NFR-001, NFR-002 | Minor | Low | Fixed | - | `client/e2e/REG-DEF-007.staff-route-guard.e2e.js` (logged-out → /login; requester → /requester), 3 browsers |
| DEF-008 | Code review for E2E (Chanzél) | `RequesterRequestDetails.jsx` logged full API responses to the browser console (leftover debug logging) | NFR-003 | Minor | Low | Fixed | - | ESLint `no-console` rule in `client/eslint.config.js`: CI fails if `console.log` returns |
| DEF-009 | Running the API test suite (Chanzél) | API test files share one test database and each resets it, so running them in parallel made 7 of 22 checks fail randomly (deleted rows, deadlocks) | NFR-010 | Minor | Medium | Fixed | #103 | `"maxWorkers": 1` in `server/package.json`: all API tests run one file at a time in CI |

## Milestone Four: final status

| Defect | Final status | Evidence on the final baseline (v4.0) | Remaining consequence |
|---|---|---|---|
| DEF-001 – DEF-005 | Fixed and reverified | Regression checks pass in the final CI run: https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850/job/116270418002?pr=107 | None |
| DEF-006 | **Deferred (final)** | — | An API client that bypasses the UI can trigger a 500 with an invalid optional date. Low impact; listed as future work. |
| DEF-007 – DEF-009 | Fixed and reverified | Regression checks pass in the final CI run <link> | None |

**Conclusion:** no open or critical defects remain in the final release. One minor defect (DEF-006) is deliberately deferred with a stated reason and feeds residual risk.