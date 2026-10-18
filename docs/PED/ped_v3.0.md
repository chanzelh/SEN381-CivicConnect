# Project Engineering Document (PED)

## Version Three

**Milestone:** 3
**Date:** 2026/10/16
**Team:** Group L

## 1. Document Control

| Version | Date | Author(s) | Reviewed By | Status |
| --- | --- | --- | --- | --- |
| 1.0 | 2026/09/09 | Kaylee, Alyssa, Chanzél | All team members | Finished |
| 2.0 | 2026/09/29 | Kaylee, Alyssa, Chanzél | All team members | Finished |
| 3.0 | 2026/10/16 | Kaylee, Alyssa, Chanzél | All team members | Finished |

### 1.1 M3 Submission Baseline

- **Repository:** https://github.com/chanzelh/SEN381-CivicConnect
- **PED:** Version 3.0
- **Team:** Group L — Chanzél Hammond, Kaylee Hiralall, Alyssa Vieira
- **Exact M3 release commit/tag:** TO CONFIRM AFTER FINAL MERGE
- **RTM:** Existing RTM, updated in PR #121; confirm direct file path
- **CI/test evidence:** `.github/workflows/ci.yml` and `docs/Quality/test-evidence.md`
- **Staging/test access:** TO CONFIRM
- **Date submitted:** TO CONFIRM

The final demonstrated application, PED, RTM and evidence must refer to the same identified release candidate.

## 2. Problem Statement & Business Need

Unchanged from PED Version 1
The organization currently manages service requests through a fragmented system comprising email, telephone communications, WhatsApp, spreadsheets, and manual paper-based records. These requests encompass a broad range of operational matters, including facility faults, equipment damage, security concerns, IT support, maintenance requirements, and lost property.
This decentralized approach presents significant operational and information-management challenges. Requests are frequently subject to duplication, oversight, misallocation, or loss across disparate communication channels. Consequently, requesters lack visibility into the status of their submissions, while staff face difficulties in prioritizing tasks, establishing clear ownership, and coordinating effective resolutions.
The organization currently lacks reliable data regarding outstanding, overdue, and resolved tasks. Reporting processes are largely manual and inconsistent, impeding the establishment of clear accountability and the execution of robust audits. Furthermore, the reliance on informal communication channels for service requests introduces risks concerning the inconsistent handling of sensitive information. Consequently, there is no centralized, controlled system of recording to capture the comprehensive lifecycle of service requests.

### 2.1 Business Need

The organization requires a controlled digital platform to facilitate a reliable, traceable, and intuitive process for submitting, managing, monitoring, and reporting on service requests.
CivicConnect is intended to serve as a centralized environment for recording and managing service requests throughout their entire lifecycle. The system is expected to enhance transparency for requesters, establish clear ownership and prioritization protocols for staff, and provide management with access to robust service-performance analytics.
The proposed solution must deliver these improvements while ensuring technical feasibility, operational sustainability, and alignment with the project’s timeline and resource constraints.

### 2.2 Engineering Challenge

CivicConnect extends beyond a standard programming exercise; it necessitates the application of rigorous software engineering principles throughout the entire development lifecycle. This comprehensive process encompasses requirements engineering, the definition of quantifiable quality benchmarks, the evaluation of architectural and technological alternatives, the design of interfaces and persistence mechanisms, risk management, change control, systematic testing, and the integration of deployment and operational requirements.
Consequently, the team is tasked with translating the high-level business capabilities outlined in the project brief into a refined, testable set of requirements. Furthermore, team members must document all engineering decisions, ensuring they are substantiated by stakeholder requirements, project constraints, and technical considerations.
The proposed solution must deliver the intended enhancements while ensuring technical feasibility, operational sustainability, and alignment with the project’s allocated time and resources.

## 3. Stakeholder Analysis

Unchanged from PED Version 1

| Stakeholder | Interest/Need | Influence |
| :---: | :---: | :---: |
| Requesters | Need a simple way to submit requests and monitor their progress. | High |
| Service Staff | Need to access relevant requests, manage ownership and update request progress. | High |
| Management | Need reliable information regarding service activity, outstanding work and performance. | High |
| System Administrator | Needs to manage users, permissions and system configuration. | High |
| Project Team | Responsible for analyzing, designing, developing, testing and documenting the system. | High |
| Organization | Requires a reliable, secure and sustainable method of managing service requests. | High |

## 4. Scope Baseline

Unchanged from PED Version 1
The CivicConnect scope defines what the project is supposed to do, based on the time and resources that are available. The scope baseline sets a clear limit for the project so that new features aren't added unless their impact on the project is carefully thought through.

### 4.1 In Scope

CivicConnect's main focus is on handling every step of a service request from start to finish. Requesters can send new requests, give the right information, sort their requests into set categories, check the status of their requests, and look back at their past requests. They should also get useful feedback whenever their requests are approved, denied, changed, or finished.
Only authorized staff can access service requests that relate to their job duties. They can look up and sort through requests, see all the details about each request, take charge or hand it over to someone else, change the status of a request, and write down any actions taken, comments, or information about how the issue was resolved. When allowed, staff will also have the ability to fix and close requests.
Management tools will let you see important details about service activities. This includes being able to track requests that are still open, past due, already resolved, or completely closed. Management should also have the ability to see information organized by category, status, or other reasonable categories to help with holding people accountable and analyzing how well services are performing.
The engineering work also covers gathering and understanding requirements, designing how data will be stored and how different parts of the system will interact, evaluating the overall structure and the technologies to use, considering security issues, planning and carrying out tests, managing possible risks, keeping track of changes with version control, planning how to deploy the system, and creating proper documentation for the project.

### 4.2 Out of Scope

Features that aren't directly related to managing service requests will start off outside the project's focus. This includes other business management tasks like handling salaries, managing employees, taking care of finances, and overall planning for the whole business. If the project doesn't have enough time to properly plan, build, protect, check, write instructions for, and keep up with something that's too complex, then that part won't be included in the agreed-upon work. But if it's officially approved through the project's change-control process, it can be added.

### 4.3 Future / Optional Scope

Additional features might be looked into as part of the future or optional plans, but only if they clearly benefit the stakeholders involved. Future improvements could involve automatic alerts, linking to SMS or email, better management tools, access from a phone, automatic task sorting, and connecting with current company systems. These features will not be added automatically to the final system. Before adding anything new, it needs to be checked to see how it affects the project's size, timeline, budget, quality, security, and technical challenges.

## 5. Requirements

### 5.1 Functional Requirements

Unchanged from PED Version 1

| ID | Requirement | Source | Priority |
| :---: | :---: | :---: | :---: |
| FR-001 | The system shall allow a requester to submit a new service request. | Business Brief | High |
| FR-002 | The system shall allow a requester to categorize a service request using a controlled category mechanism. | Business Brief | High |
| FR-003 | The system shall allow requesters to view the current status of their submitted requests. | Business Brief | High |
| FR-004 | The system shall allow requesters to view previously submitted requests. | Business Brief | High |
| FR-005 | The system shall provide meaningful feedback when a request is accepted, rejected, updated or completed. | Business Brief | High |
| FR-006 | The system shall allow authorized staff to view relevant service requests. | Business Brief | High |
| FR-007 | The system shall allow authorized staff to search, filter and sort service requests. | Business Brief | High |
| FR-008 | The system shall allow authorized staff to view complete request details. | Business Brief | High |
| FR-009 | The system shall allow authorized staff to accept or assign responsibility for a request. | Business Brief | High |
| FR-010 | The system shall allow authorized staff to update request status through controlled transitions. | Business Brief | High |
| FR-011 | The system shall allow authorized staff to record relevant actions, comments and resolution information. | Business Brief | High |
| FR-012 | The system shall allow authorized staff to resolve or close requests where authorized. | Business Brief | High |
| FR-013 | The system shall provide management with useful service activity information. | Business Brief | High |
| FR-014 | The system shall allow management to identify open, overdue, resolved and closed requests. | Business Brief | High |
| FR-015 | The system shall provide request information by category, status or other justified dimensions. | Business Brief | High |

### 5.2 Non-Functional Requirements

Unchanged from PED Version 1

| ID | Requirement | Measurable Target |
| :---: | :---: | :---: |
| NFR-001 | Security – Authentication: The system shall require users to authenticate before accessing protected functionality. | 100% of protected pages/functions shall require successful authentication. Unauthenticated users attempting to access protected functionality shall be denied access. |
| NFR-002 | Security – Authorisation: Users shall only access functionality and information appropriate to their role. | 100% of tested role-based access scenarios shall prevent unauthorised access. Requesters shall not be able to access staff or management functionality. |
| NFR-003 | Security – Data Protection: Sensitive information shall be protected from unauthorised disclosure. | Sensitive data shall not be exposed in URLs, client-side logs, or application error messages, and all production communication shall use HTTPS. |
| NFR-004 | Security – Secrets Management: Credentials and secrets shall not be stored in source control. | 0 passwords, API keys, connection strings containing credentials, or other secrets shall be committed to the GitHub repository. |
| NFR-005 | Performance: The system shall respond promptly to normal user actions. | At least 95% of normal user requests shall receive a response within 2 seconds under the defined test load. |
| NFR-006 | Usability: Users shall be able to complete common tasks without unnecessary complexity. | At least 80% of representative test users shall successfully complete key tasks such as submitting and checking a request without assistance. |
| NFR-007 | Reliability: The system shall correctly maintain service request information. | During functional testing, 100% of successfully submitted requests shall be stored with all required fields and remain retrievable after the transaction is completed. |
| NFR-008 | Availability: The deployed system shall be accessible during its intended operating period. | The system shall achieve at least 99% availability during the defined testing/deployment period, excluding planned maintenance. |
| NFR-009 | Auditability: Important request changes shall be traceable. | 100% of tested status changes, assignments and resolution actions shall record the user, action and timestamp. |
| NFR-010 | Maintainability: The system shall be structured so that changes can be made without unnecessarily affecting unrelated functionality. | All implemented features shall follow the agreed project architecture and coding standards, and 100% of merged changes shall pass the project's automated tests/checks before merging into main. |
| NFR-011 | Data Integrity: The system shall prevent invalid or incomplete data from being stored. | 100% of tested mandatory-field and validation rules shall reject invalid input and provide an appropriate error message. |
| NFR-012 | Compatibility: The system shall work on commonly used modern browsers. | All core functionality shall successfully operate on the latest versions of Chrome, Edge and Firefox during compatibility testing. |
| NFR-013 | Scalability: The system should support the expected level of concurrent use without unacceptable degradation. | The system shall support at least 50 concurrent users while maintaining the agreed 2-second response target for 95% of normal requests. |
| NFR-014 | Recoverability: The system shall allow service data to be recovered following a failure. | A database backup shall be created according to the agreed backup schedule, and a test restoration shall successfully recover 100% of the selected test backup data. |

## 6. Assumptions & Constraints

Unchanged from PED Version 1
The project depends on certain assumptions and limitations that will affect how the engineering choices are made. The team is made up of exactly three students and needs to complete the project by reaching four official milestones during the SEN381 timeframe. The amount of functionality that can be delivered is limited by the time and resources that are available. The project should use free or low-cost tools and services whenever possible, but it should also recognize any limits and extra costs that might come up outside of teaching. The scope that is already agreed upon needs to be carefully managed, and any new features should not be added in a way that causes the scope to grow uncontrollably. The project also assumes that the right people will be there to give the needed information about what is required and to check if the proposed solution works. It is assumed that users have the computer or network setup needed to use the final system. Security and quality are considered important responsibilities that are taken care of throughout the entire lifecycle. So, decisions about security, quality, how the system is built, and the technology used needed to be made during the whole project, not just left until the end when we’re testing or putting it into use.

## 7. Architecturally Significant Requirements & Quality Drivers

The team's has gone through all the functional and non-functional requirements that have been specified during Milestone 1. All the requirements that are architecturally significant have been identified (FR-005, Fr-006, FR-009, FR-010, FR-011, FR-013, FR-014, NFR-001, NFR-002, NFR0-003, NFR-004, NFR-005, NFR-007, NFR-009, NFR-010, NFR-013, NFR-014). The quality drivers have also been identified as Security, Audatibility and Maintainability.

Full explanation and reasoning can be found in: `docs/Architecture/asrs-quality-drivers.md`

## 8. Architecture Alternatives & Selection

In order for the team to be able to balance distinct workflows against the necessary strict security, maintainability and auditability, the team had to evaluate a modular monolith architecture vs a distributed architecture. The distributed architecture did offer independent deployment and scaling but it did bring heavy network costs and operational and testing overhead which was unfeasible for a 3-person team. The team did decide on the modular monolith architecture which would enforce separation of concerns and centralized auditing through the internal interfaces whilst still keeping the maintenance and deployment simple.

Full explanation and reasoning can be found in: `docs/Architecture/architecture-alternatives/md`

## 9. Architecture Diagrams

The CivicConnect architecture is represented by the following diagrams that can be found in `docs/Architecture/Diagrams/`:

- **`Modular Layered Monolith Architecture.png`:** Showcases the four-layered architecture and the responsibilities assigned to each layer.
- **`Management Flowchart.png`:** The management task sequence from login through dashboard filtering, reviewing the request overview, and read-only request detail (FR-013–FR-015).
- **`Requester Flowchart.png`:** The requester's sequence of tasks from the login to giving a new request up until finalising.
- **`Staff Flowchart.png`:** The staff task sequence from login through search/filter, assignment, status update, and the resolve-before-close rule

## 10. Technology Stack Decision

The technology stack was evaluated against the technical needs of CivicConnect rather than selecting a stack based mainly on team familiarity. The criteria were weighted according to their importance to the system.

| Criterion | Weight | PERN | MERN | React + ASP.NET Core + PostgreSQL |
| --- | ---: | ---: | ---: | ---: |
| Data relationships & integrity | 25% | 5 | 3 | 5 |
| Request updates & audit history | 20% | 5 | 4 | 5 |
| Reporting & filtering | 15% | 5 | 4 | 5 |
| Security integration | 15% | 4 | 4 | 5 |
| Backend structure & maintainability | 15% | 4 | 4 | 5 |
| Language & development simplicity | 10% | 5 | 5 | 4 |
| **Weighted Total** | **100%** | **4.70 / 5** | **3.85 / 5** | **4.90 / 5** |

### 10.1 Decision

**Selected stack: PERN (PostgreSQL, Express, React and Node.js).**

The evaluation showed that React + ASP.NET Core + PostgreSQL achieved the highest technical score at **4.90/5**, with PERN close behind at **4.70/5**.

Although ASP.NET Core scored slightly higher, the difference was not considered large enough to justify changing the existing technical direction of the project. PERN still meets the main CivicConnect requirements, including relational data handling, request tracking, reporting and audit history.

Changing the backend technology at this stage would also introduce additional implementation and integration work and increase delivery risk. PERN allows the application to use JavaScript across the frontend and backend while PostgreSQL provides the relational data capabilities required by CivicConnect.

The team therefore decided to retain PERN as the most appropriate overall option when both technical suitability and the consequences of changing the current project baseline were considered.

This decision and its supporting evaluation are recorded in the Decision Log.

## 11. Data Persistence Design

CivicConnect will use a relational database with PostgreSQL for data persistence. The main data will include service requests, users, categories and request history. A relational database was selected because these entities have clear relationships and the system needs to maintain consistent links between them.

PostgreSQL also supports constraints and transactions, which will help prevent invalid data and ensure that important changes, such as a status update and its history record, are saved consistently. This approach provides the reliability and auditability required by CivicConnect while remaining suitable for the current project scope.

The full data design, including the alternatives considered, data model, validation, transactions and concurrency considerations, is documented in `docs/Architecture/data-design.md`.

## 12. UI Design & Wireframes

Eight wireframes were produced covering the core flows: Login, Submit New Request (including a validation-error state), Requester Dashboard, Requester Request Detail, Staff Dashboard, Staff Request Detail and Actions, and Management Dashboard. Each is traced to specific FRs/NFRs in the wireframe and traceability tables.

Full detail, rationale and the wireframe images themselves are in `docs/Architecture/ui-design.md` and `docs/Architecture/Wireframes/`.

## 13. API Contracts

CivicConnect will use a REST API at the application boundary to allow the requester, staff and management interfaces to communicate with the application. Initial endpoints will support actions such as creating requests, viewing requests, searching and filtering requests, updating statuses and adding comments or actions.

For communication between internal modules, the system will use in-process interfaces rather than REST. For example, the Request Management module can communicate with the Notification Service through an INotificationService interface. This was selected because CivicConnect is a modular layered monolith and the internal modules do not currently need to be independently deployed. It provides separation between modules without adding unnecessary network communication and complexity, while still leaving room to introduce external REST integrations if the system requires them later.

The full API and integration analysis, including the alternatives considered, endpoint definitions and internal interface approach, is documented in `docs/Architecture/api-contracts.md`.


## 14. Design Principles & Avoidance of Unnecessary Complexity

The Milestone 2 design choices were guided by the principle below (as evidenced by DC-004 and DEC-005 as well):

- **Deliberately rejected complexity:** The distributed system (highlighted in DEC-004) and the HTTP/REST and asynchronous messaging for internal notification integration (highlighted in `api-contracts/md`) were all considered by deliberately rejected due to unnecessary complexity. Each rejection was also supported by the current requirements not needing any of those features/software.
- **Seperation of concerns over premature distribution:** The modular layered monolith (DEC-004) that was chosen can achieve the clear boundaries needed such as presentation, application, domain and infrastructure responsibilites. This is done without having to introduce network boundaries that the team does not need currently (NFR-010).
- **Choosing familiarity over theoretical flexibility:** DEC-005 outlines the selection of Node.js over .NET despite both stacks scoring similarly on requirements fit. This decision was because team capability and schedule risk were weighted explicitly.

## 15. Requirements Traceability Matrix (RTM) — Version Two

The Design / Component column has been updated to reflect the selected architecture, data design and interfaces. These components describe the planned design. GitHub issue, test and status fields retain their previous values until supporting evidence is available.

| Req ID | Requirement | Design / Component | GitHub Issue / PR | Test | Status |
| --- | --- | --- | --- | --- | --- |
| FR-001 | Submit a new service request | Requester UI → Request Management service → Service Request repository | TBD | TBD | Baselined |
| FR-002 | Categorize a service request | Requester UI → Category lookup → Service Request and Category data | TBD | TBD | Baselined |
| FR-003 | View current request status | Requester dashboard → authorised Request Management read service → Service Request data | TBD | TBD | Baselined |
| FR-004 | View previously submitted requests | Requester dashboard → Request History read service → Service Request and Request History data | TBD | TBD | Baselined |
| FR-005 | Receive feedback on request updates | Request Workflow service → in-process Notification interface → requester feedback. Notification failure handling remains to be finalised. | TBD | TBD | Baselined |
| FR-006 | Staff view relevant requests | Staff dashboard → server-side Authorisation component → Request Management read service | TBD | TBD | Baselined |
| FR-007 | Search, filter and sort requests | Staff dashboard → Request Management query service → Service Request and Category data | TBD | TBD | Baselined |
| FR-008 | Staff view complete request details | Staff detail UI → authorised Request Management read service → Service Request and Request History data | TBD | TBD | Baselined |
| FR-009 | Accept or assign responsibility | Assignment/Request Workflow service → Service Request assignment and history. Assignment history model remains to be finalised. | TBD | TBD | Baselined |
| FR-010 | Update request status through controlled transitions | Request Workflow service validates transitions → Service Request update and Request History entry saved in one database transaction | TBD | TBD | Baselined |
| FR-011 | Record actions, comments and resolution information | Staff detail UI → Request History service → append-only Request History data | TBD | TBD | Baselined |
| FR-012 | Resolve or close requests | Request Workflow service checks permissions and transitions → Service Request and Request History updated in one database transaction | TBD | TBD | Baselined |
| FR-013 | Provide management with service activity information | Management dashboard → Reporting read service → Service Request and Category data | TBD | TBD | Baselined |
| FR-014 | Identify open, overdue, resolved and closed requests | Reporting service → management dashboard. A consistent rule for identifying overdue requests remains to be finalised. | TBD | TBD | Baselined |
| FR-015 | Provide request information by category, status and other dimensions | Reporting query service → Service Request and Category data → management dashboard | TBD | TBD | Baselined |
| NFR-001 | Authentication | Authentication/Identity component → protected server routes | TBD | TBD | Baselined |
| NFR-002 | Role-based authorisation | Central server-side Authorisation component for request and reporting operations | TBD | TBD | Baselined |
| NFR-003 | Sensitive data protection | API response handling, error handling and logging controls; HTTPS configuration for deployment | TBD | TBD | Baselined |
| NFR-004 | Secrets management | Runtime/environment configuration and repository controls | TBD | TBD | Baselined |
| NFR-005 | Response performance | Request Management and Reporting query services; database query and index design | TBD | TBD | Baselined |
| NFR-006 | Usability | Requester, staff and management UI flows with clear validation feedback | TBD | TBD | Baselined |
| NFR-007 | Reliability | Request Management service → PostgreSQL transactions → Service Request repository | TBD | TBD | Baselined |
| NFR-008 | Availability | Application and PostgreSQL hosting arrangement. Deployment details remain to be finalised. | TBD | TBD | Baselined |
| NFR-009 | Auditability | Request Workflow and Assignment services → Request History saved in the same transaction as key changes | TBD | TBD | Baselined |
| NFR-010 | Maintainability | Presentation, application and persistence layers; separated identity, request, notification and reporting responsibilities | TBD | TBD | Baselined |
| NFR-011 | Data integrity | UI validation, application business rules and PostgreSQL constraints and transactions | TBD | TBD | Baselined |
| NFR-012 | Browser compatibility | Web UI across requester, staff and management views | TBD | TBD | Baselined |
| NFR-013 | Scalability | Application deployment and indexed request/report queries. Load testing remains pending. | TBD | TBD | Baselined |
| NFR-014 | Recoverability | PostgreSQL backup and restore process. Backup schedule and deployment environment remain to be finalised. | TBD | TBD | Baselined |

## 16. Risk Register — Version Two

The Risk Register has been updated for Milestone Two. Existing risks
RISK-001–007 and their original dates have been retained.

The following risks were identified during the design work:

- RISK-008: Request status changes may be saved without corresponding history.
- RISK-009: Concurrent staff updates may overwrite assignment or status changes.
- RISK-010: Notification failures may prevent requesters from receiving feedback.
- RISK-011: Reporting may be slow or produce inconsistent overdue counts.
- RISK-012: Direct data access between modules may create excessive coupling.

See the [Risk Register — Version Two](../Risk/risk-register.md)
for risk ratings, mitigation actions, contingencies, owners and status.

## 17. Engineering Decision Log — Version Two

| Decision ID | Context | Constraints | Alternatives Considered | Decision | Rationale | Trade-offs | Risks | Evidence | Later Consequence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DEC-001 | The team required a controlled platform for version control, collaboration and maintaining evidence of project changes. | The project is completed by a three-person team and requires collaboration, traceability and controlled management of changes throughout the milestones. | GitHub; alternative repository/version-control platforms; managing and sharing files manually. | Use GitHub as the main version-control and collaboration platform for CivicConnect. | GitHub provides version control, branches, issues, pull requests, reviews and project history in one environment. These features allow the team to collaborate while maintaining evidence of how project artefacts change over time. | Using GitHub introduces additional process compared with simply sharing files. Team members must understand and consistently follow the agreed workflow. | Incorrect branch use, merge conflicts, outdated local versions or accidental changes could affect project artefacts if the workflow is not followed correctly. | CivicConnect GitHub repository, project issues, branches and pull-request history. | To be reviewed and updated in later milestones. |
| DEC-002 | The team needed a controlled method for making changes to shared CivicConnect project artefacts without directly changing the approved main version. | Multiple team members may work on different tasks at the same time, and changes need to be reviewed before becoming part of the main project baseline. | Editing directly on the main branch; using one shared development branch; using separate task branches with pull requests. | Use separate branches for assigned tasks and merge changes into main through pull requests after peer review. | Separate branches allow team members to work independently without immediately affecting main. Pull requests provide an opportunity for other team members to review changes and create evidence of what was changed and approved. | The process takes more time than editing main directly and may require merge conflicts or requested changes to be resolved before work can be merged. | Poor branch management or failure to update from the latest approved version may result in conflicting or outdated changes. | GitHub issue branches, pull requests and review history. | To be reviewed and updated in later milestones. |
| DEC-003 | The team needed a way to organise Milestone work and make responsibility and progress visible. | CivicConnect is completed by a three-person team across multiple milestones, with tasks depending on different team members and requiring review before completion. | Informal task allocation through messages; a separate task list; GitHub Issues and the project Kanban board. | Use GitHub Issues and the project Kanban board to assign and track project work. | Issues provide a clear record of individual tasks and ownership, while the Kanban board allows the team to see which work is outstanding, in progress, under review or completed. This also keeps task evidence connected to the project repository. | Team members must keep issue and project statuses updated for the board to accurately represent project progress. | If issues or statuses are not maintained, the board may not accurately show project progress and tasks could be overlooked. | GitHub Issues and the CivicConnect project Kanban board. | To be reviewed and updated in later milestones. |
| DEC-004 | CivicConnect needs an architecture supporting distinct requester/management/staff responsibilities whilst still meeting the auditability, security and maintainability requirements baselined in M1 | 3-person team, one semester timeline, free/low cost hosting preference, no requirement for independent scaling/deployment of any individual functions | Modular layered monolith (single deployable app, logical module separation via interfaces) and Distributed Architecture (independently deployable services communicating via API or messaging) | Modular layered monolith | This decision satisfies the NFR-002, NFR-009, NFR-010 without having the network/operational overhead that a 3-person team won't be able to sustain, no current requirement also justifies the distributed complexity | Gives up independent scaling/deployment of individual functions. If load also becomes uneven then components can't be scaled separately | If a future requirement does introduce external consumers or scaling needs, if this decision gets revisited mid-project then it would require a formal change request and rework | Can be found in: `docs/Architecture/architecture-alternatives.md` | TBD |
| DEC-005 | A technology stack was required for the modular layered monolith (DEC-004) that would fit the team's identified schedule, capability and ASRs | Must support selected architecture, one semester timeline, free/low cost, 3-person team | Option 1: .NET (C#, ASP.NET Core, PostgreSQL, EF Core). Option 2: Node.js (Express, PostgreSQL) | Node.js with Express and PostgreSQL | Weighted decision matrix has scored the Node.js 4.30/5 against the .NET's 4.00/5. This higher score was mainly driven by higher team capability and schedule scores. The team has also found greater comfort with Node.js for REST API development, which reduces implementation and learning risk | Does sacrifice some of the team's prior learning of .NET/C# | Team unfamiliarity with the specific Node.js patterns could cause delays despite having a higher comfort score. | `docs/Architecture/tech-stack-decision-matrix.md` | TBD |

## 18. Process & Team Working Agreement

The team's working agreement and process outline has been documented within the official Team Working Agreement: `docs/Decisions/team-working-agreement.md`.

## 19. GitHub Governance

The CiviConnect Repository of Group L has been configured with the following controls:

- **Repository:** There is one controlled team repository  (SEN381-CivicConnect), public (for ease of marking for lecturers), and with all three team members added in as collaborators.
- **Main Branch Protection:** The 'main' branch is protected by making use of a GitHub Ruleset which outlines the requirement of pull requests before merging, each pull requests needs a minimum of 2 approving reviews (self-approval is not permitted). Stale approvals are dismissed automatically when new commits are pushed.
- **Direct Commits to The Main:** Force pushes to the 'main' branch are blocked and not permitted. Any and all changes must go through a feature branch and Pull Request.
- **Issues and Project Board:** The Milestone 1 work and tasks are tracked via making use of GitHub issues which are linked to a Kanban style Project Board (Backlog / In Progress / In Review / Done). PRs reference these issues by using "Closes #X" so merged work automatically updates the issues' state so team can track progress.
- **Secrets:** No credentials, API keys or confidential material have been committed. A `.gitignore` file has been added to the folder structure.
- **Folder structure:** The project has controlled documentation which is strategically organised under `docs/` within the GitHub repository. (PED, Requirements, Risk, Decisions), following the  suggested structure in Appendix C of the Master Project Brief. With added folders such as the flowcharts and wireframes, seperate folders have been created to ensure that everything has been organised for the entire team.
**M2 addition:** A `docs/Architecture/` folder was added, containing architecture diagrams and flowcharts (`Diagrams/`), UI wireframes (`Wireframes/`), and the M2 decision-support documents (ASRs, architecture alternatives, technology-stack decision matrix, data design, UI design, API contracts). This extends the M1 folder structure without changing its governance controls.

## 20. AI Usage Register

All the material that were AI-assisted across the project are recorded in:
`docs/PED/ai-usage-register.md`

## 21. Deployment/Operational Considerations (Milestone 2 Update)

The technology stack (Node.js, Express, PostgreSQL) has now been chosen. The deployment planning has shifted from general intent to more stack-specific considerations:

- **Runtime hosting:** candidate free-tier platforms suitable for a Node.js/Express application (e.g. Render, Railway) have been identified but not yet formally evaluated against cost, uptime and configuration limits. Formal selection with evidence is deferred to Milestone 3, consistent with Brief Section 17's environment standard.
- **Database hosting:** PostgreSQL requires a managed or self-hosted instance; free-tier providers (e.g. Supabase, Neon, Railway) are candidates, pending the same evaluation.
- **Secrets management:** environment variables will be used for configuration and credentials, excluded from source control via `.gitignore` (NFR-004). No secrets have been committed to date.
- **Backup/recovery (NFR-014):** dependent on the final database hosting choice; the team will confirm the provider's backup capability and test a restoration before this can be marked complete. Not yet verified.
- **Environments:** development is local per team member; staging and production environment setup is planned for Milestone 3, per Brief Section 17.

This section will be finalised with concrete evidence in PED V3.

**Milestone 2 Baseline Sign-Off (Historical)**

| Field | Value |
| --- | --- |
| Updated PED Reviewed | YES - scope has been reviewed and approved by all team members via a pull request. |
| Diagrams and Flowcharts approved | YES |
| Wireframes Reviewed | YES - discussed and approved by all team members |
| Api Contracts Agreed | YES |
| Chosen Architecture and Tech Stack | YES - all decisions were discussed and approved by all members |
| Updated Risks | YES - Accepted by team |
| Outcome | ACCEPTED by entire team |

---

**Milestone 3 — Implementation, Verification and Release Evidence**

## 22. M2 Baseline Conformance and Controlled Changes

| Area | M2 baseline | M3 evidence or difference | Interpretation |
| --- | --- | --- | --- |
| Architecture | Modular layered monolith | Retained in implementation | Conforms |
| Stack | PERN | PostgreSQL/Express/React/Node | Conforms |
| Persistence | Relational schema, transactions | SQL schema/seed; transactional request/history updates | Core direction implemented |
| Status workflow | Submitted, Accepted, Rejected, In Progress, Resolved, Closed | Open, Pending, Assigned, In Progress, On Hold, Resolved, Closed | Significant change; DEC-007 |
| Audit history | Atomic change/history writes | Transaction integration tests TC-I04/I05 | Supported by evidence |
| API prefix | `/api/v1` | `/api` | Deviation; TD-006 |
| API errors | Structured errors | General `{ message }` responses | Deviation; TD-006 |
| Concurrency | Stale update rejection | Not implemented | TD-004; residual risk |
| Notifications | Failure recovery/retry | No automatic retry | TD-005; residual risk |
| Overdue reporting | Backend calculation | Client-side calculation | TD-002 |

The team should confirm that the [Decision Log](../Decisions/decision-log.md) contains adequate records for significant deviations. These differences must not be hidden or represented as full conformance.

## 23. Construction and Configuration Management

The M3 increment implements the main requester, staff and management workflows. The application separates frontend UI, backend routes/controllers, models, middleware and data persistence. PostgreSQL stores users, requests, categories and history. Protected routes and role checks support access control.

`CivicConnectCode/server/db/schema.sql` and `seed.sql` provide reviewable, repeatable database setup. The earlier seed portability issue was corrected through PR #99.

Development uses task branches and reviewed PRs. Environment-specific credentials are kept outside committed source and scanned using gitleaks. The precise release commit/tag must be identified only after the final baseline is agreed.

## 24. Continuous Integration and Automated Verification

The GitHub Actions workflow at `.github/workflows/ci.yml` runs the required `build-and-test` check. Recorded stages include:

- Secret scanning (gitleaks).
- Lockfile-based dependency installation and dependency auditing.
- Backend/frontend linting and frontend build.
- PostgreSQL 16 service setup with schema and seed.
- Automated backend/client tests and coverage output.

The required check protects `main` alongside two non-author PR approvals. PR #100 demonstrated a deliberately failing test blocking progression. PR #99 records a genuine portability issue found and corrected through CI.

**Interpretation:** Passing CI supports build/test health for configured checks; it does not establish production security, usability, availability, recoverability or deployment readiness.

Evidence: [CI pipeline](../Quality/ci-pipeline.md).

## 25. Quality Strategy and Testing

Testing prioritised high-impact risks: authentication, role-based authorisation, request state rules, assignments, database integrity, audit history and critical user journeys.

| Level | Recorded cases | Purpose |
| --- | --- | --- |
| Unit/component | TC-U01–TC-U05 | Status, overdue rules, roles, due dates, notification failure |
| Black-box functional | TC-B01, B02, B03, B05, B06 | Input validity, boundary cases and state transitions |
| API/integration | TC-I01–I05, I08 | Authentication, permissions, persistence, assignment/history and rollback |
| End-to-end | TC-E01, TC-E02 | Critical requester and staff/management journeys |
| Performance | TC-P01 | Request-list load behaviour |

At least two appropriate black-box design techniques must be evidenced. The selected cases use input equivalence/boundaries and workflow state transitions where relevant. Negative/unauthorised cases and high-priority requirements should be identified explicitly in the [Test Evidence](../Quality/test-evidence.md) and RTM.

Recorded E2E cases passed in Chromium, Firefox and Edge. TC-I07 (stale-update rejection) is not claimed as passed because optimistic concurrency was not implemented.

### 25.1 Coverage Interpretation

Server line coverage was recorded at **50.4%** and branch coverage at **35.6%**. Status rules had 100% line coverage, authentication middleware 84%, request model 74.2%, authentication controller 16.7% and notification controller 4.5%.

This is useful for identifying gaps, not proof of correctness. More API-level tests are required (TD-007). Browser E2E results are separate from server coverage percentages.

Evidence: [Test plan](../Quality/test-plan.md), [Test evidence](../Quality/test-evidence.md), [Coverage report](../Quality/coverage-report.md).

## 26. Performance, Static Analysis and Security

### 26.1 Performance Test TC-P01

The team used k6 to test authenticated `GET /api/requests` with **50 virtual users for one minute**. The recorded run produced **2,950 requests**, **0% failures** and **52.92 ms p95 response time**.

This passed the stated local thresholds relevant to NFR-005 and NFR-013. The test was run locally; it does **not** demonstrate production-scale municipal performance, all endpoint performance or 99% availability.

Evidence: [k6 script](../../CivicConnectCode/performance/tc-p01.k6.js), [results](../../CivicConnectCode/performance/tc-p01-result.txt), [PR #120](https://github.com/chanzelh/SEN381-CivicConnect/pull/120).

### 26.2 Static Analysis and Security

ESLint and project conventions help detect maintainability issues and inappropriate code patterns. Gitleaks and dependency auditing support secrets and dependency hygiene. The recorded production dependency audit identified no shipped-package vulnerabilities, and the recorded gitleaks scan found no leaked secrets; neither result proves the absence of every vulnerability.

The STRIDE-oriented threat review considers identity, role boundaries, tampering, disclosure, availability and sessions. Controls include signed tokens, role checks, parameterised database queries, transaction-based history and controlled workflow transitions. Login rate limiting and session revocation remain concerns.

Evidence: [Static analysis](../Quality/static-analysis.md), [Security scanning](../Quality/security-scanning.md), [Threat review](../Quality/threat-review.md).

## 27. Defects and Technical Debt

Defects were identified through automated tests, CI, review and static analysis. Important fixes include seed portability, transition validation, audit-history transaction integrity, due-date handling, route protection and removal of debug output.

**Record discrepancy:** The [Defect Register](../Quality/defect-register.md) summary reports eight defects, while detailed entries extend to DEF-009. The team must reconcile counts and status before final sign-off.

| Debt ID | Deferred issue | Consequence |
| --- | --- | --- |
| TD-001 | No versioned database migrations | Schema changes harder to deploy/reverse |
| TD-002 | Client-side overdue calculation | Potential inconsistency between clients |
| TD-003 | React refactoring/lint concerns | Maintainability cost |
| TD-004 | No stale-update version checking | Concurrent edits may overwrite changes |
| TD-005 | No notification retry | Feedback can be lost on failure |
| TD-006 | API/status contract differences | Integration/documentation mismatch |
| TD-007 | Limited API-level test coverage | Untested failure paths |

Evidence: [Technical Debt Register](../Quality/technical-debt-register.md), [Defect Register](../Quality/defect-register.md).

## 28. Release Evidence Summary and Readiness Decision

### 28.1 Release Evidence Summary

| Evidence area | Recorded result | Interpretation / remaining concern |
| --- | --- | --- |
| Build and CI | Required checks configured; gate behaviour demonstrated | Confirm final release commit run |
| Automated regression | Unit and functional evidence recorded | Uneven API/controller coverage |
| API/integration | Authentication, role, persistence and transaction cases recorded | Concurrency remains unimplemented |
| System/E2E | TC-E01/E02 passed across three browsers | Confirm run against identified staging build |
| Static/security | Scanning and threat review recorded | Rate limiting/session risk remains |
| Performance | TC-P01 passed locally | Not production-scale evidence |
| Defects | Register maintained | Counts require reconciliation |
| Traceability | RTM evolved via PR #121 | Confirm direct file path and final statuses |
| Staging | Not independently verified for this document | Record URL or simulated-staging procedure |
| Backup/recovery | Not independently verified | Demonstrate restore against selected backup |
| Usability NFR-006 | Not independently verified | Representative-user evidence required |
| Availability NFR-008 | Not independently verified | Defined observation period and result required |

### 28.2 Readiness Classification

**Provisional classification: NOT READY.**

The project has meaningful construction and test evidence, but this document cannot confirm all release-critical operational evidence or reconcile the register inconsistencies. This is a conservative evidence-based assessment, **not** a statement that the software is unusable. The team may reassess to CONDITIONALLY READY or READY when required checks, staging, known blockers and residual risks have been reviewed against the actual release candidate.

### 28.3 Residual Risks

| Risk | Why it remains | Current control | Next action / owner |
| --- | --- | --- | --- |
| RISK-009 | Concurrent edits may overwrite a newer update | Controlled workflow, transaction integrity | Implement optimistic locking / development team |
| RISK-010 | Notification failures may not retry | Error handling and testing | Retry/recovery design / development team |
| RISK-015 (threat review) | Login attempts may be brute-forced | Authentication checks | Rate limiting / development team |
| RISK-016 (threat review) | Stolen token can remain usable until expiry | Token expiry and protected routes | Session revocation review / development team |

**ID warning:** RISK-013/014 conflict with the separate Risk Register descriptions. Resolve the IDs and confirm named owners before final approval.

### 28.4 Staging and Recovery

A real cloud environment is **not required** by the M3 brief. The team may demonstrate a credible simulated staging environment with configuration separate from normal development, protected secrets, a clearly identified build, critical E2E verification and rollback/recovery instructions.

Evidence still to confirm: [staging/HTTPS #80](https://github.com/chanzelh/SEN381-CivicConnect/issues/80), [rollback #81](https://github.com/chanzelh/SEN381-CivicConnect/issues/81), [health #82](https://github.com/chanzelh/SEN381-CivicConnect/issues/82), [backup #83](https://github.com/chanzelh/SEN381-CivicConnect/issues/83), [usability #88](https://github.com/chanzelh/SEN381-CivicConnect/issues/88), [availability #89](https://github.com/chanzelh/SEN381-CivicConnect/issues/89).

## 29. Evidence Index and Final Review

| Engineering claim | Controlled evidence |
| --- | --- |
| Original requirements and design baseline | PED Sections 2–21; `docs/Architecture/` |
| Evolving requirement trace | Existing RTM; PR #121 |
| Decision and change control | [Decision Log](../Decisions/decision-log.md) |
| Construction and PR review | GitHub branch, PR and commit history |
| CI gate and configuration | `.github/workflows/ci.yml`; [CI evidence](../Quality/ci-pipeline.md) |
| Verification approach | [Test Plan](../Quality/test-plan.md) |
| Executed functional/API/E2E tests | [Test Evidence](../Quality/test-evidence.md) |
| Coverage and gaps | [Coverage Report](../Quality/coverage-report.md) |
| Performance | [TC-P01 result](../../CivicConnectCode/performance/tc-p01-result.txt) |
| Static analysis | [Static Analysis](../Quality/static-analysis.md) |
| Security checks | [Security Scanning](../Quality/security-scanning.md) |
| Threats | [Threat Review](../Quality/threat-review.md) |
| Defects | [Defect Register](../Quality/defect-register.md) |
| Technical debt | [Technical Debt Register](../Quality/technical-debt-register.md) |
| Risks | [Risk Register](../Risk/risk-register.md) |
| AI assistance | [AI Usage Register](ai-usage-register.md) |
| Staging/release | Issues #80–83, #88–89; final staging evidence to confirm |

## 30. Database Development and Application Integration — Milestone 3

### 30.1 Database Development

CivicConnect uses PostgreSQL to store application data. During Milestone 3, the database was integrated with the backend to support the main requester, staff and management workflows.

The implemented database contains five main tables:

| Table | Purpose |
| --- | --- |
| `users` | Stores registered user details, password hashes and user roles. |
| `service_requests` | Stores submitted requests, their categories, statuses, requester details and staff assignments. |
| `request_comments` | Stores comments associated with requests and the users who created them. |
| `request_status_history` | Records request status and assignment activity to support auditability. |
| `notifications` | Stores user notifications and their read status. |

The database schema is maintained in `CivicConnectCode/server/db/schema.sql`.

### 30.2 Database Relationships

The database uses primary keys and foreign keys to connect related records.

Each service request is linked to its requester and may also be assigned to a staff member. Comments and status-history entries are associated with the relevant request, while notifications are associated with their recipients.

These relationships help maintain data integrity and avoid unnecessary duplication.

### 30.3 Implemented Application Functionality

The React frontend communicates with a Node.js and Express backend, which accesses the PostgreSQL database.

The main functionality includes:

- **Authentication:** Users can register and log in. Protected backend endpoints verify authentication tokens and apply role-based access restrictions.
- **Requester functionality:** Requesters can submit service requests and view their existing requests and statuses.
- **Staff functionality:** Authorised staff can access assigned requests, add comments and update request statuses according to the implemented workflow.
- **Management functionality:** Management can view requests, assign staff members, set due dates and monitor request activity.
- **Notifications:** The system stores notifications associated with relevant request activity and makes them available to users.

### 30.4 Backend and Database Integration

The backend separates responsibilities between routes, controllers, models and middleware.

Routes define API endpoints. Controllers handle requests and validation. Models execute database operations, while middleware handles authentication and access control.

For example, when a requester submits a service request, the frontend sends the request to `POST /api/requests`. The `createMyRequest` controller processes it and calls `createRequest` to save the information in PostgreSQL.

This structure supports maintainability by separating application logic from database operations.

### 30.5 Validation, Security and Data Integrity

The implementation includes authentication checks, role-based access restrictions, parameterised database queries and password hashing.

Controlled status transitions prevent invalid workflow changes. Status updates and their history records are also handled transactionally to avoid saving incomplete changes.

Some limitations remain documented, including incomplete validation of optional date fields, missing stale-update protection and notification retry functionality. These are tracked in the defect and technical debt registers.

### 30.6 Testing and Verification

The team tested the database and application integration using automated unit, API/integration and end-to-end tests.

| Test | Verified functionality |
| --- | --- |
| TC-I03 | Submitted requests are stored and can be retrieved. |
| TC-I04 | Staff assignments create the required history records. |
| TC-I05 | Database changes are rolled back when a history write fails. |
| TC-E01 | Requester submission and request viewing workflow. |
| TC-E02 | Staff and management assignment, comments, status changes and requester updates. |

These tests provide evidence that the frontend, backend and database work together for the tested workflows.

However, the automated test coverage is not complete. Dedicated API testing for signup, comments, notification endpoints and certain cross-user access scenarios remains outstanding.

The complete testing evidence is recorded in `docs/Quality/test-evidence.md`, with outstanding gaps documented in `docs/Quality/coverage-report.md` and `docs/Quality/technical-debt-register.md`.

### 30.7 Supporting Evidence

- Database schema: `CivicConnectCode/server/db/schema.sql`
- Requirements and RTM: `docs/Requirements/requirements.md`
- Test evidence: `docs/Quality/test-evidence.md`
- Coverage report: `docs/Quality/coverage-report.md`
- Technical debt: `docs/Quality/technical-debt-register.md`
- Decision log: `docs/Decisions/decision-log.md`
