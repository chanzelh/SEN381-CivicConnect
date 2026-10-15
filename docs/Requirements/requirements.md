
# CivicConnect Requirements
## Version Three — Milestone Three

**Team:** Group L

## Version History

| Version | Date | Change |
|---|---|---|
| One — Milestone One | 2026/09/08 | Initial functional and non-functional requirements. |
| Two — Milestone Two | 2026/09/29 | Requirements retained from Milestone One without changes. |
| Three — Milestone Three | 2026/10/15 | Added implementation traceability, test cases, evidence, defects and verification statuses for the existing requirements. Updated NFR-005 and NFR-013 using TC-P01 performance test results. |

**See also:** PED Section 5, `docs/Quality/test-plan.md`, `docs/Quality/test-evidence.md` and `docs/Quality/defect-register.md`.

## Functional Requirements

### 5.1 Functional Requirements

The functional requirements remain unchanged from the approved baseline. The additional columns show how each requirement was implemented and verified during Milestone Three.

| ID | Requirement | Source/Stakeholder | Priority | Acceptance Criteria | Implementation | Test Case(s) | Evidence | Defect | Verification Status |
|:---:|:---|:---|:---:|:---|:---|:---|:---|:---|:---|
| FR-001 | The system shall allow a requester to submit a new service request. | Business Brief | Must | A requester can enter the required information and successfully submit a service request. The submitted request is stored and assigned a unique reference. | `POST /api/requests` → `createMyRequest` → `createRequest` | TC-B01, TC-I03, TC-E01 | [API tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38540019698), [Integration tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092), [E2E tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | None | Verified |
| FR-002 | The system shall allow a requester to categorize a service request using a controlled category mechanism. | Business Brief | Must | The requester can select a category from the available predefined categories, and the selected category is saved with the request. | Six-category allow-list in `createMyRequest` | TC-B01, TC-B02, TC-E01 | [API tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38540019698), [E2E tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | None | Verified |
| FR-003 | The system shall allow requesters to view the current status of their submitted requests. | Business Brief | Must | A requester can view their submitted request and see its current status. | Requester dashboard and request details page | TC-E01 | [E2E tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | None | Verified |
| FR-004 | The system shall allow requesters to view previously submitted requests. | Business Brief | Should | A requester can access a history of their previous requests and view the relevant request details. | `RequesterDashboard.jsx`, `GET /mine` | TC-E01 | [E2E tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | None | Verified — interpreted as the requester's list of previously submitted requests. |
| FR-005 | The system shall provide meaningful feedback when a request is accepted, rejected, updated or completed. | Business Brief | Must | When a request changes to an accepted, rejected, updated or completed state, the requester receives or can view appropriate feedback. | `sendNotificationSafely`, notifications | TC-U05, TC-E02 | [Unit tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823), [E2E tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | TD-005 | Partially Verified — updates and feedback work, but rejection feedback cannot be tested because there is no Rejected status. Notification retry is also not implemented. |
| FR-006 | The system shall allow authorized staff to view relevant service requests. | Business Brief | Must | Authorized staff can access requests relevant to their responsibilities, while unauthorized users cannot access them. | `requireRole`; model queries scoped to assigned staff | TC-I02, TC-B06, TC-E02 | [API tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092), [E2E tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | DEF-007 Fixed | Verified |
| FR-007 | The system shall allow authorized staff to search, filter and sort service requests. | Business Brief | Should | Staff can search for requests and apply available filters and sorting options to locate relevant requests. | Staff and management dashboard search/filter functionality | TC-E02 | [E2E tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | None | Verified — search and filter paths were tested. |
| FR-008 | The system shall allow authorized staff to view complete request details. | Business Brief | Must | Authorized staff can open a request and view all relevant submitted information, status, category and request history. | `StaffRequestDetails.jsx`, `GET /assigned/:id` | TC-E02 | [E2E tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | None | Partially Verified — request details and comments are shown, but status history is not displayed to staff in the UI. |
| FR-009 | The system shall allow authorized staff to accept or assign responsibility for a request. | Business Brief | Must | Authorized staff can accept or assign a request to an appropriate staff member, and the assignment is recorded. | `assignRequest`, `assignRequestToStaff` using a database transaction | TC-U04, TC-I04, TC-E02 | [Unit tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823), [Integration tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092), [E2E tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | DEF-004 Fixed | Verified |
| FR-010 | The system shall allow authorized staff to update request status through controlled transitions. | Business Brief | Must | Staff can only change a request to valid statuses defined by the system's workflow. Invalid status transitions are prevented. | `server/src/utils/statusRules.js`, `updateRequestStatus` | TC-U01, TC-B05, TC-B06 | [Unit tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823), [API tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38548799316) | DEF-003 Fixed | Verified |
| FR-011 | The system shall allow authorized staff to record relevant actions, comments and resolution information. | Business Brief | Must | Authorized staff can add actions, comments and resolution information to a request, and the information is saved against the request. | Comment endpoints and staff request details page | TC-E02 | [E2E tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | TD-007 | Verified through E2E testing — dedicated API-level comment tests remain a gap. |
| FR-012 | The system shall allow authorized staff to resolve or close requests where authorized. | Business Brief | Must | Authorized staff can resolve or close a request when the required conditions are met, and the final status is recorded. | `statusRules.js`, controlled Resolved → Closed transition | TC-U01, TC-B06, TC-E02 | [Unit tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823), [API tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38548799316), [E2E tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | DEF-003 Fixed | Verified |
| FR-013 | The system shall provide management with useful service activity information. | Business Brief | Should | Management can access a dashboard or report containing relevant service request activity information. | `GET /api/requests`, `ManagementDashboard.jsx` | TC-I08 | [Integration tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092) | None | Partially Verified — API data is proven, but on-screen dashboard counts were not asserted. |
| FR-014 | The system shall allow management to identify open, overdue, resolved and closed requests. | Business Brief | Must | Management can distinguish requests according to their current status and identify requests that are overdue based on the defined criteria. | `client/src/utils/overdue.js` | TC-U02, TC-I08 | [Unit tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823), [Integration tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092) | DEF-005 Fixed | Partially Verified — overdue calculations and API data are tested, but on-screen counts were not asserted. |
| FR-015 | The system shall provide request information by category, status or other justified dimensions. | Business Brief | Should | Management can view or filter service request information by category, status and any additional approved reporting dimensions. | `ManagementDashboard.jsx` | TC-I08 | [Integration tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092) | None | Partially Verified — counts by status and category were proven at API level, but not asserted on-screen. |

## Non-Functional Requirements

### 5.2 Non-Functional Requirements

The non-functional requirements and their measurable targets remain unchanged. The additional columns show the tests performed, available evidence, related defects and current verification status.

| ID | Requirement | Category | Measurable Target | Priority | Test Case(s) / Verification Method | Evidence | Defect | Verification Status |
|:---:|:---|:---|:---|:---:|:---|:---|:---|:---|
| NFR-001 | The system shall require users to authenticate before accessing protected functionality. | Security | 100% of protected pages/functions shall require successful authentication. Unauthenticated users attempting to access protected functionality shall be denied access. | Must | TC-I01 | [Integration tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092) | DEF-007 Fixed | Verified |
| NFR-002 | Users shall only access functionality and information appropriate to their role. | Security | 100% of tested role-based access scenarios shall prevent unauthorized access. Requesters shall not be able to access staff or management functionality. | Must | TC-U03, TC-I02 | [Unit tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823), [Integration tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092) | None | Verified — all tested role-based access scenarios passed. |
| NFR-003 | Sensitive information shall be protected from unauthorized disclosure. | Security | Sensitive data shall not be exposed in URLs, client-side logs or application error messages. All production communication shall use HTTPS. | Must | TC-I01, TC-I02, TC-I05 | [Integration tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092) | DEF-008 Fixed | Partially Verified — error responses do not expose internal details, but HTTPS still needs to be checked on staging under Issue #80. |
| NFR-004 | Credentials and secrets shall not be stored in source control. | Security | 0 passwords, API keys, credential-containing connection strings or other secrets shall be committed to the GitHub repository. | Must | Gitleaks full-history scan, GitHub secret scanning and push protection | `docs/Quality/security-scanning.md` | None | Verified |
| NFR-005 | The system shall respond promptly to normal user actions. | Performance | At least 95% of normal user requests shall receive a response within 2 seconds under the defined test load. | Must | TC-P01 — k6 load test of management dashboard | [Performance results](https://github.com/chanzelh/SEN381-CivicConnect/blob/main/CivicConnectCode/performance/tc-p01-result.txt), [PR #120](https://github.com/chanzelh/SEN381-CivicConnect/pull/120), [CI checks](https://github.com/chanzelh/SEN381-CivicConnect/pull/120/checks) | None | Verified for the tested workload — 50 virtual users for 1 minute; p95 52.92 ms against the 2,000 ms limit, with 0.00% failed dashboard requests. |
| NFR-006 | Users shall be able to complete common tasks without unnecessary complexity. | Usability | At least 80% of representative test users shall successfully complete key tasks such as submitting and checking a request without assistance. | Should | Usability testing — Issue #88 | Pending | None | Pending Phase 3 usability testing. |
| NFR-007 | The system shall correctly maintain service request information. | Reliability | During functional testing, 100% of successfully submitted requests shall be stored with all required fields and remain retrievable after the transaction is completed. | Must | TC-I03 | [Integration tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092) | None | Verified |
| NFR-008 | The deployed system shall be accessible during its intended operating period. | Availability | The system shall achieve at least 99% availability during the defined testing/deployment period, excluding planned maintenance. | Should | Availability monitoring — Issue #89 | Pending | None | Pending Phase 3 availability monitoring. |
| NFR-009 | Important request changes shall be traceable. | Auditability | 100% of tested status changes, assignments and resolution actions shall record the user, action and timestamp. | Must | TC-B05, TC-I04, TC-I05 | [API tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38548799316), [Integration tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092) | DEF-004 Fixed | Verified |
| NFR-010 | The system shall be structured so that changes can be made without unnecessarily affecting unrelated functionality. | Maintainability | 100% of merged changes shall pass the project's automated tests/checks before being merged into `main`, and implemented features shall follow the agreed architecture and coding standards. | Should | GitHub Actions CI, branch rules, automated tests, lint checks and static analysis | `docs/Quality/ci-pipeline.md`, `docs/Quality/static-analysis.md` | DEF-001 and DEF-002 Fixed | Verified |
| NFR-011 | The system shall prevent invalid or incomplete data from being stored. | Data Integrity | 100% of tested mandatory-field and validation rules shall reject invalid input and provide an appropriate error message. | Must | TC-U04, TC-B02, TC-B03 | [Unit tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823), [API tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38540019698) | DEF-006 Deferred | Partially Verified — mandatory-field and tested validation rules pass, but optional date fields are not fully validated. |
| NFR-012 | The system shall work on commonly used modern browsers. | Compatibility | All core functionality shall successfully operate on the latest versions of Chrome, Edge and Firefox during compatibility testing. | Should | TC-E01, TC-E02 in Chromium, Firefox and Edge | [E2E tests](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | None | Verified |
| NFR-013 | The system should support the expected level of concurrent use without unacceptable degradation. | Scalability | The system shall support at least 50 concurrent users while maintaining the 2-second response target for 95% of normal requests. | Could | TC-P01 — 50 concurrent virtual users for 1 minute | [Performance results](https://github.com/chanzelh/SEN381-CivicConnect/blob/main/CivicConnectCode/performance/tc-p01-result.txt), [PR #120](https://github.com/chanzelh/SEN381-CivicConnect/pull/120), [CI checks](https://github.com/chanzelh/SEN381-CivicConnect/pull/120/checks) | None | Verified for the tested workload — 50 concurrent users, p95 52.92 ms, 0.00% failed dashboard requests. |
| NFR-014 | The system shall allow service data to be recovered following a failure. | Recoverability | A database backup shall be created according to the agreed backup schedule, and a test restoration shall successfully recover 100% of the selected test backup data. | Should | Backup and restore drill — Issue #83 | Pending | None | Pending Phase 3 backup and restore verification. |

## 5.3 Verification Notes

### Verification Statuses

- **Verified:** Available test evidence supports the stated requirement or the tested acceptance criteria.
- **Partially Verified:** Testing supports part of the requirement, but an identified gap remains.
- **Pending Phase 3:** The relevant test or verification activity has not yet been completed or its evidence has not yet been recorded.

### Performance Testing — TC-P01

TC-P01 was completed during Milestone Three under Issue #84 and merged through PR #120.

The test used k6 to simulate 50 concurrent users accessing the management dashboard's `GET /api/requests` endpoint for one minute.

The test was performed locally against a separate PostgreSQL test database.

| Metric | Result |
|---|---|
| Virtual users | 50 |
| Duration | 1 minute |
| Database records during test | 600 |
| Dashboard requests | 2,950 |
| Dashboard requests per second | Approximately 48.16 |
| 95th percentile response time | 52.92 ms |
| Failed dashboard requests | 0.00% |
| Required response time | Below 2,000 ms |
| Required failure rate | Below 1% |
| Result | Pass |

**Evidence:**
- [TC-P01 k6 test script](https://github.com/chanzelh/SEN381-CivicConnect/blob/main/CivicConnectCode/performance/tc-p01.k6.js)
- [TC-P01 saved results](https://github.com/chanzelh/SEN381-CivicConnect/blob/main/CivicConnectCode/performance/tc-p01-result.txt)
- [PR #120](https://github.com/chanzelh/SEN381-CivicConnect/pull/120)
- [PR #120 CI checks](https://github.com/chanzelh/SEN381-CivicConnect/pull/120/checks)

**Interpretation:**

The management dashboard met the response-time and failure-rate targets under the tested conditions.

However, this was a short local test using one API operation and a relatively small database. It does not prove performance with thousands of users, much larger datasets, or real production network conditions.

The load generator and server ran on the same machine, and the endpoint currently returns the full request list without pagination. These limitations should be considered when evaluating future scalability.

### Remaining Verification Work

Some requirements remain partially verified because the available tests do not cover every aspect of their acceptance criteria.

The outstanding gaps include:

- FR-005: Rejection feedback and notification retry.
- FR-008: Staff-facing request status history.
- FR-013, FR-014 and FR-015: Dashboard information proven at API level, but not fully asserted on-screen.
- NFR-003: HTTPS verification on staging.
- NFR-011: Validation of optional date fields.

Other requirements still depend on Phase 3 activities:

- NFR-006: Usability testing (Issue #88).
- NFR-008: Availability monitoring (Issue #89).
- NFR-014: Backup and restore testing (Issue #83).

## Notes

All requirements established must be baselined at sign-off. Changes after the baseline require a Change Request in accordance with the project's Change Management standard.

The original requirements and acceptance criteria have been retained. This Milestone Three update adds traceability and verification information without changing the requirements baseline.

Verification statuses reflect the evidence currently available and should be updated when additional tests or Phase 3 activities are completed.
