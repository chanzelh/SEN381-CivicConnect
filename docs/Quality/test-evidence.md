# CivicConnect Test Evidence
# Milestone Three

**See Also:** The test plan for the team (test-plan.md) and defect register (defect-register.md)

## How to Use Test Evidence Doc
1. Write the expected result **before** running the test.
2. Update the test's row in the summary table and add a full record below it.
3. Link the CI run, not a screenshot.
4. If the test fails, log a defect in the defect register and link it here.

## Summary

| Test ID | Title | Basis | Technique | Level | Status | Evidence |
|---|---|---|---|---|---|---|
| TC-U01 | Transition rule allows only valid status changes | FR-010 | White-box | Unit | Not run | |
| TC-U02 | Overdue calculation around the threshold | FR-014, RISK-011 | BVA | Unit | Not run | |
| TC-U03 | Permission check per role | NFR-002, RISK-002 | White-box | Unit | Not run | |
| TC-U04 | Request reference is unique | FR-001 | White-box | Unit | Not run | |
| TC-U05 | Notification failure does not undo the status update | FR-005, RISK-010 | Fault injection | Unit | Not run | |
| TC-B01 | Valid submission accepted | FR-001, FR-002 | EP | API | Not run | |
| TC-B02 | Unknown or missing category rejected | FR-002, NFR-011 | EP | API | Not run | |
| TC-B03 | Field boundaries (missing, min, max, max+1) | NFR-011 | BVA | API | Not run | |
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

## Test Records

<!-- Copy this block for each test -->

### TC-XXX — Title

| Field | Detail |
|---|---|
| Test basis | Requirement, acceptance criterion, risk or defect ID |
| Why selected | Risk/priority reason from the test plan |
| Technique and level | e.g. BVA, API/integration |
| Precondition | System state before the test (seeded data, logged-in role) |
| Input | Exact test data and why it was chosen |
| Expected result | Defined before execution |
| Actual result | |
| Status | Pass / Fail / Blocked |
| Evidence | CI run link, test file path |
| Traceability | FR/NFR, issue, PR |
| Interpretation and limitation | What this result shows and what it does not show |
| Defect link | If failed |