# API Contracts and Integration Design

## 3.1 Integration Problem

CivicConnect's request-management functionality may need to interact with notification functionality when an important request event occurs. For example, a notification may need to be generated when a request is accepted, updated, resolved or completed.

The request-management functionality is the producer or caller because it knows that a relevant request event has occurred. Notification functionality is the consumer or callee because it is responsible for processing the notification.

The information exchanged may include the request identifier, notification recipient, relevant request status, notification type and event information.

A significant failure scenario occurs when the request itself is successfully updated but the notification cannot be processed. The integration design must therefore define what happens when notification processing fails.

At the same time, the React frontend requires a consistent way to communicate with the Express backend. The API must therefore provide a controlled application boundary where requests can be authenticated, authorised and validated before reaching the application's business logic.

## 3.2 Integration Alternatives

### 3.2.1 Alternative 1: In-Process Interface

The first option is to use an in-process interface. Request-management functionality would depend on a notification interface rather than directly depending on a specific notification implementation.

This keeps the communication inside the same application and avoids the additional problems that come with network communication. It should also be relatively straightforward to test because the notification implementation can be replaced with a test version when required.

The main limitation is that both responsibilities remain part of the same application. They cannot be independently deployed or scaled without changing the architecture.

### 3.2.2 Alternative 2: HTTP/REST

A second option is to establish an HTTP/REST interface between request management and notification functionality.

A REST interface would create a clear communication boundary and could allow the notification functionality to become an independently deployed component in the future. It would also require the team to define resources, HTTP methods, request and response formats, authentication, error handling and version compatibility.

However, using REST for internal communication would introduce additional failure points. The system would need to handle network timeouts, connection failures and unsuccessful responses. Authentication, authorisation, endpoint security and API testing would also become additional responsibilities.

For the current CivicConnect architecture, these additional concerns may not provide enough benefit to justify the added complexity.

### 3.2.3 Alternative 3: Asynchronous Messaging

A third option is asynchronous messaging. Request management could publish an event when a relevant request change occurs, while the notification functionality would receive and process that event separately.

This could reduce the direct dependency between the two components because request management would not necessarily have to wait for notification processing to finish. It could also make it easier for other parts of the system to respond to the same type of event in the future.

The disadvantage is that this would introduce additional infrastructure and processing concerns. The system would need to account for message delivery, retries, duplicate messages, message ordering and monitoring. This would make the solution more complicated than what is currently required.

## 3.3 Quantitative Integration Comparison

The alternatives were evaluated against criteria relevant to CivicConnect. Each criterion is scored from 1 to 5, where 5 represents the strongest fit for the current project. The weights reflect the importance of each consideration to the current system.

|Consideration|Weight|In-Process Interface|HTTP/REST|Asynchronous Messaging|
|---|---|---|---|---|
|Fit with modular monolith|25%|5|3|2|
|Simplicity for current team|20%|5|3|2|
|Failure handling|15%|5|3|2|
|Testability|15%|5|4|3|
|Future integration flexibility|10%|3|5|5|
|Independent deployment|5%|1|5|5|
|Infrastructure overhead|10%|5|3|1|
|**Weighted Score**|**100%**|**4.60/5**|**3.40/5**|**2.65/5**|

The in-process interface achieved the highest score because CivicConnect is currently being developed as a modular layered monolith by a three-person team. It provides clear separation through an interface without introducing network communication or additional infrastructure.

HTTP/REST scored well for future flexibility and independent deployment, but these benefits are not currently required for communication between internal modules. Asynchronous messaging provides strong decoupling and future scalability, but its infrastructure and failure-handling requirements make it unnecessarily complex for the current scope.

These scores represent project-specific engineering judgement rather than universal measurements of the technologies.

## 3.4 Integration Recommendation

The recommended approach for the current CivicConnect implementation is an **in-process interface between request management and notification functionality**.

This fits the proposed modular layered monolith because both responsibilities can remain within the same application while still having a clear separation between them. Request-management code will depend on a notification interface rather than directly depending on a specific notification implementation.

This approach also avoids introducing a network boundary when there is currently no requirement for notification functionality to be independently deployed or scaled.

At the application boundary, however, CivicConnect will use **HTTP/REST** to allow the React frontend to communicate with the Express backend. This distinction is important: REST is used where a clear external application boundary is required, while in-process interfaces are used between modules within the same application.

If CivicConnect eventually needs external systems to consume notifications, or notification functionality needs to be deployed and scaled separately, HTTP/REST or asynchronous messaging can be reconsidered through the project's change-control process.

## 3.5 API Contract Definition

An HTTP API contract defines the agreement between a consumer and the application about how communication will take place. For CivicConnect, the contract is broader than simply listing endpoint names.

The contract defines resource paths, HTTP methods, parameters, required headers, authentication expectations, request representations, validation rules, response status codes, response representations, error structures and behavioural rules such as pagination or idempotency where required.

For example, `POST /api/v1/requests` is not simply an endpoint name. The contract defines who can use the endpoint, what information must be provided, how that information is validated, what response is returned when the request is successfully created and how different failure conditions are communicated.

This provides a consistent agreement between the React frontend and Express backend and allows both sides to be developed and tested against the same expected behaviour.

## 3.6 API Design as Contract Design

API design is treated as contract design because other parts of CivicConnect will depend on the behaviour defined by the interface. The React frontend will rely on the Express backend to provide predictable requests, responses and error handling. Careless changes to the interface could therefore break functionality that depends on it.

The API will use resource boundaries that represent meaningful CivicConnect concepts, such as service requests, users, categories and reports. Consistent naming and representations will be used so that similar operations follow a predictable structure.

Input will be validated at the API boundary before it reaches the application's business logic. The backend will also return useful error information without exposing sensitive information such as passwords, database details, SQL statements, stack traces or other internal implementation details.

Appropriate HTTP methods and status codes will be used according to the operation being performed. Authentication and authorisation requirements will form part of the contract, with protected functionality enforced by the backend rather than relying only on restrictions in the React interface.

The API will also avoid exposing persistence structures directly. The frontend should depend on representations designed for the application's needs rather than becoming dependent on the internal PostgreSQL table structure.

Compatibility and versioning will also be considered before consumers become dependent on specific API behaviour. Breaking changes will be managed through the project's change-control process and can result in a new API version.

## 3.7 Frontend–Backend REST API Contract

### 3.7.1 Purpose and Consumer

The REST API is the boundary between the React presentation layer and the Express backend. The React frontend is its primary consumer.

The REST API is a primary trust boundary between the presentation layer and backend. All input received through the API is treated as untrusted, and authentication and authorisation are enforced on the backend for every request rather than relying on the user interface.

### 3.7.2 General Conventions

|Convention|Rule|Trace|
|---|---|---|
|Base path|`/api/v1`|—|
|Format|JSON request and response bodies; timestamps use ISO-8601 UTC|—|
|Authentication|Every endpoint except `POST /api/v1/auth/login` requires an authenticated user. Otherwise `401 UNAUTHENTICATED`.|NFR-001, ASR-1|
|Authorisation|Role and request scope are checked on every call. Otherwise `403 FORBIDDEN`.|NFR-002, FR-006, ASR-1|
|Validation|Invalid or missing fields return `400 VALIDATION_ERROR` with field details.|NFR-011|
|Sensitive data|No personal data in URLs or query strings. Error responses do not contain stack traces, SQL or internal details. Unexpected errors return `500 INTERNAL_ERROR`.|NFR-003|
|Pagination|`page` defaults to 1 and `pageSize` defaults to 20 with a maximum of 100.|NFR-005|
|Versioning|Breaking changes require a Change Request and a new version path such as `/api/v2`.|Change Management|

### 3.7.3 Error Format

All endpoints will use a consistent error structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": [
      {
        "field": "categoryId",
        "issue": "required"
      }
    ]
  }
}
```

|Status|Code|Meaning|
|---|---|---|
|400|VALIDATION_ERROR|Missing or invalid input|
|401|UNAUTHENTICATED / INVALID_CREDENTIALS| Not logged in, or login failed|
|403|FORBIDDEN|Role or request scope does not permit the action|
|404|NOT_FOUND|Resource does not exist|
|409|INVALID_TRANSITION|Status change is not allowed from the current status|
|409|STALE_UPDATE|Request was changed by another user since it was loaded|
|500|INTERNAL_ERROR|Unexpected server error with no internal details returned|

### 3.7.4 Request Status Model

CivicConnect will use controlled status transitions rather than allowing arbitrary status changes.

|From|To|Performed by|
|---|---|---|
|SUBMITTED|ACCEPTED|Staff; caller is assigned if nobody is assigned yet|
|SUBMITTED|REJECTED|Staff; comment required |
|ACCEPTED|IN_PROGRESS|Assigned staff|
|IN_PROGRESS|RESOLVED|Assigned staff; comment required|
|RESOLVED|CLOSED|Staff or Management|

`REJECTED` and `CLOSED` are final states.

For reporting purposes, an open request is one with a status of `SUBMITTED`, `ACCEPTED` or `IN_PROGRESS`. `isOverdue` is calculated by the backend for open requests that exceed the agreed threshold, supporting FR-014.

### 3.7.5 Resource Representations

A **ServiceRequest** will be represented as follows:

```json
{
  "id": "uuid",
  "reference": "CC-000123",
  "description": "string",
  "category": {
    "id": "uuid",
    "name": "string"
  },
  "status": "SUBMITTED | ACCEPTED | REJECTED | IN_PROGRESS | RESOLVED | CLOSED",
  "isOverdue": false,
  "requester": {
    "id": "uuid",
    "name": "string"
  },
  "assignedStaff": {
    "id": "uuid",
    "name": "string"
  },
  "createdAt": "2026-10-07T09:00:00Z",
  "updatedAt": "2026-10-07T09:00:00Z",
  "version": 3
}
```

`assignedStaff` will be `null` when the request is unassigned.

A **HistoryEntry** will be represented as follows:

```json
{
  "id": "uuid",
  "action": "CREATED | STATUS_CHANGED | ASSIGNED | COMMENT",
  "user": {
    "id": "uuid",
    "name": "string"
  },
  "previousStatus": "string or null",
  "newStatus": "string or null",
  "comment": "string or null",
  "timestamp": "2026-10-07T09:00:00Z"
}
```

These representations are intentionally separate from the underlying PostgreSQL tables so that API consumers do not become dependent on the persistence structure.

## 3.8 Endpoint Contract

Unless otherwise stated, all endpoints use the `/api/v1` base path.

|Method|Path|Roles / Scope|Input|Success|Errors| Trace|
|---|---|---|---|---|---|---|
|POST|`/auth/login`|Public|email, password|200 user|400, 401|NFR-001|
|POST|`/auth/logout`|Authenticated|—| 204| 401 |NFR-001|
|GET|`/auth/me`|Authenticated|—|200 user|401|NFR-001|
|GET|`/categories`|Authenticated|—|200 category list|401|FR-002|
|POST|`/requests`|Requester|categoryId, description|201 ServiceRequest|400, 401, 403|FR-001, FR-002, NFR-011|
|GET|`/requests`|Requester: own; Staff: unassigned + assigned; Management: all|status, categoryId, overdue, search, sort, order, page, pageSize|200 `{ items, page, pageSize, total }`|400, 401|FR-003, FR-004, FR-006, FR-007, FR-014, FR-015|
|GET|`/requests/{id}`|Within caller's scope|—|200 ServiceRequest|401, 403, 404|FR-003, FR-008|
|GET|`/requests/{id}/history`|Within caller's scope|—|200 HistoryEntry list|401, 403, 404|FR-008, NFR-009|
|PATCH|`/requests/{id}/status`|Staff / Management per status model newStatus, comment, version|200 ServiceRequest|400, 401, 403, 404, 409 | FR-010, FR-012, NFR-009, ASR-2|
|PATCH|`/requests/{id}/assignment`|Staff (self) / Management (any staff)|staffId, version|200 ServiceRequest|400, 401, 403, 404, 409|FR-009, NFR-009, ASR-2|
|POST|`/requests/{id}/comments`|Staff within scope|comment|201 HistoryEntry|400, 401, 403, 404|FR-011, NFR-009|
|GET|`/reports/summary`|Management|from, to|200 `{ byStatus, byCategory, overdueCount }`| 400, 401, 403|FR-013, FR-014, FR-015|

## 3.9 Detailed Specification: Change Request Status

### Endpoint

`PATCH /api/v1/requests/{id}/status`

### Request

```json
{
  "newStatus": "RESOLVED",
  "comment": "Broken light replaced.",
  "version": 3
}
```

### Processing Behaviour

The backend will process the request in the following order.

1. If there is no authenticated user, return `401 UNAUTHENTICATED`.
2. If `newStatus` or `version` is missing or invalid, or a required comment is missing, return `400 VALIDATION_ERROR`.
3. If the request does not exist, return `404 NOT_FOUND`.
4. If the caller's role or scope does not permit the transition, return `403 FORBIDDEN`.
5. If the supplied `version` does not match the stored version, return `409 STALE_UPDATE`.
6. If the requested transition is not allowed by the status model, return `409 INVALID_TRANSITION`.
7. Save the status update and Request History entry in a single database transaction. If either operation fails, both changes are rolled back.
8. After the transaction commits successfully, request management calls the notification interface.
9. Return `200 OK` with the updated `ServiceRequest`, including the incremented version.

This transaction supports the data integrity and auditability requirements because the status change and its corresponding history record cannot be successfully committed independently.

### Example Error

```json
{
  "error": {
    "code": "INVALID_TRANSITION",
    "message": "Cannot change status from CLOSED to IN_PROGRESS."
  }
}
```

## 3.10 Notification Interface Contract

### 3.10.1 Parties

The notification integration uses an in-process interface within the modular layered monolith.

* **Caller:** Request-management module/service
* **Callee:** Notification module
* **Interface:** `NotificationService`

Request-management functionality does not depend directly on a specific notification implementation. It communicates through the `NotificationService` interface, allowing the implementation to change without requiring the request-management service to change.

### 3.10.2 Notification Information

When a notification is required, request management can provide information such as:

* Request identifier
* Request reference
* Recipient
* Notification type
* Previous and new status where relevant
* Event information
* Relevant message content

The notification module is responsible for processing this information and determining how the notification should be delivered.

### 3.10.3 Failure Behaviour

The request status update is committed before notification processing is attempted. This prevents a notification failure from causing an otherwise valid request update to be rolled back.

If notification processing fails, the request remains successfully updated and the failure must be recorded through the application's error-handling or logging mechanism. The notification mechanism can then support an appropriate retry or recovery approach during implementation.

This behaviour ensures that the notification integration does not compromise the consistency of the core request-management operation.

### 3.10.4 Notification Failure and Recovery Decision

CivicConnect will treat a notification failure separately from the service-request update. Once the request status and its corresponding Request History entry have been committed successfully, a notification failure will not roll back the request update. The request remains in its updated state, and the notification failure must be recorded so that it can be recovered.

For the initial implementation, the notification module will use a bounded retry approach. If notification processing fails because of a temporary problem, the system will retry the operation up to three times, with a short delay between attempts. If all attempts fail, the notification will be marked as failed and the error will be logged with the relevant request reference, notification type and failure details. Sensitive information must not be included in logs.

A failed notification must remain identifiable so that it can be retried later rather than being silently discarded. Authorised staff or a designated administrator should be able to identify failed notifications and initiate a retry. A retry must not create duplicate notifications where the delivery mechanism supports duplicate detection.

The notification retry process must not repeat the service-request status update or create another Request History entry. It must retry only the notification operation associated with the already-committed request change.

This decision keeps request management reliable even when notification delivery is temporarily unavailable. It also provides a clear recovery path without introducing a message broker or a distributed architecture that is unnecessary for the current project scope.

Recovery decision: Commit the request update and history entry first, attempt notification processing, retry temporary failures up to three times, and record persistent failures for later investigation and manual retry. The retry mechanism and failed-notification tracking must be verified during implementation before this behaviour is treated as complete.

## 3.11 Relationship to Architecture and Design Patterns

The API design supports the selected modular layered monolith architecture.

The React frontend forms the presentation layer and communicates with Express through the REST API. Express routes and controllers provide the application boundary, while services handle business operations. Repositories provide the persistence boundary between application logic and PostgreSQL.

The API therefore supports the project's MVC design by separating the React presentation layer from backend request handling. The Repository pattern keeps database operations separate from the API and business logic.

The notification interface also supports the Strategy pattern where interchangeable notification implementations are required. Different notification behaviours can be provided behind the interface without changing the request-management functionality that depends on it.

## 3.12 Traceability

The API contract is linked to the CivicConnect requirements and architecture decisions through the following relationships:

|Requirement / Decision|API Design Response|
|---|---|
|NFR-001 – Authentication|Protected endpoints require authentication|
|NFR-002 – Authorisation|Backend checks role and request scope|
|NFR-003 – Data Protection|Sensitive information is not exposed in URLs or errors|
|NFR-005 – Performance|Pagination limits response size|
|NFR-009 – Auditability|Status, assignment and comment operations create history records|
|NFR-011 – Data Integrity|Input validation and controlled status transitions|
|FR-006 – Staff Access|Request scope is enforced by the backend|
|FR-009 – Assignment|Dedicated assignment endpoint|
|FR-010 – Status Updates|Controlled status-transition endpoint|
|FR-011 – Actions and Comments|History and comment endpoints|
|FR-013–FR-015 – Management Reporting|Reporting endpoint with approved filtering dimensions|
|ASR-1 – Security|Authentication and authorisation enforced at the backend boundary|
|ASR-2 – Consistency|Version checking and transactional updates|
|Modular Layered Monolith|REST at the application boundary and in-process interfaces internally|
|MVC|Express routes/controllers provide backend request handling|
|Repository Pattern|Persistence operations remain behind the repository boundary|
|Strategy Pattern|Notification implementations can be substituted behind an interface|

## 3.13 Final API and Integration Position

CivicConnect will use **REST at the frontend–backend application boundary** and **in-process interfaces for communication between internal modules**.

The REST API will provide a versioned, authenticated and validated contract between React and Express. The contract defines endpoint behaviour, request and response representations, status codes, errors, authentication, authorisation, validation, pagination and compatibility expectations.

For internal notification integration, the request-management module will communicate through the `NotificationService` interface rather than directly depending on a specific implementation.

This approach provides the separation required by the project while avoiding unnecessary distributed-system complexity. It also leaves a clear path for future change if CivicConnect later requires independently deployed notification services or external integrations.
