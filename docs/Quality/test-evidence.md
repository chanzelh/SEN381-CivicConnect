# CivicConnect Test Evidence
# Milestone Three

**See Also:** The test plan for the team (test-plan.md) and defect register (defect-register.md)

**Execution environment:** every Evidence link points to a run of `.github/workflows/ci.yml` (job `build-and-test`). See `ci-pipeline.md` for what a CI run does and does not prove.

## Test Records

| Test ID | Title | Basis | Technique | Level | Status | Evidence |
|---|---|---|---|---|---|---|
| TC-U01 | Transition rule allows only valid status changes | FR-010 | White-box | Unit | Pass | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823/job/115749264354?pr=102 |
| TC-U02 | Overdue calculation around the threshold | FR-014, RISK-011 | BVA | Unit | Pass | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823/job/115749264354?pr=102 |
| TC-U03 | Permission check per role | NFR-002, RISK-002 | White-box | Unit | Pass | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823/job/115749264354?pr=102 |
| TC-U04 | Request reference is unique | FR-001 | White-box | Unit | Pass | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823/job/115749264354?pr=102 |
| TC-U05 | Notification failure does not undo the status update | FR-005, RISK-010 | Fault injection | Unit | Pass | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823/job/115749264354?pr=102 |
| TC-B01 | Valid submission accepted | FR-001, FR-002 | EP | API | PASS | |
| TC-B02 | Unknown or missing category rejected | FR-002, NFR-011 | EP | API | PASS | |
| TC-B03 | Field boundaries (missing, min, max, max+1) | NFR-011 | BVA | API | PASS | |
| TC-B05 | Valid workflow path Submitted → Closed | FR-010 | State transition | API | Not run | |
| TC-B06 | Invalid transitions blocked | FR-010, FR-012 | State transition | API | Not run | |
| TC-I01 | No token returns 401; no internal details | NFR-001, NFR-003 | Negative | API/integration | Not run | |
| TC-I02 | Requester on staff route returns 403; no internal details | NFR-002, NFR-003, RISK-002 | Negative | API/integration | Not run | |
| TC-I03 | Submitted request stored and retrievable | NFR-007 | Positive + DB check | API/integration | Not run | |
| TC-I04 | Assignment writes history entry | FR-009, NFR-009 | Positive + DB check | API/integration | Not run | |
| TC-I05 | Status change rolls back if history write fails | NFR-009, RISK-008 | Fault injection | API/integration | Not run | |
| TC-I08 | Dashboard counts match seeded data | FR-013, FR-014, FR-015, RISK-011 | Seeded data | API/integration | Not run | |
| TC-E01 | Requester submits and sees status and history | FR-001, FR-003, FR-004 | Journey | E2E | Not run | |
| TC-E02 | Staff finds, assigns, comments, resolves; requester sees update | FR-005, FR-007, FR-008, FR-009, FR-011, FR-012 | Journey | E2E | Not run | |
| TC-P01 | 50 concurrent users, p95 ≤ 2 s | NFR-005, NFR-013 | Load | Performance | Not run | |
| TC-I07 | Stale update rejected (conditional) | FR-009, RISK-009 | Concurrent update | API/integration | Not run | |