# CivicConnect Defect Register
# Milestone Three

**See Also:** Tests Evidence under test-evidence.md and Test plan under test-plan.md

Status values: Open / In progress / Fixed / Deferred / Won’t fix. A Deferred or Won’t fix defect needs a reason and feeds into residual risk.

NOTE: for issue defect register and regression tests

## Defect Log from All Tests
| Defect ID | Found by | Description | Related req/risk | Severity | Priority | Status | Fix PR | Regression test |
|---|---|---|---|---|---|---|---|---|
| DEF-001 | CI run on PR #96 | `seed.sql` referenced the local `postgres` role; failed in CI where only `civic` exists. Worked locally, not portable. | NFR-010, NFR-007 | Major | High | Fixed | #99 | CI step "Create schema and seed" runs seed.sql under a non-postgres user on every PR |
| DEF-002 | Chanzél (no checks on PR #95) | Workflow stored in `.github/Workflows` (capital W); GitHub ignored it, so #95 merged with no CI run. | NFR-010 | Major | High | Fixed | #99 | `build-and-test` is a required check: if the workflow is missing or misnamed, no PR can merge |
| DEF-003 | Code review during test design (Chanzél) | Status can change to any status the role allows, regardless of current status (e.g. Pending → Closed). No transition rule exists. | FR-010, FR-012 | Major | High | Fixed |PR  #75 | TC-U01, TC-B06 |
| DEF-004 | Code review during test design (Chanzél) | Status changes and assignments never write to `request_status_history` (table has 0 rows); no transaction. | NFR-009, RISK-008 | Major | High | Fixed by PR #75 | PR #75 | TC-I04, TC-I05 |
| DEF-005 | Unit test design for TC-U02 (Chanzél) | DATE columns are converted to local-midnight timestamps by pg; in South African time the API sends the previous day (e.g. 2026-10-20 → 2026-10-19T22:00Z). Dashboard shows due dates one day early, marks requests overdue a day early, and reassigning without editing the date saves the earlier day (drift). Not visible in CI (UTC). | FR-014, FR-009, RISK-011 | Major | High | Fixed | PR #102 | TC-I03 (assert dueDate returned as YYYY-MM-DD) |
| DEF-006 | Chanzél | The API tests share a database, hence why all three of them need to run one at a time and not concurrently. It was found after running all the API tests and 7 out of the 22 failed | Not related to any specific req/risk | High | Must | Fixed | Fixed by PR #103 and added in max workers in package.json to prevent  it from happening | - | 
| DEF-007 | ESLint finding SA-002 (Chanzél) | Optional date fields (incidentDate, dateLost) are not validated: the helper isValidDateOnly existed but was never called. An invalid date reaches PostgreSQL and returns 500 instead of a 400 with a message. | NFR-011 | Minor | Low | Deferred: the UI date picker only sends valid dates; dead helper removed in #25 (SA-002) | | — |
| DEF-008 | Chanzél| Route /staff/requests/:id in App.jsx is not wrapped in RequireAuth, so any visitor can open the staff detail page shell. The API still refuses the data (401/403, TC-I01/I02), so no data leaks. | NFR-001, NFR-002 | Minor | Low | Open | | — |
| DEF-009 | Chanzél | RequesterRequestDetails.jsx logs full API responses to the browser console (console.log "FULL REQUEST API RESPONSE", "COMMENTS API RESPONSE"): leftover debug logging. | NFR-003 | Minor | Low | Open | | — |