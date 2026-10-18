# CivicConnect M1 Scope → Final Delivery & Scope Completion

## Milestone Four (Final)

**Baseline:** the 29 approved M1 requirements and their acceptance criteria (`requirements.md`), one acceptance criterion each.
**Scoring (M4 brief):** Met = 1.0 · Partially met = 0.5 · Not met = 0.0
**Final status categories:** IMPLEMENTED · PARTIALLY IMPLEMENTED · NOT IMPLEMENTED · CHANGED THROUGH APPROVED CHANGE
**Evidence:** test IDs refer to `test-evidence.md`; automated unit, API and browser tests run in CI on the final baseline `v3.0-rc1` (https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/39028108910/job/117383002968). TC-P01 is supported by separately recorded local k6 results, not a CI performance run.

## 1. Functional Requirements

| M1 item | M1 priority | Final status | Acceptance criterion | Score | Evidence | Reason for variance |
| --- | --- | --- | --- | --- | --- | --- |
| FR-001 Submit a service request | Must | IMPLEMENTED | Met | 1 | TC-B01, TC-I03, TC-E01 | Delivered as committed |
| FR-002 Categorise a request | Must | IMPLEMENTED | Met | 1 | TC-B01, TC-B02, TC-E01 | Delivered as committed |
| FR-003 View current status | Must | IMPLEMENTED | Met | 1 | TC-E01 | Delivered as committed |
| FR-004 View previous requests | Should | IMPLEMENTED | Met | 1 | TC-E01 | Delivered as the requester's list of their own requests |
| FR-005 Meaningful feedback (accepted, rejected, updated, completed) | Must | PARTIALLY IMPLEMENTED | Partially met | 0.5 | TC-U05, TC-E02 | Feedback works for assignment, status updates, completion and comments. **No "rejected" feedback:** the built status model has no Rejected status (DEC-007, TD-006), and failed notifications aren't retried (TD-005) |
| FR-006 Staff view relevant requests | Must | IMPLEMENTED | Met | 1 | TC-I02, TC-B06, TC-E02 | Staff only see requests assigned to them; others are blocked |
| FR-007 Search, filter and sort | Should | IMPLEMENTED | Met | 1 | TC-E02 | Search and filter verified in E2E; newest/oldest sorting is implemented in `StaffDashboard.jsx`, but no separate sorting test or manual verification record is cited |
| FR-008 Staff view complete details | Must | PARTIALLY IMPLEMENTED | Partially met | 0.5 | TC-E02 | All submitted details, status, category and comments are shown. **The status history is recorded (TC-I04) but not displayed to staff** |
| FR-009 Accept or assign responsibility | Must | IMPLEMENTED | Met | 1 | TC-U04, TC-I04, TC-E02 | Management assigns; recorded with staff, due date and history (DEF-004 fixed) |
| FR-010 Controlled status transitions | Must | IMPLEMENTED | Met | 1 | TC-U01, TC-B05, TC-B06 | DEF-003 found and fixed; invalid moves blocked |
| FR-011 Record actions, comments, resolution | Must | IMPLEMENTED | Met | 1 | TC-E02 | Comments saved and shown; resolution recorded via status and history. API-level comment tests are a gap (TD-007) |
| FR-012 Resolve or close where authorised | Must | IMPLEMENTED | Met | 1 | TC-U01, TC-B06, TC-E02 | Only Resolved → Closed allowed; staff cannot close |
| FR-013 Management activity information | Should | PARTIALLY IMPLEMENTED | Partially met | 0.5 | TC-I08 | Dashboard data proven correct at API level; the on-screen figures are not asserted by a test |
| FR-014 Identify open, overdue, resolved, closed | Must | PARTIALLY IMPLEMENTED | Partially met | 0.5 | TC-U02, TC-I08 | Overdue rule and data proven (DEF-005 fixed); on-screen counts not asserted; overdue is calculated in the browser (TD-002) |
| FR-015 Information by category / status | Should | PARTIALLY IMPLEMENTED | Partially met | 0.5 | TC-I08 | Counts by status and category proven at API level; on-screen reporting not asserted |
| **Functional total** |  |  |  | **12.5 / 15** |  |  |

## 2. Non-Functional Requirements

| M1 item | M1 priority | Final status | Acceptance criterion | Score | Evidence | Reason for variance |
| --- | --- | --- | --- | --- | --- | --- |
| NFR-001 Authentication | Must | IMPLEMENTED | Met | 1 | TC-I01 (tested protected routes) | Delivered as committed (DEF-007 fixed) |
| NFR-002 Role-based access | Must | IMPLEMENTED | Met | 1 | TC-U03, TC-I02 | All 8 tested unauthorised scenarios blocked |
| NFR-003 Sensitive data protection | Must | PARTIALLY IMPLEMENTED | Partially met | 0.5 | TC-I01, TC-I02, TC-I05; DEF-008 fixed | No internal details in errors, no debug logging. **HTTPS is not in place**, since the system stays in staging (`go-live-decision.md`) |
| NFR-004 No secrets in source control | Must | IMPLEMENTED | Met | 1 | `security-scanning.md` (gitleaks full history, GitHub secret scanning) | Delivered as committed |
| NFR-005 Response time | Must | IMPLEMENTED | Met | 1 | TC-P01: p95 52.92 ms at 50 users | Met for the tested workload |
| NFR-006 Usability | Should | IMPLEMENTED | Met | 1 | `usability-test.md` (#88): 5/5 participants completed all 3 key tasks unassisted (100%, target ≥ 80%) | Met. Limitation: small, non-municipal sample on local staging |
| NFR-007 Data stored and retrievable | Must | IMPLEMENTED | Met | 1 | TC-I03 | Delivered as committed |
| NFR-008 Availability ≥ 99% | Should | IMPLEMENTED | Met | 1 | `availability.md` + `availability-log.csv` (#89): 120/120 checks up, 100% over 60 min (17 Oct 2026) | Met. Limitation: short window on local staging |
| NFR-009 Auditability | Must | IMPLEMENTED | Met | 1 | TC-B05, TC-I04, TC-I05 | DEF-004 found and fixed |
| NFR-010 Maintainability | Should | IMPLEMENTED | Met | 1 | CI required check, PR #100, `static-analysis.md` | Required checks enforce subsequent merges; PR #95 occurred before CI was detected and is recorded as an exception |
| NFR-011 Data integrity | Must | PARTIALLY IMPLEMENTED | Partially met | 0.5 | TC-U04, TC-B02, TC-B03 | Mandatory fields and validation rules verified; **optional date fields not validated** (DEF-006, deferred) |
| NFR-012 Browser compatibility | Should | IMPLEMENTED | Met | 1 | TC-E01, TC-E02 in Chromium, Firefox, Edge | Delivered as committed |
| NFR-013 50 concurrent users | Could | IMPLEMENTED | Met | 1 | TC-P01 | Met for the tested workload |
| NFR-014 Recoverability | Should | PARTIALLY IMPLEMENTED | Partially met | 0.5 | `backup-restore.md` (#83) | Backup created and restored; all 5 tables matched (100% of rows), **but the request tables were empty**, so recovery of actual service data wasn't demonstrated. |
| **Non-functional total** |  |  |  | **12.5 / 14** |  |  |

## 3. Scope Completion %

| Scope area | Score |
| --- | --- |
| Functional | 12.5 |
| Non-functional | 12.5 |
| **Total** | **25.0 / 29** |
| **Scope Completion %** | **86.2%** (= 25.0 ÷ 29 × 100) |

Above the 80% target. Repeating the backup drill with request data (NFR-014 → Met) would add 0.5 (87.9%).

## 4. Must-Haves Not Fully Met (Justification)

| Must | What's missing | Reason | Consequence | Recorded in |
| --- | --- | --- | --- | --- |
| FR-005 | Reject feedback; notification retry | Team decision to keep the built status model, which has no Rejected status (DEC-007); retry not built in time | A requester can't be told their request was rejected; a failed notification is lost (the status is still visible on screen) | DEC-007, TD-005, TD-006 |
| FR-008 | Status history not shown to staff | History is recorded but no screen was built for it | Staff can't see the timeline of changes in the UI | RTM |
| FR-014 | On-screen counts not asserted | Rule and data proven; counting happens in the browser | A display error would not be caught by an automated test | TD-002 |
| NFR-003 | HTTPS | Local staging uses HTTP; configure and verify HTTPS before production | Blocks production release | `go-live-decision.md` (B2) |
| NFR-011 | Optional dates not validated | Minor; UI only sends valid dates | An API client can trigger a 500 with an invalid optional date | DEF-006 |

## 5. Deferred and Out-of-Scope Items

Items outside the committed M1 scope are **not** counted above and are not failures. The baseline is recorded in `../PED/PED_v1.0.md`, Sections 4.2–4.3.

- **Out of scope:** payroll, employee management, finance and broader business planning unrelated to service-request management.
- **Future/optional:** additional automatic alerts, SMS/email integration, enhanced management tools, mobile access, automatic task sorting and integration with existing organisational systems. Inclusion requires change-control review; delivered in-app notifications do not imply delivery of these optional integrations.

Deferred defects and implementation compromises within the committed scope remain reflected in the scores above and are tracked in `../Quality/defect-register.md` and `../Quality/technical-debt-register.md`.

## 6. Conclusion

86.2% of the approved M1 acceptance criteria are met, with every core requester, staff and management journey implemented and verified. The five partially met Must-haves are visible, explained and recorded; none is a hidden failure. The delivered scope is coherent and useful, but not yet released, for the security reasons in `go-live-decision.md`.
