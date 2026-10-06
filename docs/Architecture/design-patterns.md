# Design Patterns

## 2.1 Design Problem

CivicConnect contains several different responsibilities, including handling user interaction, processing service requests, managing authentication and authorisation, accessing persistent data and supporting notifications and reporting. If these responsibilities are implemented directly within the same components, the system could become tightly coupled and more difficult to test and maintain.

The design patterns therefore need to support the modular layered monolith selected for CivicConnect while remaining appropriate for the Node.js, Express, React and PostgreSQL technology stack.

The team also needs to avoid introducing patterns simply for the sake of using design patterns. Each selected pattern should address an actual problem within the system and provide a clear benefit to maintainability, separation of concerns or testability.

## 2.2 Design Pattern Alternatives

The team considered several approaches for structuring CivicConnect. A basic implementation without defined design patterns would initially be simpler, but could result in controllers containing business logic and database operations becoming spread throughout the application. This would make the system more difficult to maintain as functionality is added.

**Model-View-Controller (MVC)** was considered because it separates presentation, request handling and application responsibilities. This fits the current React and Express technology stack and provides a clear structure for the frontend and backend.

A **Layered approach** was also considered because it separates responsibilities such as presentation, business logic and data access. This is already closely related to the selected modular layered monolith architecture, making it a suitable approach for organising the system.

The **Repository pattern** was considered specifically for database access. CivicConnect needs to manage users, service requests, categories and request history in PostgreSQL. Separating database operations from business logic would make this part of the system easier to maintain and test.

The **Strategy pattern** was considered for situations where CivicConnect may need different implementations of the same behaviour, such as different notification methods. However, Strategy is more specialised and would not be appropriate as the main structure of the application.

## 2.3 Quantitative Comparison

The alternatives were compared using criteria that are relevant to CivicConnect. Each criterion was given a weight according to its importance to the project, and each pattern was scored from 1 to 5, where 1 represents a poor fit and 5 represents a strong fit.

|Criterion|Weight|MVC|Layered|Repository|Strategy|
|---|---|---|---|---|---|
|Fit with CivicConnect architecture|25%|5|5|4|2|
|Maintainability|20% |5|4|5|4|
|Separation of responsibilities|20%|5|5|4|3|
|Testability|15%|5|4|5|4|
|Fit with Node.js/Express|10%|5|4|5|4|
|Simplicity for current team|10%|4|5|4|3|
|**Weighted Score**|100%|4.80/5|4.45/5|4.50/5|3.10 / 5|

The results show that MVC has the strongest overall fit as the primary application design pattern. Repository also scores highly, but its purpose is more focused on persistence rather than the structure of the entire application. The Layered approach is also a strong fit, but it is more closely associated with the overall architecture of CivicConnect. Strategy scores lower because it is intended to solve a specific problem involving interchangeable behaviour rather than structure the whole system.

These scores represent the team's engineering judgement based on the current requirements, architecture and technology choices. They are intended to support the decision rather than represent universal measurements of the patterns.

## 2.4 Thought Process Behind the Decision

The design pattern decision followed the same process used when selecting the architecture. The team first looked at the problems that actually exist within CivicConnect and then considered which patterns would solve those problems without adding unnecessary complexity.

The first problem was separating the user interface from the backend processing. CivicConnect has requester, staff and management interfaces, while the backend must process requests, enforce authorisation and communicate with the database. MVC provides a natural structure for this because React handles the presentation while Express routes and controllers handle incoming requests.

The team then considered the relationship between MVC and the modular layered monolith. These decisions are not alternatives to each other. The modular layered monolith defines the overall architecture, while MVC provides a way of organising responsibilities within that architecture.

Database access presented another separate concern. CivicConnect relies on PostgreSQL and needs to maintain relationships between service requests, users, categories and request history. Allowing controllers to directly perform database operations would create stronger coupling between the application and its persistence layer. The Repository pattern provides a boundary around these operations.

The Strategy pattern was then considered for functionality that may have different implementations. Notifications are one possible example, as CivicConnect could potentially support different ways of notifying users. However, using Strategy everywhere would add unnecessary abstraction, so it will only be introduced where genuinely interchangeable behaviour exists.

The final decision was therefore based on using the simplest pattern that solves an actual problem. MVC provides the main application structure, Repository separates persistence responsibilities, and Strategy can provide flexibility where different behaviours are required.

## 2.5 MVC Pattern

MVC is the primary design pattern for CivicConnect.

The View is represented mainly by the React frontend. This includes pages such as the login page, signup page and requester dashboard, as well as reusable components used throughout the interface. The View is responsible for displaying information and collecting user input. It should not contain the application's main business rules or direct database operations.

The Controller is handled by the Express backend. Controllers receive requests from the frontend, validate that the request can be processed, and coordinate the appropriate application operation. They should remain relatively small and should not contain large amounts of business logic or direct database queries.

The application's business logic is handled by services. Services are responsible for operations such as creating a service request, changing its status, assigning responsibility or recording a request update. This keeps the controllers focused on handling requests rather than becoming responsible for the entire operation.

This approach gives each part of the system a clear responsibility while still keeping the application simple enough for the current team to develop and test.

## 2.6 Repository Pattern

The Repository pattern will be used at the persistence boundary of CivicConnect.

Repositories provide the part of the application responsible for communicating with PostgreSQL. A service can request information or ask for a record to be updated without needing to contain the PostgreSQL-specific operations itself.

For example, the request management service can use a request repository when it needs to retrieve or update a service request. The repository is then responsible for the actual database operation.

This separation makes the application easier to test because business logic can be tested separately from the database implementation. It also means that database-related changes are more contained instead of being spread across controllers and services.

## 2.7 Strategy Pattern

The Strategy pattern can be used when CivicConnect needs to perform the same general operation using different approaches.

One possible example is notification handling. CivicConnect may need to notify users when a request is accepted, assigned, updated or completed. If the system supports different notification methods, each method can have its own implementation while the main notification service remains unchanged.

For example, a notification service could work with an email notification strategy or a system notification strategy. If another notification method is required later, it could be added without significantly changing the main notification logic.

The Strategy pattern will not be applied to every part of CivicConnect. It will only be introduced where the project has genuinely interchangeable behaviours. This keeps the design practical and prevents unnecessary abstraction.

## 2.8 Pattern Application Boundaries

Each pattern has a specific responsibility within the application rather than being applied everywhere.

MVC is mainly concerned with the presentation and request-handling side of the application. React handles the user interface, while Express routes and controllers handle incoming requests. Controllers coordinate the operation but should not contain detailed business rules or direct database queries.

The Repository pattern applies specifically to the persistence boundary. Services use repositories when they need to work with stored data, while the repository handles communication with PostgreSQL. This keeps database-specific operations away from the user interface and business logic.

Strategy has a narrower boundary. It would only be used inside a service where the system needs to support different implementations of the same behaviour. It is therefore not part of the overall application structure.

This allows the patterns to work together without overlapping unnecessarily. MVC provides the main request and application structure, Repository controls access to persistent data, and Strategy can be introduced for specific areas where interchangeable behaviour is required.

## 2.9 Relationship to the Modular Layered Monolith

The design patterns support the modular layered monolith selected for CivicConnect rather than replacing it.

The modular layered monolith describes the overall architecture of the system and how its major responsibilities are separated. MVC then provides a practical structure for handling the frontend and backend request flow within that architecture.

Repository supports the persistence layer by creating a clear boundary around PostgreSQL. Strategy can be used within an appropriate service if the system later requires different implementations of the same behaviour.

The patterns therefore operate at different levels. The architecture determines how the application is organised overall, while the design patterns help organise specific responsibilities within that architecture.

## 2.10 Design Pattern Decision

Based on the comparison and the current requirements, the team selected MVC as the primary design pattern for CivicConnect.

The Repository pattern will support MVC by separating database access from the application's business logic. Strategy will only be introduced where there is a clear requirement for interchangeable behaviour.

This decision keeps the design relatively simple while still providing separation of responsibilities, maintainability and testability. It also fits the selected React, Node.js, Express and PostgreSQL technology stack.

The team did not select patterns simply because they are commonly used. Each pattern must have a clear purpose within the system and should only be introduced when it provides a practical benefit.

## 2.11 Traceability

The design decisions can be linked back to the requirements and architecture established for CivicConnect.

|CivicConnect Requirement or Decision|Design Response|
|---|---|
|Modular layered monolith|MVC provides internal structural separation within the application|
|NFR-002 – Authorisation|Backend controllers and middleware provide controlled access to application functions|
|NFR-009 – Auditability|Services provide controlled points for recording request changes and history|
|NFR-010 – Maintainability|MVC and Repository separate responsibilities and reduce unnecessary coupling|
|PostgreSQL persistence|Repository provides a boundary around database access|
|REST API|Express routes and controllers provide the application boundary|
|Testing|Services and repositories can be tested separately|
|Future extensibility|Strategy can be introduced where genuinely interchangeable behaviour is required|

## 2.12 Final Design Position

CivicConnect will use MVC as its primary design pattern, supported by the Repository pattern for database persistence. Strategy remains an optional pattern that will only be introduced when the system has a genuine requirement for interchangeable behaviour.

The overall goal is not to use as many design patterns as possible. The goal is to keep responsibilities clear, make the system easier to test and maintain, and provide enough structure for the current requirements without adding unnecessary complexity.