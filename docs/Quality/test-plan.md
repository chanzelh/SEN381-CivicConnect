# CivicConnect Test Plan
# Milestone Three

| Version | Date | Change |
|---|---|---|
| One - Milestone Three | 2026/10/12 | Initial risk-based test plan |

## 1. Purpose 
This plan will determine what is being tested for CivicConnect, how and why, before all the tests are written. Testing effort will be prioritised by the risk such as requirements with a Must priority receive stronger testing than the lower-risk items. Lower-risk items are covered by end-to-end journets or determined as limitations instead of testing separately.

## 2. Approach
| Item | Decision |
|---|---|
| Tools | Jest  (coverage and units), Supertest (API), Playwright (E2E), k6 or autocannon (performance) |
| Test Levels | Performance, Unit, API/Integration, end-to-end (E2E) |
| Black-boc techniques | Boundary value analysis (BVA), state transition, equivalence partitioning (EP) |
| Test Database | PostgreSQL service container in CI, seperate local test database |
| Naming | Test files will start with the requirement ID to prevent confusion: tests/unit/FR-010.transitions.test.js |
| Evidence | Every test will be recorded in the test-evidence.md with a link to the CI run |
| AI-generated tests | In the case of missing cases or wrongful assumptions before a merge. Recorded in the AI usage register |

## 3. Risk-Based Priority
Priority is determined by the requirement priority based off of the Risk Register. 

| Area | Requirements | Risks | Test Priority | Technique | Level | Planned Tests |
|---|---|---|---|---|---|---|
| Authentication and Role access | FR-006, NFR-001, NFR-002 | Risk-002 | High | Negative Testing (401 or 403) | Unit, API | TC-U03, TC-I01, TC-I02 |
| Request submission and validation | FR-001, FR-002, NFR-011 | None | High | EP, BVA | Unit, API | TC-U04, TC-B01 up until TC-B03 |
| Status Workflow | FR-010, FR-012 | None | High | Stat transition | Unit, API | TC-U01, TC-B05, TC-B06 |
| Status change and the history saved together | NFR-009 | RISK-008 | High | Fault injection (rollback) | API/Integration | TC-I05 |
| Assignment Recorded | FR-009, NFR-009 | None | High | Positive + DB Check | API/Integration | TC-I04 |
| Request stored and retrievable | NFR-007 | None | High | Positive and DB Check | API/Integration | TC-I03 |
| No internal details in errors | NFR-003 | None | High | Negative Testing | API/Integration | TC-I01, TC-I02 |
| Feedback when notification fails | FR-005 | RISK-010 | Medium | Fault injection | Unit | TC-U05 |
| Overdue rule and report counts | FR-014 | RISK-011 | Medium | BVA, seeded data | Unit, API | TC-U02, TC-I08 |
| Response time under load | NFR-005, NFR-013 | RISK-011 | Medium | Load test (50 users) | Performance | TC-P01 |

## 4. Planned Tests
| Test ID | Title | Basis |
|---|---|---|
| TC-U01 | Transition rule will allow only valid  status changes | FR-010 |
| TC-U03 | Overdue calculation before, at and after the 3 day threshold | FR-014, RISK-011 |
| TC-U03 | Permission check returns the correct result per role | NFR-002, RISK-002 |
| TC-U04 | Request reference is uniqe | FR-001 |
| TC-U05 | Notification failure doesn't undo the status update | FR-005, RISK-010 |
| TC-B01 | Valid submission accepted | FR-001, FR-002 |
| TC-B02 | Unknown or missing category rejected | FR-002, NFR-011 |
| TC-B03 | Valid workflow path from the submission to closure | FR-010 |
| TC-B06 | Invalid transitions get blocked, which includes closing an unresolved request | FR-010, FR-012 |
| TC-I01| Protected route without a token returns 401 and the body contains no internal details | NFR-001, NFR-003 |
| TC-I02 | Requester that  is calling a staff route will return 403 and the body contains no internal details | NFR-002, NFR-003, RISK-002 |
| TC-I03 | Submitted request is stored with all the fields that are required and retrievable | NFR-007 |
| TC-I04 | Assignment will write a history entry with user, the action as well as a timestamp | FR-009, NFR-009 |
| TC-I05 | Status change will roll back if the history write fails | NFR-009, RISK-008 |
| TC-I07 | A second stale update is rejected | FR-009, RISK-009 |
| TC-I08 | Dashboard counts by status, overdue and category match seededdata | FR-013, FR-014, FR-015, RISK-011 |
| TC-E01 | Requester submits a request and sees its status and history | FR-001, FR-003, FR-004 |
| TC=E02 | Staff finds a request whilst using the search/filter, views, assigns, comments on and resolves it, requester then receives the update their side | FR-005, FR-007, FR-008, FR-009, FR-011, FR-012 |
| TC-P01 | 50 concurrent users and 95& succeeds under or equal to 2  seconds on one normal operation | NFR-005, NFR-013 |

## 5. Covered by the End-to-End Journeys only
The FR-003, FR-004, FR-007, FR-008 and FR-011 are classified as the lower-risk desplay, recording and search features. They are verified by TC-E01 and TC-E02 (as mentioned above) rather than seperate specified tests. FR-013 and FR-015 are also verified at the API level through TC-I08, which aligns with cost constraint since this is cheaper and more precise as well than a third browser journey.

## 6. Limitations
NFR-012 is covered only if the TC-E01 and TC-E02 tests are run on Chrome, Edge and Firefox. Otherwise it is recorded as a limitation.

## 7. Evidence without tests
| Requirement or Risk | Evidence |
|---|---|
| NFR-004 | Secret scanning in the CI and history scan count as evidence |
| NFR-010 | CI required check, blocked-merge PR and branch protection is in place |
| NFR-006 | Usability sessions with representative users ( >= 80% unassisted completion) |
| NFR-008 | External uptime monitoring over a defined window (>=99%) |
| NFR-014 |  Backup restory drill on staging |
| RISK-012 | ESLint rule restricting the corss-module imports |
| RISK-001, RISK-003 till RISK-007 | Process risks evidenced throughout the PR reviews, registers and RTM |

## 8. Test Baseline Check
| Category | Tests associated |
|---|---|
| Unit/component | TC-U01 till TC-U05 |
| Black-box functional | TC-B01 till TC-B03, TC-B05, TC-B06 |
| API/Integration| TC-I01 till TC-I05, TC-I08 |
| E2E/system | TC-E01, TC-E02 |
| Negative/unauthorised | TC-B02, B03, B06, I01, I02, I05, U05 |
| Performance test | TC-P01 |