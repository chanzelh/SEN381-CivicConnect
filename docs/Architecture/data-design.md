# Data Design
## 2.1 Data Design Problem

CivicConnect requires a reliable persistent record of service requests from creation through completion. A request may be categorised, assigned to a staff member, updated several times, resolved and eventually closed. Requesters need access to their current status and previous requests, staff need information required to manage requests, and management needs structured information for service activity and reporting.

The data design must therefore represent both the current state of a request and the information needed to understand its history. It must also prevent invalid relationships or incomplete records from being stored.

The status-transition operation is particularly important. A change to the current status may need to be accompanied by a history or audit record showing who performed the change and when it occurred. Treating these as unrelated database operations could result in inconsistent information.

## 2.2 Initial Data Model

The central entity in the data model is the Service Request. It represents the request submitted by a requester and contains information such as its unique identifier, description, category, current status, requester, assigned staff member and relevant timestamps.

The User entity represents people interacting with the system. Users have roles that determine which functions they are authorised to access. This supports the authorisation requirements established in M1.

The Category entity represents the controlled categories that can be selected when a request is submitted. Separating categories from the request itself helps maintain consistent categorisation and allows management to group and filter requests.

A Request History entity records significant changes made to a request. It can contain the request identifier, the user who performed the action, the previous status, the new status, an action or comment and a timestamp. This supports the auditability requirement and allows the system to retain historical information without overwriting previous states.

Assignment can either be represented directly through the assigned staff member on the Service Request or through a separate Assignment entity if the team determines that assignment history needs to be retained independently. This should be finalised according to the team's implementation requirements.

The main relationships are shown below.

|Relationship|Purpose|
|---|---|
|User: Service Request|Identifies who submitted a request|
|Category: Service Request|Provides controlled request categorisation|
|Service Request: Request|History	Records changes and actions over the request lifecycle|
|User: Request History|Identifies who performed an action|
|User: Service Request|Can identify the staff member responsible for a request|

The final ERD should represent these relationships and their cardinalities.

## 2.3 Data Integrity and Validation
Data validation should be handled across the different layers of CivicConnect rather than relying on one part of the system to catch every error.

The user interface should handle basic input validation and give immediate feedback to the requester or staff member. The application layer should handle CivicConnect-specific business rules, such as checking whether a user is authorised to perform an operation and whether a requested status transition is valid. The database should then enforce the basic rules that must always be true, regardless of how the data is accessed.

The database can use constraints such as NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY and CHECK to help make sure required information is present and that relationships between records remain valid.

This layered approach is useful because validation in the user interface alone cannot guarantee data integrity. Business rules should be handled in the application where they can be tested and maintained, while the database should provide an additional layer of protection for the underlying data.

## 2.4 Status Transitions and Transactions
A request status change should be treated as one business operation. For example, when an authorised staff member changes a request from one valid status to another, the current status should be updated and the related history record should be created as part of the same operation.

Using a transaction helps prevent partial updates. If the status is changed successfully but the history record fails to save, the system could end up with incomplete information. The transaction should therefore allow the related changes to succeed together or be rolled back if a failure occurs.

The application layer should first check whether the requested status transition is allowed. If it is valid, the status update and history entry can then be saved together.

This supports FR-010, which requires controlled status transitions, and NFR-009, which requires important changes such as status and assignment updates to be recorded for auditing.
## 2.5 Concurrency
Concurrency also needs to be considered because multiple staff members may be working with service requests at the same time. For example, two staff members could attempt to update the same request at approximately the same time.

The persistence design should therefore account for situations where multiple users access or modify the same data. The final concurrency approach should be based on the actual database implementation and expected usage of CivicConnect.

The team should also avoid automatically choosing the strongest possible isolation level without considering the consequences. Stronger isolation can introduce additional processing overhead and may require the application to deal with transaction failures or retries. The selected approach should therefore provide enough protection for CivicConnect without adding unnecessary complexity.

## 2.6 Persistence Recommendation
A relational persistence model is recommended for CivicConnect because the main data has clear relationships and needs consistent links between records. Users, service requests, categories and request history all have structured relationships that fit well within a relational database.

The design will combine application-level business rules with database integrity constraints. Operations that involve multiple related changes, such as updating a request status and recording its history, should use transactions to maintain consistency.

This approach supports the M1 requirements for request management, controlled status transitions, auditability and data integrity. The final design should be reflected in the M2 ERD and then carried through into the persistence implementation and related RTM and ADR entries.