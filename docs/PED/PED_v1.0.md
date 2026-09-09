# Project Engineering Document (PED)
# Version One

**Milestone 1:**  Engineering Foundation & Requirements Baseline
**Date:** 2026/09/07
**Team:** Group L

## 1. Document Control
| Version | Date | Author(s) | Reviewed By | Status |
|---|---|---|---|---|
| 1.0 | | | | Draft |

## 2. Problem Statement & Business Need
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
| Stakeholder | Interest/Need | Influence |
|:---:|:---:|:---:|
|Requesters|Need a simple way to submit requests and monitor their progress.|High|
|Service Staff|Need to access relevant requests, manage ownership and update request progress.|High|
|Management|Need reliable information regarding service activity, outstanding work and performance.|High|
|System Administrator|Needs to manage users, permissions and system configuration.|High|
|Project Team|Responsible for analyzing, designing, developing, testing and documenting the system.|High|
|Organization|Requires a reliable, secure and sustainable method of managing service requests.|High|
## 4. Scope Baseline
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
### 5.3 Acceptance Criteria
The acceptance criteria will help decide if a requirement works as it was meant to. A requirement is acceptable when the needed function is done, the right conditions for approval are met, and proper test results are shown. The acceptance criteria will also take into account the necessary authorizations and the expected quality standards. Critical issues that aren't fixed and stop the required feature from working right will stop the feature from being fully accepted.
## 6. Assumptions & Constraints
The project depends on certain assumptions and limitations that will affect how the engineering choices are made. The team is made up of exactly three students and needs to complete the project by reaching four official milestones during the SEN381 timeframe. The amount of functionality that can be delivered is limited by the time and resources that are available. The project should use free or low-cost tools and services whenever possible, but it should also recognize any limits and extra costs that might come up outside of teaching. The scope that is already agreed upon needs to be carefully managed, and any new features should not be added in a way that causes the scope to grow uncontrollably. The project also assumes that the right people will be there to give the needed information about what is required and to check if the proposed solution works. It is assumed that users have the computer or network setup needed to use the final system. Security and quality are considered important responsibilities that are taken care of throughout the entire lifecycle. So, decisions about security, quality, how the system is built, and the technology used needed to be made during the whole project, not just left until the end when we’re testing or putting it into use.
## 7. Requirements Traceability Matrix (RTM) — Initial
| Req ID | Requirement | Design / Component | GitHub Issue / PR | Test | Status |
|---|---|---|---|---|---|
| FR-001 | Submit a new service request | Request Submission Module | TBD | TBD | Baselined|
| FR-002 | Categorize a service request | Request Submission Module | TBD | TBD | Baselined |
| FR-003 | View current request status | Request Tracking Module | TBD | TBD |Baselined |
| FR-004 | View previously submitted requests | Request History Module | TBD | TBD | Baselined |
| FR-005 | Receive feedback on request updates | Notification / Feedback Module | TBD | TBD | Baselined |
| FR-006 | Staff view relevant requests | Staff Request Management Module | TBD | TBD | Baselined |
| FR-007 | Search, filter and sort requests | Request Management Module | TBD | TBD | Baselined |
| FR-008 | Staff view complete request details | Request Management Module | TBD | TBD | Baselined |
| FR-009 | Accept or assign responsibility | Assignment Module | TBD | TBD | Baselined |
| FR-010 | Update request status through controlled transitions | Request Workflow Module | TBD | TBD | Baselined |
| FR-011 | Record actions, comments and resolution information | Request History / Audit Module | TBD | TBD | Baselined |
| FR-012 | Resolve or close requests | Request Workflow Module | TBD | TBD | Baselined |
| FR-013 | Provide management with service activity information | Management Dashboard / Reporting Module | TBD | TBD | Baselined |
| FR-014 | Identify open, overdue, resolved and closed requests | Management Dashboard / Reporting Module | TBD | TBD | Baselined |
| FR-015 | Provide request information by category, status and other dimensions | Reporting / Analytics Module | TBD | TBD | Baselined |
| NFR-001 | Authentication | Authentication / Identity Component | TBD | TBD | Baselined |
| NFR-002 | Role-based authorisation | Authorisation / Access Control | TBD | TBD | Baselined |
| NFR-003 | Sensitive data protection | Security / Application Layer | TBD | TBD | Baselined |
| NFR-004 | Secrets management | GitHub / Deployment Configuration | TBD | TBD | Baselined |
| NFR-005 | Response performance | Application / API Layer | TBD | TBD | Baselined |
| NFR-006 | Usability | User Interface | TBD | TBD | Baselined |
| NFR-007 | Reliability | Application / Database Layer | TBD | TBD | Baselined |
| NFR-008 | Availability | Deployment Infrastructure | TBD | TBD | Baselined |
| NFR-009 | Auditability | Audit / Request History Module | TBD | TBD | Baselined |
| NFR-010 | Maintainability | Application Architecture / Codebase | TBD | TBD | Baselined |
| NFR-011 | Data integrity | Validation / Database Layer | TBD | TBD | Baselined |
| NFR-012 | Browser compatibility | User Interface | TBD | TBD | Baselined |
| NFR-013 | Scalability | Application / Infrastructure | TBD | TBD | Baselined |
| NFR-014 | Recoverability | Database / Backup Infrastructure | TBD | TBD | Baselined |

## 8. Risk Register — Initial
| Risk ID | Description | Cause | Probability | Impact | Priority | Mitigation | Owner | Status |
|---|---|---|---|---|---|---|---|---|
| RISK-001 | Requirements may be misunderstood, incomplete or interpreted differently. | Stakeholder needs may be unclear or interpreted differently by team members. | Med | High | High | Use clear requirement IDs and measurable acceptance criteria. Review unclear requirements and assumptions as a team before implementation. | Team | Monitoring |
| RISK-002 | Unauthorised users may access restricted CivicConnect functions or information. | Authentication or role-based access controls may be incorrectly designed or implemented. | Med | High | High | Clearly define authentication and role permissions, prevent secrets from being stored in source control, and verify access controls through security testing. | Team | Open |
| RISK-003 | Team members may work from outdated files or create conflicting changes. | Multiple team members are working on shared project artefacts. | Med | Med | Med | Use separate GitHub branches, fetch or pull the latest approved work, and require pull-request review before merging changes into main. | Team | Monitoring |
| RISK-004 | Milestone work may not be completed by the required deadline. | Limited team size, other commitments, task dependencies or work taking longer than expected. | Med | High | High | Assign work through GitHub issues, track progress on the Kanban board and communicate early about unfinished or blocked tasks. | Team | Monitoring |
| RISK-005 | AI-generated content may introduce incorrect or unsupported information. | AI output may appear correct while being inaccurate, incomplete or unsuitable for the project. | Med | High | High | Human team members will review and verify AI-assisted work against project requirements, course material and available evidence, with relevant use recorded in the AI Usage Register. | Team | Monitoring |
| RISK-006 | Requirements may lose traceability during later project stages. | Requirements, issues, decisions, implementation, tests and evidence may not remain clearly linked. | Med | High | High | Maintain unique requirement IDs and progressively update the RTM with relevant design, issue/PR, implementation and verification evidence. | Team | Open |
| RISK-007 | Project scope may grow beyond what can realistically be delivered. | New features may be introduced without fully considering their effect on time, resources, quality and complexity. | Med | High | High | Use the PED scope baseline to assess proposed additions and keep optional or future functionality outside the current scope unless a change is properly considered and approved. | Team | Monitoring |


## 9. Engineering Decision Log — Initial
| Decision ID | Context | Alternatives | Decision | Rationale | Risks |
|---|---|---|---|---|---|
| DEC-001 | The team required a controlled platform for version control, collaboration and maintaining evidence of project changes. | GitHub; alternative repository/version-control platforms; manual file sharing. | Use GitHub as the main version-control and collaboration platform for CivicConnect. | GitHub provides branches, issues, pull requests, reviews and project history, supporting both team collaboration and engineering traceability. | Incorrect branch use, merge conflicts or outdated versions may affect project artefacts if the workflow is not followed correctly. |
| DEC-002 | The team needed a controlled way to make changes to shared project artefacts without directly changing the approved main version. | Direct changes to main; one shared development branch; separate task branches with pull requests. | Use separate task branches and merge changes into main through pull requests after peer review. | This allows members to work independently while ensuring changes are reviewed before becoming part of the main project baseline. | Poor branch management or failure to work from the latest approved version may result in conflicting or outdated changes. |
| DEC-003 | The team needed a way to organise Milestone work and make responsibilities and progress visible. | Informal task allocation; a separate task list; GitHub Issues and Kanban board. | Use GitHub Issues and the project Kanban board to assign and track project work. | Issues provide clear task ownership and the Kanban board makes the progress of milestone work visible to the team. | If issues and statuses are not kept updated, project progress may be represented incorrectly and tasks could be overlooked. |

## 10. Process & Team Working Agreement
The team's working agreement and process outline has been documented within the official Team Working Agreement: `docs/Decisions/team-working-agreement.md`.

## 11. GitHub Governance
The CiviConnect Repository of Group L has been configured with the following controls:

- **Repository:** There is one controlled team repository  (SEN381-CivicConnect), public (for ease of marking for lecturers), and with all three team members added in as collaborators.
- **Main Branch Protection:** The 'main' branch is protected by making use of a GitHub Ruleset which outlines the requirement of pull requests before merging, each pull requests needs a minimum of 2 approving reviews (self-approval is not permitted). Stale approvals are dismissed automatically when new commits are pushed.
- **Direct Commits to The Main:** Force pushes to the 'main' branch are blocked and not permitted. Any and all changes must go through a feature branch and Pull Request.
- **Issues and Project Board:** The Milestone 1 work and tasks are tracked via making use of GitHub issues which are linked to a Kanban style Project Board (Backlog / In Progress / In Review / Done). PRs reference these issues by using "Closes #X" so merged work automatically updates the issues' state so team can track progress.
- **Secrets:** No credentials, API keys or confidential material have been committed. A `.gitignore` file will also be added during Milstone 2. 
- **Folder structure:** The project has controlled documentation which is strategically organised under `docs/` within the GitHub repository. (PED, Requirements, Risk, Decisions), following the  suggested structure in Appendix C of the Master Project Brief.

## 12. AI Usage Register
All the material that were AI-assisted across the project are recorded in: 
`docs/PED/ai-usage-register.md`

## 13. Initial Deployment/Operational Considerations
The deployment and operational considerations have not yet been formally evaluated in Milestone 1 but will be during Milestone 2. 

At this Milestone the team has noted these initial considerations to be defined to use in later milestones:
- The team aims to make use of free deployment/hosting platforms where practical.
- Our backup and recovery capability (referring to NFR-014) will need to be considered once a database/persistence technology has been selected.
- Deployment decisions will need to account for secure configuration and secrets management since there is a presence of sensitive request/user data
- These considerations will be revisited during Milestone 2 with concrete and researched decisions, ADRs and environment details (refer to PED_v2.0 if available).

## 14. Baseline Sign-Off
| Field | Value |
|---|---|
| Scope reviewed | YES - scope has been reviewed and approved by all team members via a pull request.|
| Requirements/traceability checked | YES - 15 FRs and 14 NFRs defined alongside an acceptance criteria to refer to; initial RTM setup as well.|
| Risk review completed | YES - 7 risks has been identified, discussed and approved by all team members|
| Governance controls checked | YES - branch protection, pull requests mandatory, Issues and project board created and no self-approvals allowed (minimum 2)|
| Outcome | ACCEPTED by entire team |