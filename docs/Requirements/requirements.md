# CivicConnect Requirements
# Milestone One

**Last updated:** 2026/09/08
**See also:** PED Section 5 

## Functional Requirements

### 5.1 Functional Requirements

| ID | Requirement | Source/Stakeholder | Priority | Acceptance Criteria |
|:---:|:---|:---|:---:|:---|
| FR-001 | The system shall allow a requester to submit a new service request. | Business Brief | Must | A requester can enter the required information and successfully submit a service request. The submitted request is stored and assigned a unique reference. |
| FR-002 | The system shall allow a requester to categorize a service request using a controlled category mechanism. | Business Brief | Must | The requester can select a category from the available predefined categories, and the selected category is saved with the request. |
| FR-003 | The system shall allow requesters to view the current status of their submitted requests. | Business Brief | Must | A requester can view their submitted request and see its current status. |
| FR-004 | The system shall allow requesters to view previously submitted requests. | Business Brief | Should | A requester can access a history of their previous requests and view the relevant request details. |
| FR-005 | The system shall provide meaningful feedback when a request is accepted, rejected, updated or completed. | Business Brief | Must | When a request changes to an accepted, rejected, updated or completed state, the requester receives or can view appropriate feedback. |
| FR-006 | The system shall allow authorized staff to view relevant service requests. | Business Brief | Must | Authorized staff can access requests relevant to their responsibilities, while unauthorized users cannot access them. |
| FR-007 | The system shall allow authorized staff to search, filter and sort service requests. | Business Brief | Should | Staff can search for requests and apply available filters and sorting options to locate relevant requests. |
| FR-008 | The system shall allow authorized staff to view complete request details. | Business Brief | Must | Authorized staff can open a request and view all relevant submitted information, status, category and request history. |
| FR-009 | The system shall allow authorized staff to accept or assign responsibility for a request. | Business Brief | Must | Authorized staff can accept or assign a request to an appropriate staff member, and the assignment is recorded. |
| FR-010 | The system shall allow authorized staff to update request status through controlled transitions. | Business Brief | Must | Staff can only change a request to valid statuses defined by the system's workflow. Invalid status transitions are prevented. |
| FR-011 |The system shall allow authorized staff to record relevant actions, comments and resolution information.|Business Brief|Must| Authorized staff can add actions, comments and resolution information to a request, and the information is saved against the request.|
| FR-012 |The system shall allow authorized staff to resolve or close requests where authorized.|Business Brief|Must|Authorized staff can resolve or close a request when the required conditions are met, and the final status is recorded.|
| FR-013 | The system shall provide management with useful service activity information.|Business Brief|Should|Management can access a dashboard or report containing relevant service request activity information.|
| FR-014 |The system shall allow management to identify open, overdue, resolved and closed requests.|Business Brief|Must|Management can distinguish requests according to their current status and identify requests that are overdue based on the defined criteria.|
| FR-015 |The system shall provide request information by category, status or other justified dimensions.|Business Brief|Should|Management can view or filter service request information by category, status and any additional approved reporting dimensions.|

## Non-Functional Requirements

### 5.2 Non-Functional Requirements

| ID | Requirement | Category | Measurable Target | Priority |
|:---:|:---|:---|:---|:---:|
| NFR-001 | The system shall require users to authenticate before accessing protected functionality. | Security | 100% of protected pages/functions shall require successful authentication. Unauthenticated users attempting to access protected functionality shall be denied access. | Must |
| NFR-002 | Users shall only access functionality and information appropriate to their role. | Security | 100% of tested role-based access scenarios shall prevent unauthorized access. Requesters shall not be able to access staff or management functionality. | Must |
| NFR-003 | Sensitive information shall be protected from unauthorized disclosure. | Security | Sensitive data shall not be exposed in URLs, client-side logs or application error messages. All production communication shall use HTTPS. | Must |
| NFR-004 | Credentials and secrets shall not be stored in source control. | Security | 0 passwords, API keys, credential-containing connection strings or other secrets shall be committed to the GitHub repository. | Must |
| NFR-005 | The system shall respond promptly to normal user actions. | Performance | At least 95% of normal user requests shall receive a response within 2 seconds under the defined test load. | Must |
| NFR-006 | Users shall be able to complete common tasks without unnecessary complexity. | Usability | At least 80% of representative test users shall successfully complete key tasks such as submitting and checking a request without assistance. | Should |
| NFR-007 | The system shall correctly maintain service request information. | Reliability | During functional testing, 100% of successfully submitted requests shall be stored with all required fields and remain retrievable after the transaction is completed. | Must |
| NFR-008 | The deployed system shall be accessible during its intended operating period. | Availability | The system shall achieve at least 99% availability during the defined testing/deployment period, excluding planned maintenance. | Should |
| NFR-009 | Important request changes shall be traceable. | Auditability | 100% of tested status changes, assignments and resolution actions shall record the user, action and timestamp. | Must |
| NFR-010 | The system shall be structured so that changes can be made without unnecessarily affecting unrelated functionality. | Maintainability | 100% of merged changes shall pass the project's automated tests/checks before being merged into `main`, and implemented features shall follow the agreed architecture and coding standards. | Should |
| NFR-011 | The system shall prevent invalid or incomplete data from being stored. | Data Integrity | 100% of tested mandatory-field and validation rules shall reject invalid input and provide an appropriate error message. | Must |
| NFR-012 | The system shall work on commonly used modern browsers. | Compatibility | All core functionality shall successfully operate on the latest versions of Chrome, Edge and Firefox during compatibility testing. | Should |
| NFR-013 | The system should support the expected level of concurrent use without unacceptable degradation. | Scalability | The system shall support at least 50 concurrent users while maintaining the 2-second response target for 95% of normal requests. | Could |
| NFR-014 | The system shall allow service data to be recovered following a failure. | Recoverability | A database backup shall be created according to the agreed backup schedule, and a test restoration shall successfully recover 100% of the selected test backup data. | Should |

## Notes
All the requirements established must be baselined at sign-off; changes after baseline require a 
Change Request (refer to our Change Management standard once active from Milestone 3).