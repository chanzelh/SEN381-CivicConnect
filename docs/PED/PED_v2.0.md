# Project Engineering Document (PED)
# Version Two

**Milestone 2:**  
**Date:** 2026/09/30
**Team:** Group L

## 1. Document Control
| Version | Date | Author(s) | Reviewed By | Status |
|---|---|---|---|---|
| 1.0 | 2026/09/09 | Kaylee, Alyssa, Chanzél | All team members | Finished |
| 2.0 | 2026/09/29 | Kaylee, Alyssa, Chanzél | All team members | Finished |

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
|:---:|:---:|:---:|
|Requesters|Need a simple way to submit requests and monitor their progress.|High|
|Service Staff|Need to access relevant requests, manage ownership and update request progress.|High|
|Management|Need reliable information regarding service activity, outstanding work and performance.|High|
|System Administrator|Needs to manage users, permissions and system configuration.|High|
|Project Team|Responsible for analyzing, designing, developing, testing and documenting the system.|High|
|Organization|Requires a reliable, secure and sustainable method of managing service requests.|High|

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
|:---:|:---:|:---:|:---:|
| FR-001 |The system shall allow a requester to submit a new service request. |Business Brief|High|
| FR-002 |The system shall allow a requester to categorize a service request using a controlled category mechanism.|Business Brief|High|
| FR-003 |The system shall allow requesters to view the current status of their submitted requests.|Business Brief|High|
| FR-004 |The system shall allow requesters to view previously submitted requests.|Business Brief|High|
| FR-005 |The system shall provide meaningful feedback when a request is accepted, rejected, updated or completed.|Business Brief|High|
| FR-006 |The system shall allow authorized staff to view relevant service requests.|Business Brief|High|
| FR-007 |The system shall allow authorized staff to search, filter and sort service requests.|Business Brief|High|
| FR-008 |The system shall allow authorized staff to view complete request details.|Business Brief|High|
| FR-009 |The system shall allow authorized staff to accept or assign responsibility for a request.|Business Brief|High|
| FR-010 |The system shall allow authorized staff to update request status through controlled transitions.|Business Brief|High|
| FR-011 |The system shall allow authorized staff to record relevant actions, comments and resolution information.|Business Brief|High|
| FR-012 |The system shall allow authorized staff to resolve or close requests where authorized.|Business Brief|High|
| FR-013 |The system shall provide management with useful service activity information.|Business Brief|High|
| FR-014 |The system shall allow management to identify open, overdue, resolved and closed requests.|Business Brief|High|
| FR-015 |The system shall provide request information by category, status or other justified dimensions.|Business Brief|High|

### 5.2 Non-Functional Requirements
Unchanged from PED Version 1
| ID | Requirement | Measurable Target |
|:---:|:---:|:---:|
| NFR-001 |Security – Authentication: The system shall require users to authenticate before accessing protected functionality.|100% of protected pages/functions shall require successful authentication. Unauthenticated users attempting to access protected functionality shall be denied access.|
| NFR-002 |Security – Authorisation: Users shall only access functionality and information appropriate to their role.|100% of tested role-based access scenarios shall prevent unauthorised access. Requesters shall not be able to access staff or management functionality.|
| NFR-003 |Security – Data Protection: Sensitive information shall be protected from unauthorised disclosure.|Sensitive data shall not be exposed in URLs, client-side logs, or application error messages, and all production communication shall use HTTPS.|
| NFR-004 |Security – Secrets Management: Credentials and secrets shall not be stored in source control.|0 passwords, API keys, connection strings containing credentials, or other secrets shall be committed to the GitHub repository.|
| NFR-005 |Performance: The system shall respond promptly to normal user actions.|At least 95% of normal user requests shall receive a response within 2 seconds under the defined test load.|
| NFR-006 |Usability: Users shall be able to complete common tasks without unnecessary complexity.|At least 80% of representative test users shall successfully complete key tasks such as submitting and checking a request without assistance.|
| NFR-007 |Reliability: The system shall correctly maintain service request information.|During functional testing, 100% of successfully submitted requests shall be stored with all required fields and remain retrievable after the transaction is completed.|
| NFR-008 |Availability: The deployed system shall be accessible during its intended operating period.|The system shall achieve at least 99% availability during the defined testing/deployment period, excluding planned maintenance.|
| NFR-009 |Auditability: Important request changes shall be traceable.|100% of tested status changes, assignments and resolution actions shall record the user, action and timestamp.|
| NFR-010 |Maintainability: The system shall be structured so that changes can be made without unnecessarily affecting unrelated functionality.|All implemented features shall follow the agreed project architecture and coding standards, and 100% of merged changes shall pass the project's automated tests/checks before merging into main.|
| NFR-011 |Data Integrity: The system shall prevent invalid or incomplete data from being stored.|100% of tested mandatory-field and validation rules shall reject invalid input and provide an appropriate error message.|
| NFR-012 |Compatibility: The system shall work on commonly used modern browsers.|All core functionality shall successfully operate on the latest versions of Chrome, Edge and Firefox during compatibility testing.|
| NFR-013 |Scalability: The system should support the expected level of concurrent use without unacceptable degradation.|The system shall support at least 50 concurrent users while maintaining the agreed 2-second response target for 95% of normal requests.|
| NFR-014 |Recoverability: The system shall allow service data to be recovered following a failure.|A database backup shall be created according to the agreed backup schedule, and a test restoration shall successfully recover 100% of the selected test backup data.|

## 6. Assumptions & Constraints
Unchanged from PED Version 1
The project depends on certain assumptions and limitations that will affect how the engineering choices are made. The team is made up of exactly three students and needs to complete the project by reaching four official milestones during the SEN381 timeframe. The amount of functionality that can be delivered is limited by the time and resources that are available. The project should use free or low-cost tools and services whenever possible, but it should also recognize any limits and extra costs that might come up outside of teaching. The scope that is already agreed upon needs to be carefully managed, and any new features should not be added in a way that causes the scope to grow uncontrollably. The project also assumes that the right people will be there to give the needed information about what is required and to check if the proposed solution works. It is assumed that users have the computer or network setup needed to use the final system. Security and quality are considered important responsibilities that are taken care of throughout the entire lifecycle. So, decisions about security, quality, how the system is built, and the technology used needed to be made during the whole project, not just left until the end when we’re testing or putting it into use.

## 7. Architecturally Significant Requirements & Quality Drivers 
The team's has gone through all the functional and non-functional requirements that have been specified during Milestone 1. All the requirements that are architecturally significant have been identified (FR-005, Fr-006, FR-009, FR-010, FR-011, FR-013, FR-014, NFR-001, NFR-002, NFR0-003, NFR-004, NFR-005, NFR-007, NFR-009, NFR-010, NFR-013, NFR-014). The quality drivers have also been identified as Security, Audatibility and Maintainability.

Full explanation and reasoning can be found in: `docs/Architecture/asrs-quality-drivers.md`

## 8. Architecture Alternatives & Selection
In order for the team to be able to balance distinct workflows against the necessary strict security, maintainability and auditability, the team had to evaluate a modular monolith architecture vs a distributed architecture. The distributed architecture did offer independent deployment and scaling but it did bring heavy network costs and operational and testing overhead which was unfeasible for a 3-person team. The team did decide on the modular monolith architecture which would enforce seperation of concerns and centralized auditing through the internal interfaces whilst still keeping the maintenance and deployment simple.

Full explanation and reasoning can be found in: `docs/Architecture/architecture-alternatives/md`

## 9. Architecture Diagrams
The CivicConnect architecture is represented by the following diagrams that can be found in `docs/Architecture/Diagrams/`:
- **Modular Layered Monolith Architecture.png:** Showcases the four-layered architecture and the responsibilities assigned to each layer.
- **Management Flowchart.png:** The management task sequence from login through dashboard filtering, reviewing the request overview, and read-only request detail (FR-013–FR-015).
- **Requester Flowchart.png:** The requester's sequence of tasks from the login to giving a new request up until finalising.
- **Staff Flowchart.png:** The staff task sequence from login through search/filter, assignment, status update, and the resolve-before-close rule

## 10. Technology Stack Decision
The technology stack was selected using a weighted decision matrix evaluating the difference between .NET stack and a Node.js stack.

Node.js scored 4.30/5 against .NET's 4.00/5, with the difference driven primarily by team capability and schedule, where team review identified stronger familiarity with Node.js for REST API development.

**Decision:** Node.js with Express and PostgreSQL (DEC-005).

Full scoring, weighting rationale and per-criterion justification are documented in `docs/Architecture/tech-stack-decision-matrix.md`.

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
|---|---|---|---|---|---|
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
|---|---|---|---|---|---|---|---|---|---|
| DEC-001 | The team required a controlled platform for version control, collaboration and maintaining evidence of project changes. | The project is completed by a three-person team and requires collaboration, traceability and controlled management of changes throughout the milestones. | GitHub; alternative repository/version-control platforms; managing and sharing files manually. | Use GitHub as the main version-control and collaboration platform for CivicConnect. | GitHub provides version control, branches, issues, pull requests, reviews and project history in one environment. These features allow the team to collaborate while maintaining evidence of how project artefacts change over time. | Using GitHub introduces additional process compared with simply sharing files. Team members must understand and consistently follow the agreed workflow. | Incorrect branch use, merge conflicts, outdated local versions or accidental changes could affect project artefacts if the workflow is not followed correctly. | CivicConnect GitHub repository, project issues, branches and pull-request history. | To be reviewed and updated in later milestones. |
| DEC-002 | The team needed a controlled method for making changes to shared CivicConnect project artefacts without directly changing the approved main version. | Multiple team members may work on different tasks at the same time, and changes need to be reviewed before becoming part of the main project baseline. | Editing directly on the main branch; using one shared development branch; using separate task branches with pull requests. | Use separate branches for assigned tasks and merge changes into main through pull requests after peer review. | Separate branches allow team members to work independently without immediately affecting main. Pull requests provide an opportunity for other team members to review changes and create evidence of what was changed and approved. | The process takes more time than editing main directly and may require merge conflicts or requested changes to be resolved before work can be merged. | Poor branch management or failure to update from the latest approved version may result in conflicting or outdated changes. | GitHub issue branches, pull requests and review history. | To be reviewed and updated in later milestones. |
| DEC-003 | The team needed a way to organise Milestone work and make responsibility and progress visible. | CivicConnect is completed by a three-person team across multiple milestones, with tasks depending on different team members and requiring review before completion. | Informal task allocation through messages; a separate task list; GitHub Issues and the project Kanban board. | Use GitHub Issues and the project Kanban board to assign and track project work. | Issues provide a clear record of individual tasks and ownership, while the Kanban board allows the team to see which work is outstanding, in progress, under review or completed. This also keeps task evidence connected to the project repository. | Team members must keep issue and project statuses updated for the board to accurately represent project progress. | If issues or statuses are not maintained, the board may not accurately show project progress and tasks could be overlooked. | GitHub Issues and the CivicConnect project Kanban board. | To be reviewed and updated in later milestones. |
| DEC-004 | CivicConnect needs an architecture supporting distinct requester/management/staff responsibilities whilst still meeting the audatibility, security and maintainability requirements baslined in M1 | 3-person team, one semester timeline, free/low cost hosting preference, no requirement for independent scaling/deployment of any individual functions | Modular layered monolith (single deployable app, logical module seperation via interfaces) and Distributed Architecture (independently deployable services communicating via API or messaging) | Modular layered monolith | This decision satisfies the NFR-002, NFR-009, NFR-010 without having the network/operational overhead that a 3-person team won't be able to sustain, no current requirement also justifies the distributed complexity | Gives up independent scaling/deployment of individual functions. If load also becomes uneven then components can't be scaled seperately | If a future requirement does introduce external consumers or scaling needs, if this decision gets revisited mid-project then it would require a formal change request and rework | Can be found in: docs/architecture-alternatives.md | TBD |
| DEC-005 | A technology stack was required for the modular layered monolith (DEC-004) that would fit the team's identified schedule, capability and ASRs |  Must support selected architecture, one semester timeline, free/low cost, 3-person team | Option 1: .NET (C#, ASP.NET Core, PostgreSQL, EF Core). Option 2: Node.js (Express, PostgreSQL) | Node.js with Express and PostgreSQl | Weighted decision matrix has scored the Node.js 4.30/5 against the .NET's 4.00/5. This higher score was mainly driven by higher team capability and schedule sccores. The team has also found greater comfort with Node.js for REST API development, which reduces implementation and learning risk | Does sacrifice some of the team's prior learning of .NET/C# | Team unfamiliarity with the specific Node.js patterns could cause delays despite having a higher comfort score. | docs/Architecture/tech-stacck-decision-matrix.md | TBD |

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

## 14. Baseline Sign-Off
| Field | Value |
|---|---|
| Updated PED Reviewed | YES - scope has been reviewed and approved by all team members via a pull request.|
| Diagrams and Flowcharts approved| YES |
| Wireframes Reviewd| YES - discussed and approved by all team members|
| Api Contracts Agreed | YES |
| Chosen Architecture and Tech Stack | YES - all decisions were discussed and appproved by all members |
| Updated Risks | YES - Acceppted by team |
| Outcome | ACCEPTED by entire team |
