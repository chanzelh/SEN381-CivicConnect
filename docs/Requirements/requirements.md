
# CivicConnect Requirements
## Version Three — Milestone Three

**Team:** Group L

## Version History

| Version | Date | Change |
|---|---|---|
| One — Milestone One | 2026/09/08 | Initial functional and non-functional requirements. |
| Two — Milestone Two | 2026/09/29 | Requirements retained from Milestone One without changes. |
| Three — Milestone Three | 2026/10/15 | Added implementation traceability, test cases, evidence, defects and verification statuses for the existing requirements. Included TC-P01 performance results and reviewed verification gaps against the test evidence and technical debt register. |

**See also:** PED Section 5, `docs/Quality/test-plan.md`, `docs/Quality/test-evidence.md`, `docs/Quality/defect-register.md` and `docs/Quality/technical-debt-register.md`.

## Functional Requirements

### 5.1 Functional Requirements

The original functional requirements, priorities and acceptance criteria have been retained. The additional columns show the implementation, tests, evidence, related defects or technical debt, and current verification status.

| ID | Requirement | Source/Stakeholder | Priority | Acceptance Criteria | Implementation | Test Case(s) | Evidence | Defect / Debt | Verification Status |
|:---:|:---|:---|:---:|:---|:---|:---|:---|:---|:---|
| FR-001 | The system shall allow a requester to submit a new service request. | Business Brief | Must | A requester can enter the required information and successfully submit a service request. The submitted request is stored and assigned a unique reference. | `POST /api/requests`, `createMyRequest`, `createRequest` | TC-B01, TC-I03, TC-E01 | [API](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38540019698), [Integration](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092), [E2E](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | None | Verified — submission, storage, retrieval and unique request references are covered by recorded tests. |
| FR-002 | The system shall allow a requester to categorize a service request using a controlled category mechanism. | Business Brief | Must | The requester can select a category from the available predefined categories, and the selected category is saved with the request. | Six-category allow-list in `createMyRequest` | TC-B01, TC-B02, TC-E01 | [API](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38540019698), [E2E](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | None | Verified — valid categories are stored and invalid categories are rejected. |
| FR-003 | The system shall allow requesters to view the current status of their submitted requests. | Business Brief | Must | A requester can view their submitted request and see its current status. | Requester dashboard and request details page | TC-E01 | [E2E](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | None | Verified — requester status viewing is covered by the E2E journey. |
| FR-004 | The system shall allow requesters to view previously submitted requests. | Business Brief | Should | A requester can access a history of their previous requests and view the relevant request details. | `RequesterDashboard.jsx`, requester request-list API | TC-E01 | [E2E](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | None | Verified — the E2E journey covers previously submitted requests and their details. This refers to the request list, not the internal status audit trail. |
| FR-005 | The system shall provide meaningful feedback when a request is accepted, rejected, updated or completed. | Business Brief | Must | When a request changes to an accepted, rejected, updated or completed state, the requester receives or can view appropriate feedback. | `sendNotificationSafely`, notification functionality | TC-U05, TC-E02 | [Unit](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823), [E2E](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | TD-005, TD-006 | Partially Verified — status updates and notification handling are tested, but the system has no Rejected status and failed notifications are not retried. |
| FR-006 | The system shall allow authorized staff to view relevant service requests. | Business Brief | Must | Authorized staff can access requests relevant to their responsibilities, while unauthorized users cannot access them. | `requireRole`, assigned-request queries | TC-I02, TC-B06, TC-E02 | [Integration](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092), [E2E](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | DEF-007 Fixed | Verified — staff access and role restrictions are supported by recorded tests. |
| FR-007 | The system shall allow authorized staff to search, filter and sort service requests. | Business Brief | Should | Staff can search for requests and apply available filters and sorting options to locate relevant requests. | Staff dashboard search and filtering functionality | TC-E02 | [E2E](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | None recorded | Partially Verified — search and filtering are covered by TC-E02, but sorting behaviour is not clearly established by the recorded evidence. |
| FR-008 | The system shall allow authorized staff to view complete request details. | Business Brief | Must | Authorized staff can open a request and view all relevant submitted information, status, category and request history. | `StaffRequestDetails.jsx`, assigned-request details API | TC-E02 | [E2E](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | None recorded | Partially Verified — staff can view request details and comments, but status history is not displayed in the staff interface. |
| FR-009 | The system shall allow authorized staff to accept or assign responsibility for a request. | Business Brief | Must | Authorized staff can accept or assign a request to an appropriate staff member, and the assignment is recorded. | `assignRequest`, `assignRequestToStaff`, database transaction | TC-I04, TC-E02, TC-U04 (due-date validation only) | [Unit](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823), [Integration](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092), [E2E](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | DEF-004 Fixed | Verified — assignment and its history record are tested by TC-I04. TC-U04 separately checks assignment due-date validation. |
| FR-010 | The system shall allow authorized staff to update request status through controlled transitions. | Business Brief | Must | Staff can only change a request to valid statuses defined by the system's workflow. Invalid status transitions are prevented. | `server/src/utils/statusRules.js`, `updateRequestStatus` | TC-U01, TC-B05, TC-B06 | [Unit](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823), [API](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38548799316) | DEF-003 Fixed | Verified — valid and invalid status transitions are covered by unit and API tests. |
| FR-011 | The system shall allow authorized staff to record relevant actions, comments and resolution information. | Business Brief | Must | Authorized staff can add actions, comments and resolution information to a request, and the information is saved against the request. | Comment endpoints, staff request details page, request status and history records | TC-E02, TC-I04, TC-B05 | [E2E](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850), [Integration](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092), [API](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38548799316) | TD-007 | Partially Verified — comments and status-related actions are exercised, but dedicated API comment tests and complete resolution-information coverage are not established. |
| FR-012 | The system shall allow authorized staff to resolve or close requests where authorized. | Business Brief | Must | Authorized staff can resolve or close a request when the required conditions are met, and the final status is recorded. | `statusRules.js`, controlled Resolved to Closed transition | TC-U01, TC-B05, TC-B06, TC-E02 | [Unit](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823), [API](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38548799316), [E2E](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | DEF-003 Fixed | Verified — authorised resolution and closure are covered by workflow tests. |
| FR-013 | The system shall provide management with useful service activity information. | Business Brief | Should | Management can access a dashboard or report containing relevant service request activity information. | `GET /api/requests`, `ManagementDashboard.jsx` | TC-I08 | [Integration](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092) | None | Partially Verified — dashboard data is tested at API level, but the displayed dashboard information has not been fully asserted in a browser test. |
| FR-014 | The system shall allow management to identify open, overdue, resolved and closed requests. | Business Brief | Must | Management can distinguish requests according to their current status and identify requests that are overdue based on the defined criteria. | `client/src/utils/overdue.js`, management dashboard | TC-U02, TC-I08 | [Unit](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823), [Integration](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092) | DEF-005 Fixed | Partially Verified — overdue calculations and API data are tested, but management's on-screen counts have not been fully asserted. |
| FR-015 | The system shall provide request information by category, status or other justified dimensions. | Business Brief | Should | Management can view or filter service request information by category, status and any additional approved reporting dimensions. | `ManagementDashboard.jsx`, management request-list API | TC-I08 | [Integration](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092) | None | Partially Verified — category and status information is supported by API testing, but management's on-screen filtering/reporting behaviour is not fully verified. |

## Non-Functional Requirements

### 5.2 Non-Functional Requirements

The original non-functional requirements, priorities and measurable targets remain unchanged. The added columns record how each requirement has been tested or assessed.

| ID | Requirement | Category | Measurable Target | Priority | Test Case(s) / Verification Method | Evidence | Defect / Debt | Verification Status |
|:---:|:---|:---|:---|:---:|:---|:---|:---|:---|
| NFR-001 | The system shall require users to authenticate before accessing protected functionality. | Security | 100% of protected pages/functions shall require successful authentication. Unauthenticated users attempting to access protected functionality shall be denied access. | Must | TC-I01 | [Integration](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092) | DEF-007 Fixed | Verified for tested protected routes — unauthenticated requests are rejected. |
| NFR-002 | Users shall only access functionality and information appropriate to their role. | Security | 100% of tested role-based access scenarios shall prevent unauthorized access. Requesters shall not be able to access staff or management functionality. | Must | TC-U03, TC-I02 | [Unit](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823), [Integration](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092) | TD-007 | Verified for tested role scenarios — cross-user requester access remains an identified test gap. |
| NFR-003 | Sensitive information shall be protected from unauthorized disclosure. | Security | Sensitive data shall not be exposed in URLs, client-side logs or application error messages. All production communication shall use HTTPS. | Must | TC-I01, TC-I02, security review | [Integration](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092) | DEF-008 Fixed | Partially Verified — error responses are tested, but production HTTPS and the remaining disclosure conditions are not fully established by these tests. |
| NFR-004 | Credentials and secrets shall not be stored in source control. | Security | 0 passwords, API keys, credential-containing connection strings or other secrets shall be committed to the GitHub repository. | Must | Gitleaks scanning, GitHub secret scanning and push protection | `docs/Quality/security-scanning.md` | None recorded | Verified according to the recorded secret-scanning evidence; ongoing checks remain necessary for new commits. |
| NFR-005 | The system shall respond promptly to normal user actions. | Performance | At least 95% of normal user requests shall receive a response within 2 seconds under the defined test load. | Must | TC-P01 | [Performance results](https://github.com/chanzelh/SEN381-CivicConnect/blob/main/CivicConnectCode/performance/tc-p01-result.txt), [PR #120](https://github.com/chanzelh/SEN381-CivicConnect/pull/120) | None | Verified for the tested workload — p95 was 52.92 ms, below 2,000 ms, with 0.00% failed dashboard requests. |
| NFR-006 | Users shall be able to complete common tasks without unnecessary complexity. | Usability | At least 80% of representative test users shall successfully complete key tasks such as submitting and checking a request without assistance. | Should | Usability testing — Issue #88 | Pending | None | Pending — representative usability test results are required. |
| NFR-007 | The system shall correctly maintain service request information. | Reliability | During functional testing, 100% of successfully submitted requests shall be stored with all required fields and remain retrievable after the transaction is completed. | Must | TC-I03 | [Integration](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092) | None | Verified for tested submissions — required fields are stored and records remain retrievable. |
| NFR-008 | The deployed system shall be accessible during its intended operating period. | Availability | The system shall achieve at least 99% availability during the defined testing/deployment period, excluding planned maintenance. | Should | Availability monitoring — Issue #89 | Pending | None | Pending — uptime monitoring evidence is required. |
| NFR-009 | Important request changes shall be traceable. | Auditability | 100% of tested status changes, assignments and resolution actions shall record the user, action and timestamp. | Must | TC-B05, TC-I04, TC-I05 | [API](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38548799316), [Integration](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38560811092) | DEF-004 Fixed | Verified for tested changes — assignment and status history are recorded and transaction rollback is tested. |
| NFR-010 | The system shall be structured so that changes can be made without unnecessarily affecting unrelated functionality. | Maintainability | 100% of merged changes shall pass the project's automated tests/checks before being merged into `main`, and implemented features shall follow the agreed architecture and coding standards. | Should | GitHub Actions CI, branch protection, linting and static analysis | `docs/Quality/ci-pipeline.md`, `docs/Quality/static-analysis.md` | DEF-001, DEF-002 Fixed | Verified according to the recorded CI and quality-gate evidence, subject to continued enforcement for future merges. |
| NFR-011 | The system shall prevent invalid or incomplete data from being stored. | Data Integrity | 100% of tested mandatory-field and validation rules shall reject invalid input and provide an appropriate error message. | Must | TC-U04, TC-B02, TC-B03 | [Unit](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38533058823), [API](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38540019698) | DEF-006 Deferred | Partially Verified — tested validation rules pass, but optional date-field validation remains a known gap. |
| NFR-012 | The system shall work on commonly used modern browsers. | Compatibility | All core functionality shall successfully operate on the latest versions of Chrome, Edge and Firefox during compatibility testing. | Should | TC-E01, TC-E02 in Chromium, Firefox and Edge | [E2E](https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850) | None | Verified for tested core journeys — Chromium and Firefox ran in CI, with Edge also tested locally. |
| NFR-013 | The system should support the expected level of concurrent use without unacceptable degradation. | Scalability | The system shall support at least 50 concurrent users while maintaining the 2-second response target for 95% of normal requests. | Could | TC-P01 | [Performance results](https://github.com/chanzelh/SEN381-CivicConnect/blob/main/CivicConnectCode/performance/tc-p01-result.txt), [PR #120](https://github.com/chanzelh/SEN381-CivicConnect/pull/120) | None | Verified for the tested workload — 50 concurrent virtual users for one minute, p95 52.92 ms and 0.00% failed dashboard requests. |
| NFR-014 | The system shall allow service data to be recovered following a failure. | Recoverability | A database backup shall be created according to the agreed backup schedule, and a test restoration shall successfully recover 100% of the selected test backup data. | Should | Backup and restore drill — Issue #83 | Pending | None | Pending — successful backup restoration evidence is required. |

## 5.3 Verification Notes

### Verification Statuses

The following statuses are used in this document:

- **Verified:** Recorded test evidence supports the requirement within the stated test scope.
- **Partially Verified:** Some functionality is supported by evidence, but part of the acceptance criteria remains untested or incomplete.
- **Pending:** The required verification activity has not been completed or its results have not yet been recorded.

A passing test confirms the behaviour covered by that test. It does not automatically prove every possible use of a feature.

### Known Verification Gaps

The following functional requirements require further verification or implementation work:

| Requirement | Remaining Gap |
|---|---|
| FR-005 | No Rejected status and no retry mechanism for failed notifications. |
| FR-007 | Sorting behaviour is not clearly proven by the recorded E2E evidence. |
| FR-008 | Staff-facing request status history is not displayed. |
| FR-011 | Dedicated comment API tests and complete resolution-information verification are outstanding. |
| FR-013 | Management dashboard information has been tested at API level, but not fully asserted in the UI. |
| FR-014 | Overdue calculations are tested, but the displayed dashboard counts are not fully asserted. |
| FR-015 | Category and status data are tested, but management's displayed filtering/reporting behaviour is not fully asserted. |

The following non-functional requirements also have outstanding work:

| Requirement | Remaining Gap |
|---|---|
| NFR-003 | Production HTTPS and complete sensitive-data disclosure checks. |
| NFR-006 | Representative usability testing (Issue #88). |
| NFR-008 | Availability monitoring (Issue #89). |
| NFR-011 | Optional date-field validation (DEF-006). |
| NFR-014 | Backup and restore verification (Issue #83). |

### Performance Testing — TC-P01

TC-P01 was completed during Milestone Three under Issue #84 and merged through PR #120.

The test used k6 to simulate 50 concurrent users accessing the management dashboard's authenticated `GET /api/requests` endpoint for one minute.

It was performed locally using Node.js, Express.js and a separate PostgreSQL test database named `civicconnect_performance_test`.

| Metric | Result |
|---|---|
| Virtual users | 50 |
| Duration | 1 minute |
| Database records before testing | 400 |
| Additional seeded requests | 200 |
| Database records after setup | 600 |
| Successful dashboard requests | 2,950 |
| Dashboard requests per second | Approximately 48.16 |
| 95th percentile response time | 52.92 ms |
| Failed dashboard requests | 0.00% |
| Required response time | Below 2,000 ms |
| Required failure rate | Below 1% |
| Result | Pass |

**Evidence:**

- [TC-P01 k6 script](https://github.com/chanzelh/SEN381-CivicConnect/blob/main/CivicConnectCode/performance/tc-p01.k6.js)
- [TC-P01 test results](https://github.com/chanzelh/SEN381-CivicConnect/blob/main/CivicConnectCode/performance/tc-p01-result.txt)
- [Merged PR #120](https://github.com/chanzelh/SEN381-CivicConnect/pull/120)
- [PR #120 CI checks](https://github.com/chanzelh/SEN381-CivicConnect/pull/120/checks)

**Interpretation:**

The management dashboard met both performance thresholds during the local test. This supports NFR-005 and NFR-013 for the workload that was tested.

However, the test was limited to one API endpoint, 50 virtual users, one minute and a database containing approximately 600 service requests. The backend and load generator also ran on the same machine.

The results do not establish performance under production conditions or with substantially larger numbers of users and requests.

The green CI check on PR #120 provides supporting build-and-test evidence. The k6 performance test itself was run locally, not in GitHub Actions.

## Notes

All requirements established must be baselined at sign-off. Changes after baseline require a Change Request (refer to our Change Management standard once active from Milestone 3).

The original requirements and acceptance criteria have not been changed.

This Milestone Three update adds implementation traceability, testing evidence and verification statuses to the existing requirements document.

Verification statuses should be reviewed whenever new tests are completed, defects are resolved or additional evidence becomes available.
