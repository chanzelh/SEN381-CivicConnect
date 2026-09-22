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

Data validation should be distributed across the appropriate layers rather than relying on a single point of validation.

The user interface should handle basic input validation and provide immediate feedback to the requester or staff member. The application layer should enforce CivicConnect-specific business rules, such as whether a user is authorised to perform an operation and whether a requested status transition is valid. The database should enforce fundamental structural rules that must remain true regardless of how the data is accessed.

PostgreSQL provides database integrity mechanisms such as NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY and CHECK constraints (PostgreSQL Global Development Group, 2023d). These mechanisms can help ensure that required information is present and that relationships between records remain valid.

This layered approach is preferable because a user-interface check alone cannot guarantee data integrity. Business rules should remain in the application where they can be tested and maintained, while fundamental structural constraints should also be protected at the database level.

## 2.4 Status Transitions and Transactions

The request status transition is treated as a single business operation. For example, when an authorised staff member changes a request from one valid state to another, the current status should be updated and the corresponding history information should be recorded consistently.

A transaction is appropriate when multiple database changes form part of the same operation. The purpose is to prevent a partial update where one change succeeds while another fails. PostgreSQL's transaction-processing facilities support this type of atomic operation (PostgreSQL Global Development Group, 2023a).

The application layer should first determine whether the transition is valid according to CivicConnect's business rules. If it is valid, the required database changes can then be performed as one transaction.

This supports FR-010, which requires controlled status transitions, and NFR-009, which requires changes such as status and assignment updates to be auditable.

## 2.5 Concurrency

Concurrency must also be considered because more than one staff member may work with service requests. Two users could potentially attempt to modify the same request at approximately the same time.

PostgreSQL provides concurrency-control and transaction-isolation mechanisms for managing simultaneous access to data (PostgreSQL Global Development Group, 2023b; PostgreSQL Global Development Group, 2023c). The final concurrency strategy should be selected once the team's persistence implementation and expected usage are sufficiently defined.

The team should avoid selecting the strongest possible isolation level simply because it provides stronger guarantees. Stronger isolation can introduce additional overhead and may require the application to handle transaction failures or retries. The selected approach should therefore be proportionate to CivicConnect's actual usage.

## 2.6 Persistence Recommendation

A relational persistence model is recommended for CivicConnect because the core data has clearly defined relationships and requires reliable integrity between records. Users, service requests, categories and request history have structured relationships that are well suited to relational storage.

The design will use application-level business rules together with database integrity constraints. Important multi-step operations, such as status changes accompanied by history recording, should use transactions to preserve consistency.

This decision directly supports the M1 requirements around request management, controlled status transitions, auditability and data integrity. It should be reflected in the M2 ERD, persistence implementation, relevant ADR and RTM.