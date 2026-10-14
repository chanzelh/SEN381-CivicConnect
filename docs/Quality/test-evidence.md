# CivicConnect Test Evidence
# Milestone Three

**See Also:** The test plan for the team (test-plan.md) and defect register (defect-register.md)

**Execution environment:** every Evidence link points to a run of `.github/workflows/ci.yml` (job `build-and-test`). See `ci-pipeline.md` for what a CI run does and does not prove.

Some tests were deliberately removed during test planning to keep the tests more focused; see test-plan.md section 4. Their IDs were not reused.

## Test Records

| Test ID | Title | Basis | Technique | Level | Status | Evidence |
|---|---|---|---|---|---|---|
| TC-U01 | Transition rule allows only valid status changes | FR-010 | White-box | Unit | Pass | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823/job/115749264354?pr=102 |
| TC-U02 | Overdue calculation around the threshold | FR-014, RISK-011 | BVA | Unit | Pass | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823/job/115749264354?pr=102 |
| TC-U03 | Permission check per role | NFR-002, RISK-002 | White-box | Unit | Pass | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823/job/115749264354?pr=102 |
| TC-U04 | Request reference is unique | FR-001 | White-box | Unit | Pass | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823/job/115749264354?pr=102 |
| TC-U05 | Notification failure does not undo the status update | FR-005, RISK-010 | Fault injection | Unit | Pass | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823/job/115749264354?pr=102 |
|---|---|---|---|---|---|---|
| TC-B01 | Valid submission accepted | FR-001, FR-002 | EP | API | PASS | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38540019698/job/115772175394?pr=103 |
| TC-B02 | Unknown or missing category rejected | FR-002, NFR-011 | EP | API | PASS | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38540019698/job/115772175394?pr=103 |
| TC-B03 | Field boundaries (missing, min, max, max+1) | NFR-011 | BVA | API | PASS | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38540019698/job/115772175394?pr=103 |
| TC-B05 | Valid workflow path Submitted → Closed | FR-010 | State transition | API | PASS | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38548799316/job/115801397809?pr=104 |
| TC-B06 | Invalid transitions blocked | FR-010, FR-012 | State transition | API | PASS | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38548799316/job/115801397809?pr=104 |
|---|---|---|---|---|---|---|
| TC-I01 | No token returns 401; no internal details | NFR-001, NFR-003 | Negative | API/integration | Pass | |
| TC-I02 | Requester on staff route returns 403; no internal details | NFR-002, NFR-003, RISK-002 | Negative | API/integration | Pass | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092 |
| TC-I03 | Submitted request stored and retrievable | NFR-007 | Positive + DB check | API/integration | Pass | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092 |
| TC-I04 | Assignment writes history entry | FR-009, NFR-009 | Positive + DB check | API/integration | Pass | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092 |
| TC-I05 | Status change rolls back if history write fails | NFR-009, RISK-008 | Fault injection | API/integration | Pass | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092 |
| TC-I08 | Dashboard counts match seeded data | FR-013, FR-014, FR-015, RISK-011 | Seeded data | API/integration | Pass | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092 |
|---|---|---|---|---|---|---|
| TC-E01 | Requester submits and sees status and history | FR-001, FR-003, FR-004 | Journey | E2E | Pass- Also run locally in Microsoft Edge (2/2 passed) during development; Chromium and Firefox were run in CI only (local disk space). | ADD IN |
| TC-E02 | Staff finds, assigns, comments, resolves; requester sees update | FR-005, FR-007, FR-008, FR-009, FR-011, FR-012 | Journey | E2E | Pass - Also run locally in Microsoft Edge (2/2 passed) during development; Chromium and Firefox were run in CI only (local disk space). | ADD IN |
| TC-P01 | 50 concurrent users, p95 ≤ 2 s | NFR-005, NFR-013 | Load | Performance | Not run | |
|---|---|---|---|---|---|---|
| TC-I07 | Stale update rejected (conditional) | FR-009, RISK-009 | Concurrent update | API/integration | Not run | |

## Individual Test Records
**1.  Unit Tests**
**TC-U01 : Transition rule will only allow valid status changes**
| Field | Detail |
|---|---|
| Requirements related | FR-010 ad FR-012 |
| Technique and level | Unit and state transition table |
| Input | All 6 allowed moves; 10 invalid moves, one per kind of mistake (Pending→Closed, Open→Closed, In Progress→Closed, Open→In Progress, Assigned→Resolved, Resolved→In Progress, Closed→In Progress, Closed→Open, Open→Assigned, In Progress→In Progress); unknown current and target status; canAssign for all 7 statuses |
| Expected result | 	Allowed moves → true; every invalid move and unknown status → false; canAssign true only for Open, Pending, Assigned. Derived from the decision-log status model, not from running the code. |
| Actual result | 25/25 checks passed |
| Status | Pass |
| Evidence | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823/job/115749264354?pr=102 & server/tests/unit/TC-U01.status-transitions.test.js |
| Defect Link | DEF-003 |

**TC-U02 : Overdue rule**
| Field | Detail |
|---|---|
| Requirements related | FR-014 |
| Technique and level | Boundary value analysis around 'today' and unit |
| Input | 	Due 13, 14, 15, 16 Oct for an open request; past due with Resolved/Closed; past due with Open, Pending, Assigned, In Progress, On Hold; due date undefined, "", null, "soon" |
| Expected result | 13 and 14 Oct → overdue; 15 Oct (today) and 16 Oct → not overdue; Resolved/Closed never overdue; all unfinished statuses past due → overdue; missing/invalid dates → not overdue |
| Actual Result | 15/15 checks passed |
| Status | Pass |
| Evidence | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823/job/115749264354?pr=102 & client/tests/unit/TC-U02.overdue.test.js |
| Defect Link | DEF-005, which was found during design |

**TC-U03 : Permission check per role**
| Field | Detail |
|---|---|
| Requirements related | NFR-002 and RISK-002 |
| Technique and level | Unit; negative and positive testing |
| Input | Staff → Closed, Pending, Assigned; staff → In Progress, On Hold, Resolved; management → Pending, Closed; management → "Done" |
| Expected result | 	Staff → management-only status: 403, message "You are not permitted to select this status.", save function not called. Allowed combinations: no 403, save called with (1, status, 7, isManagement). Unknown status: 403, not saved. |
| Actual Result | 9/9 checks passed |
| Status | Pass |
| Evidence | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823/job/115749264354?pr=102 & server/tests/unit/TC-U03.role-permissions.test.js |
| Defect Link | None |

**TC-U04 : Assignment due-date validation**
| Field | Detail |
|---|---|
| Requirements related | FR-009 and NFR-011 |
| Technique and level | Unit and boundary value analysis on the calendar dates |
| Input | 	Missing; 2026/10/20; 2026-10-1; 2026-13-01; 2026-00-10; 2026-02-30; 2027-02-29; 2028-02-29; 2026-12-31; 2027-01-01 |
| Expected result | Missing/wrong format → 400 "Please select a valid due date."; month 00/13, 30 Feb, 29 Feb 2027 → 400 "The selected due date is invalid."; 29 Feb 2028, 31 Dec, 1 Jan → not rejected |
| Actual Result | 10/10 checks passed |
| Status | Pass |
| Evidence | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823/job/115749264354?pr=102  & server/tests/unit/TC-U04.due-date-validation.test.js |
| Defect Link | None |

**TC-U05 : Notification failure will not undo the status update**
| Field | Detail |
|---|---|
| Requirements related | FR-005 and the API contract 3.10.3 |
| Technique and level | Unit and fault injection |
| Input | 	Staff sets a request to Resolved; status save succeeds; notification info found; createNotification throws "notification store unavailable" |
| Expected result | 	Notification attempted once; no 500; response "Request status updated successfully." with the saved request; save called exactly once; failure logged via console.error |
| Actual Result | 1/1 check passed |
| Status | Pass |
| Evidence | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823/job/115749264354?pr=102  & server/tests/unit/TC-U05.notification-failure.test.js |
| Defect Link | None |

**2. Black Box Testing**
**TC-B01 : Valid submission accepted**
| Field | Detail |
|---|---|
| Requirements related | FR-001 and FR-002 |
| Technique and level | API black box with real test DB and equivalence partitioning |
| Input | 	Title "Broken hall light", a description, and each of the 6 predefined categories |
| Expected result | 	201, message "Service request submitted successfully.", numeric ID; DB row has the same title, description, category, status "Open" and the requester's user ID |
| Actual Result | 6/6 checks passed |
| Status | Pass |
| Evidence | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38540019698/job/115772175394?pr=103 & server/tests/api/TC-B01.valid-submission.test.js |
| Defect Link | None |

**TC-B02 : Unknown or missing category was rejected**
| Field | Detail |
|---|---|
| Requirements related | FR-002 and NFR-011 |
| Technique and level | API black box and equivalence partitioning |
| Input | 	Category absent, "", "   ", 5, "Plumbing", "maintenance", "IT-Support" (title and description valid) |
| Expected result | 400 with the exact message per partition (see design table); 0 rows stored |
| Actual Result | 7/7 checks passed |
| Status | Pass |
| Evidence | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38540019698/job/115772175394?pr=103  & server/tests/api/TC-B02.invalid-category.test.js|
| Defect Link | None |

**TC-B03 : Field boundaries**
| Field | Detail |
|---|---|
| Requirements related | NFR-011 |
| Technique and level | API black box and boundary value anlaysis |
| Input | 	Title length 0, 1, 150, 151, and 150 + spaces; description length 0, 1, 5000, 5001 |
| Expected result | 	0 and max+1 → 400 with exact message, 0 rows stored; 1 and max → 201 and the stored value equals the input (trimmed) |
| Actual Result | 9/9 checks passed |
| Status | Pass |
| Evidence | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38540019698/job/115772175394?pr=103  & server/tests/api/TC-B03.field-boundaries.test.js |
| Defect Link | None |

**TC-B05 : Valid workflow path**
| Field | Detail |
|---|---|
| Requirements related | FR-010 |
| Technique and level | API black box and state transition testing |
| Input | 	Path 1: submit → assign → In Progress → Resolved → Closed. Path 2: submit → Pending → assign → In Progress → On Hold → In Progress → Resolved → Closed. Each step by the correct role. |
| Expected result | 	Every step returns 200 and the new status; DB status matches after each step; history records each move in order with the correct user (management for assign/Pending/Closed, staff for the rest) |
| Actual Result | 2/2 checks passed |
| Status | Pass |
| Evidence | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38540019698/job/115772175394?pr=103  & server/tests/api/TC-B05.valid-workflow-path.test.js |
| Defect Link | DEF-003 and DEF-004 |

**TC-B06 : Ivnalid transitions get blocked**
| Field | Detail |
|---|---|
| Requirements related | FR-010 and FR-012 |
| Technique and level | State trnasition testing, API black box and negative testing |
| Input | 	8 forbidden moves (Open→Closed, Pending→Closed, In Progress→Closed, Open→In Progress, Assigned→Resolved, Resolved→In Progress, Closed→In Progress, Closed→Pending); assignment while In Progress, On Hold, Resolved, Closed; staff → Closed; requester → any status change |
| Expected result | 	Forbidden move → 409 "Cannot change status from X to Y."; late assignment → 409 "This request cannot be assigned while it is X."; staff → Closed → 403 "You are not permitted to select this status."; requester → 403 "You do not have permission to access this resource."; in every case the status is unchanged and no history row is written |
| Actual Result | 14/14 checks passed |
| Status | Pass |
| Evidence | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38540019698/job/115772175394?pr=103 & server/tests/api/TC-B06.invalid-transitions.test.js |
| Defect Link | DEF-003 |

**3. API/Integration Testing**
**TC-I01: No valid token will return 401**
| Field | Detail |
|---|---|
| Requirements related | NFR-001 and NFR-003 |
| Technique and level | API/integration and negative testing |
| Input | 	No Authorization header on all 7 protected routes (GET /, /mine, /assigned, /staff; POST /; PUT /:id/assign; PATCH /:id/status). Invalid tokens on GET /mine: header without "Bearer ", random text, token signed with the wrong secret claiming management, expired token, valid signature without a role. An anonymous submission. |
| Expected result | 401 every time with the exact message ("Authentication required. Please log in." / "Invalid or expired token. Please log in again." / "Invalid authentication token."); body contains only message and no internal details; anonymous submission stores 0 rows |
| Actual Result | 13/13 checks passed |
| Status | Pass |
| Evidence | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092 & server/tests/api/TC-I01.NFR-001.no-token.test.js |
| Defect Link | None |

**TC-I02: Wrong role will return 403**
| Field | Detail |
|---|---|
| Requirements related | NFR-002, NFR-003 and RISK-002 |
| Technique and level | API/integration and negative testing |
| Input | Requester → GET all requests, GET staff list, GET assigned work, PUT assign, PATCH status; staff → GET all requests, POST a request; management → GET /mine |
| Expected result | 	403 "You do not have permission to access this resource." in every case; no internal details; for change attempts the status is unchanged and no history row is written |
| Actual Result | 8/8 checks passed |
| Status | Pass |
| Evidence | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092 & server/tests/api/TC-I02.NFR-002.wrong-role.test.js |
| Defect Link | None |

**TC-I03 : stored and retrievable as well as unique IDs**
| Field | Detail |
|---|---|
| Requirements related | NFR-007, FR-001 and DEF-005 |
| Technique and level | API/Integration and positive testing with db checks |
| Input | 	A submission with required fields plus device type, location, urgency, impact; a second submission; an assignment with due date 2026-12-31 |
| Expected result | 	Every field stored in the DB exactly as sent, status Open, owned by the requester; GET /mine/:id and GET /mine return it; the two IDs differ; the management list returns dueDate exactly "2026-12-31" |
| Actual Result | 4/4 checks passed |
| Status | Pass |
| Evidence | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092 & server/tests/api/TC-I03.NFR-007.stored-retrievable.test.js |
| Defect Link | DEF-005 |

**TC-I04 : assignment writes history**
| Field | Detail |
|---|---|
| Requirements related | FR-009, NFR-009 |
| Technique and level | API/integration and positive testing with db checks |
| Input | 	Management assigns the seed staff member with due date 2026-12-31; then reassigns twice |
| Expected result | 	Request shows the staff member and status Assigned; exactly one history row with changed_by = manager, Open → Assigned, note "Assigned to staff X, due 2026-12-31", changed_at within the test window; reassigning adds a second row and keeps the first |
| Actual Result | 2/2 checks passed |
| Status | Pass |
| Evidence | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092 & server/tests/api/TC-I04.NFR-009.assignment-history.test.js |
| Defect Link | DEF-004 |

**TC-I05 : Rollback when the history write fails**
| Field | Detail |
|---|---|
| Requirements related | NFR-009, RISK-008 |
| Technique and level | Fault injection, API/integration with a real postgresql transaction |
| Input | 	Staff sets In Progress; management assigns staff + due date; control: same status change with history writes allowed |
| Expected result | 	Blocked: 500 with a plain message and no internal details; status, staff and due date unchanged; no history row. Control: 200, status In Progress, one history row |
| Actual Result | 3/3 checks passed |
| Status | Pass |
| Evidence | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092 & server/tests/api/TC-I05.NFR-009.rollback.test.js |
| Defect Link | DEF-004 |

**TC-I08 : Dashboard data matches the seeded data**
| Field | Detail |
|---|---|
| Requirements related | FR-013, FR-014, FR-015 and RISK-011 |
| Technique and level | API/integration and seeded known data |
| Input | 	Management calls GET /api/requests |
| Expected result | 	All 8 returned once with the correct status, category and due date; counts by status (Open 1, Pending 1, Assigned 1, In Progress 1, On Hold 1, Resolved 1, Closed 2); by category (Maintenance 3, IT Support 2, Security 2, Equipment 1); exactly 2 overdue (Assigned, On Hold) |
| Actual Result | 4/4 checks passed |
| Status | Pass |
| Evidence | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092 & server/tests/api/TC-I08.FR-014.dashboard-data.test.js |
| Defect Link | None |

**TC-E01 : Requester Journey**
| Field | Detail |
|---|---|
| Requirements related | 	FR-001 (Must), FR-002 (Must), FR-003 (Must), FR-004 (Should); NFR-012 |
| Technique and level | E2E in 3 browsers |
| Input | Requester logs in; New Request: unique title, category Maintenance, description, issue type Lighting, location |
| Expected result | 	Redirect to My Requests; the new request appears in the list with category Maintenance and status Open; opening it shows the title, description and status Open |
| Actual Result | 3/3 browsers passed |
| Status | Pass |
| Evidence | ADD IN & client/e2e/TC-E01.FR-001.requester-journey.e2e.js |
| Defect Link | None |

**TC-E02 : Staff & Management Journey**
| Field | Detail |
|---|---|
| Requirements related | 	FR-005, FR-007, FR-008, FR-009, FR-011, FR-012 (Must/Should); NFR-012 |
| Technique and level | E2E in 3 browsers |
| Input | Management: search the title, filter category, assign Test Staff with due date 2026-12-31. Staff: search + filter Assigned, open the request, add a comment, set In Progress then Resolved. Management: set Closed. Requester: open the list, notifications and the request |
| Expected result | Assign confirmation, Current Status Assigned, staff name shown; staff see the request details including the requester; comment saved and shown; status updates confirmed; management close confirmed; requester sees status Closed, the notification Your request "<title>" now has the status "Closed". and the staff comment |
| Actual Result | 3/3 passed browsers |
| Status | Pass |
| Evidence | ADD IN & client/e2e/TC-E02.FR-009.staff-journey.e2e.js |
| Defect Link | None |