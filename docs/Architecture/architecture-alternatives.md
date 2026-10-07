# Architecture Alternatives
## 1.1 Architecture Problem
CivicConnect must support several types of users and responsibilities within one service-request system. Requesters need to submit requests, monitor their status and view previous requests, while staff members need to manage, assign and update requests. Management also requires reliable information about service activity, including open, overdue, resolved and closed requests.

The architecture must therefore provide clear separation between these responsibilities while supporting the security, reliability, auditability and maintainability requirements established in M1. The architecture also needs to be appropriate for the size of the development team and the current scope of the project. Introducing unnecessary distributed infrastructure could increase development and deployment complexity without providing a clear benefit to the current system.

Three realistic alternatives were considered: a modular layered monolith, a traditional layered monolith and a distributed architecture.
## 1.2 Alternative 1: Modular Layered Monolith
A modular layered monolith would keep CivicConnect as one deployable application while separating its responsibilities into logical modules or layers. The presentation layer would manage user interaction, the application or service layer would contain CivicConnect's business rules, and the persistence layer would manage access to stored data.

Within this structure, functionality such as request management, authentication, notifications and reporting could have their own responsibilities while still operating within the same application. Interfaces can be used between modules so that one component does not depend directly on the implementation details of another.

The main advantage of this approach is its relatively low complexity. Since the components are part of the same application, communication does not require a network boundary. This simplifies development, testing and deployment and reduces the number of infrastructure concerns that the team must manage. It is also appropriate for a small development team because the system can still have clear internal boundaries without requiring multiple independently deployed services.

The main limitation is that the modules remain part of the same deployment. Individual functionality cannot easily be scaled or deployed independently. However, this limitation is not currently a major concern because CivicConnect does not have a demonstrated requirement for independently scaling or deploying its internal functionality.
## 1.3 Alternatice 2: Traditional Layered Monolith
A traditional layered monolith would also keep CivicConnect as one deployable application, but the system would primarily be separated into broad layers such as presentation, business logic and data access rather than clearly separated functional modules.

This approach would be relatively simple to develop and deploy and would require less infrastructure than a distributed architecture. It would also be suitable for the current team size and project scope.

However, a traditional layered structure can allow functionality from different areas of the system to become increasingly dependent on the same business and data-access layers as the application grows. This could make it more difficult to maintain clear boundaries between areas such as request management, reporting, authentication and notifications.

The approach is therefore simpler than a distributed architecture, but it provides less modular separation than the proposed modular layered monolith.
## 1.4 Alternative 3: Distributed Architecture
A distributed architecture would divide CivicConnect into independently deployable components or services. Request management, notifications and potentially reporting could operate as separate services and communicate through defined interfaces such as HTTP APIs or asynchronous messaging.

This approach provides stronger deployment and scaling independence. For example, notification functionality could potentially be changed or scaled without deploying the request-management component. It could also make future external integrations easier because services already communicate through explicit boundaries.

However, this architecture introduces additional complexity. Communication between components becomes dependent on networks, which introduces concerns such as timeouts, communication failures, authentication between services and more complicated testing. Deployment, configuration and monitoring would also become more demanding. These concerns would create additional work for the three-person CivicConnect team.
## 1.5 Quantitative Comparison
The alternatives were compared using criteria that are relevant to CivicConnect rather than choosing an architecture based only on general industry popularity.

Each criterion was given a percentage weight based on its importance to the project. Each architecture was then scored from 1 to 5, where:

1 = Poor fit
2 = Weak fit
3 = Acceptable fit
4 = Good fit
5 = Strong fit

The weighted score was calculated using:

Weighted Score = Σ (Weight × Rating)

|Consideration|Weight|Modular Layered Monolith|Traditional Layered Monolith|Distributed Architecture|
|---|---|---|---|---|
|Suitability for 3-person team|25%|5|5|2|
|Development complexity|20%|5|5|2|
|Maintainability|15%|4|3|4|
|Scalability|15%|3|3|5|
|Deployment simplicity|10%|5|5|2|
|Future integration|10%|4|3|5|
|Testing and debugging|5%|5|4|2|
|Weighted Score|100%|4.55 / 5|4.15 / 5|2.85 / 5|

The modular layered monolith achieves the highest overall score because it provides a balance between internal separation and implementation simplicity. The traditional layered monolith scores similarly because it is also simple to develop and deploy, but it provides less modular separation. The distributed architecture performs strongly for scalability and future integration but scores lower overall because those benefits are not currently sufficient to justify its additional development and operational complexity.

The numerical scores are an engineering judgement based on the current CivicConnect requirements, constraints and team context. They are therefore intended to support the architecture decision rather than represent universal measurements of each architecture.
## 1.6 Architecture Decision Thought Process
The architecture decision was not based on selecting the architecture with the most features. The team first considered what CivicConnect actually needs to achieve.

CivicConnect requires several distinct areas of functionality, including authentication, request management, notifications and reporting. This means that simply placing everything into one tightly connected codebase would make future maintenance more difficult. Some form of internal separation is therefore necessary.

The next consideration was whether these areas needed to become separate applications or services. At the current stage, there is no requirement for request management, notifications or reporting to be independently deployed or independently scaled. They are all part of the same CivicConnect system and are being developed by a three-person team.

A distributed architecture would provide these capabilities, but it would also introduce network communication, service-to-service authentication, additional deployment configuration, failure handling, monitoring and more complicated integration testing. These are valid trade-offs when a system requires them, but they would add complexity to CivicConnect without addressing a current requirement.

The team therefore considered the middle option: keeping the application as one deployable system while creating strong internal boundaries. This provides the benefits of separation without requiring the operational overhead of multiple services.

The quantitative comparison supports this reasoning. The modular layered monolith achieved the highest score of 4.55/5, compared with 4.15/5 for the traditional layered monolith and 2.85/5 for the distributed architecture.

The decision can therefore be summarised as choosing the architecture that provides the best balance between separation, maintainability, development effort and future flexibility for the current project.
## 1.7 Architecture Recommendation
The recommended architecture for CivicConnect is a modular layered monolith. This provides the separation of responsibilities required by the M1 requirements without introducing the operational complexity of a distributed architecture.

The decision is mainly influenced by the current scope, the three-person development team and the lack of a requirement for independently deployed or independently scalable services. The architecture still allows the team to establish clear boundaries between request management, persistence, authentication, notification and reporting functionality through interfaces and well-defined responsibilities.

The architecture therefore provides a middle ground between the simplicity of a traditional monolith and the flexibility, but higher complexity, of a distributed system.

This does not mean that a distributed architecture has been rejected permanently. If future requirements introduce external consumers, independently scalable services or a need for separate deployment, the architecture can be reconsidered through the project's change-control and ADR process.

The selected architecture should be recorded in an architecture ADR and represented in the M2 architecture diagram. The repository structure should also reflect the logical responsibilities established by the architecture.

This choice directly supports NFR-002 by allowing role-based access control to be enforced centrally rather than duplicated across multiple services. It supports NFR-009 by allowing auditability to be handled consistently across status, assignment and resolution changes. It also supports NFR-010 by providing separation of concerns and maintainable module boundaries without adding the coordination and deployment overhead associated with a distributed system.
## 1.8 Architecture Boundaries 
The selected modular layered monolith separates CivicConnect into several logical areas, with each area having a defined responsibility. These boundaries are used to prevent different parts of the system from becoming too dependent on each other. Although the system is divided internally, all of these areas remain part of the same deployable application.

The presentation layer is responsible for the React interfaces used by requesters, staff and management. It handles displaying information and collecting user input, but it should not contain database queries or the main business rules of the system. Requests from the frontend are passed through the API boundary to the backend.

The application layer is responsible for coordinating CivicConnect's main operations. This includes functionality such as creating and managing service requests, authentication and authorisation, notifications and reporting. Controllers receive API requests and pass the required operation to the appropriate service rather than implementing all of the business logic themselves.

The domain layer represents the core concepts and rules of CivicConnect. This includes service requests, users, categories, request status, workflows and request history. Keeping these concepts separate means that the core rules of the system do not need to depend directly on the React interface, HTTP requests or database implementation.

The infrastructure layer handles technical concerns such as PostgreSQL persistence and external integrations. Database operations are separated from the application logic so that services do not need to contain database-specific code.