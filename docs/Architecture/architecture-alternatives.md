# Architecture Alternatives
IMPORTANT NOTE:
architecture-diagram.png will be added under the Architecture folder once it is completed.
2nd NOTE
under Wireframes the following PNGs will be necessary to be submitted once completed:
requester-flow.png
staff-flow.png
management-dashboard.png
## 1.1 Architecture Problem
CivicConnect must support several types of users and responsibilities within one service-request system. Requesters need to submit requests, monitor their status and view previous requests, while staff members need to manage, assign and update requests. Management also requires reliable information about service activity, including open, overdue, resolved and closed requests.

The architecture must therefore provide clear separation between these responsibilities while supporting the security, reliability, auditability and maintainability requirements established in M1. The architecture also needs to be appropriate for the size of the development team and the current scope of the project. Introducing unnecessary distributed infrastructure could increase development and deployment complexity without providing a clear benefit to the current system.

Two realistic alternatives were considered: a modular layered monolith and a distributed architecture.
## 1.2 Alternative 1: Modular Layered Monolith
A modular layered monolith would keep CivicConnect as one deployable application while separating its responsibilities into logical modules or layers. The presentation layer would manage user interaction, the application or service layer would contain CivicConnect's business rules, and the persistence layer would manage access to stored data.

Within this structure, functionality such as request management, authentication, notifications and reporting could have their own responsibilities while still operating within the same application. Interfaces can be used between modules so that one component does not depend directly on the implementation details of another.

The main advantage of this approach is its relatively low complexity. Since the components are part of the same application, communication does not require a network boundary. This simplifies development, testing and deployment and reduces the number of infrastructure concerns that the team must manage. It is also appropriate for a small development team because the system can still have clear internal boundaries without requiring multiple independently deployed services.

The main limitation is that the modules remain part of the same deployment. Individual functionality cannot easily be scaled or deployed independently. However, this limitation is not currently a major concern because CivicConnect does not have a demonstrated requirement for independently scaling or deploying its internal functionality.
## 1.3 Alternative 2: Distributed Architecture
A distributed architecture would divide CivicConnect into independently deployable components or services. Request management, notifications and potentially reporting could operate as separate services and communicate through defined interfaces such as HTTP APIs or asynchronous messaging.

This approach provides stronger deployment and scaling independence. For example, notification functionality could potentially be changed or scaled without deploying the request-management component. It could also make future external integrations easier because services already communicate through explicit boundaries.

However, this architecture introduces additional complexity. Communication between components becomes dependent on networks, which introduces concerns such as timeouts, communication failures, authentication between services and more complicated testing. Deployment, configuration and monitoring would also become more demanding. These concerns would create additional work for the three-person CivicConnect team.
## 1.4 Comparison
|Consideration|Modular Layered Monolith|Distributed Architecture|
|---|---|---|
|Deployment|Single application|Multiple deployable components|
|Communication|Mainly in-process|Network/API/message based|
|Development complexity|Lower|Higher
|Testing complexity|Lower|Higher
|Infrastructure requirements|Lower|Higher
|Independent scaling|Limited|Strong
|Failure handling|Simpler|More complex
|Suitability for current team|High|Lower
|Future external integration|Possible|Stronger

Microsoft explains that communication within the same application avoids many of the additional concerns associated with distributed communication, while distributed approaches introduce network and operational considerations that need to be managed.

## 1.5 Architecture Recommendation
The recommended architecture for CivicConnect is a modular layered monolith. This provides the separation of responsibilities required by the M1 requirements without introducing the operational complexity of a distributed architecture.

The decision is mainly influenced by the current scope, the three-person development team and the lack of a requirement for independently deployed or independently scalable services. The architecture still allows the team to establish clear boundaries between request management, persistence and notification functionality through interfaces and well-defined responsibilities.

This does not mean that a distributed architecture has been rejected permanently. If future requirements introduce external consumers, independently scalable services or a need for separate deployment, the architecture can be reconsidered through the project's change-control and ADR process.

The selected architecture should be recorded in an architecture ADR and represented in the M2 architecture diagram. The repository structure should also reflect the logical responsibilities established by the architecture.

This choice directly satisfies NFR-002 (RBAC: enforced centrally rather than duplicated per service), NFR-009 (auditability: a single cross-cutting mechanism can intercept all status changes, per FR-010/FR-011), and NFR-010 (maintainability: layered boundaries achieve separation of concerns without the coordination overhead distributed deployment would add for a 3-person team).