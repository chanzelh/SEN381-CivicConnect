# Project Engineering Document (PED)
# Version Two

**Milestone 2:**  
**Date:** 2026/09/30
**Team:** Group L

## 1. Document Control
| Version | Date | Author(s) | Reviewed By | Status |
|---|---|---|---|---|
| 1.0 | 2026/09/09 | Kaylee, Alyssa, Chanzél | All team members | Finished |
| 2.0 | 2026/09/29 | Kaylee, Alyssa, Chanzél | All team members | In Progress |

## 7. Requirements Traceability Matrix (RTM) — Milestone Two

The Design / Component column now reflects the selected modular layered monolith and current data and interface design. These are planned responsibilities. Issue, test and status fields retain their Milestone One values until project evidence supports an update.

| Req ID | Requirement | Design / Component | GitHub Issue / PR | Test | Status |
|---|---|---|---|---|---|
| FR-001 | Submit a new service request | Requester UI → Request Management service → Service Request repository | TBD | TBD | Baselined|
| FR-002 | Categorize a service request | Requester UI → Category lookup → Service Request and Category data | TBD | TBD | Baselined |
| FR-003 | View current request status | Requester dashboard → authorised Request Management read service → Service Request data | TBD | TBD |Baselined |
| FR-004 | View previously submitted requests | Requester dashboard → Request History read service → Service Request and Request History data | TBD | TBD | Baselined |
| FR-005 | Receive feedback on request updates | Request Workflow service → in-process Notification interface; requester UI feedback (failure contract pending) | TBD | TBD | Baselined |
| FR-006 | Staff view relevant requests | Staff dashboard → server-side Authorisation component → Request Management read service | TBD | TBD | Baselined |
| FR-007 | Search, filter and sort requests | Staff dashboard → Request Management query service → Service Request and Category data | TBD | TBD | Baselined |
| FR-008 | Staff view complete request details | Staff detail UI → authorised Request Management read service → Service Request and Request History data | TBD | TBD | Baselined |
| FR-009 | Accept or assign responsibility | Assignment/Request Workflow service → Service Request assignment and history (assignment history model pending) | TBD | TBD | Baselined |
| FR-010 | Update request status through controlled transitions | Request Workflow service validates transitions → transactional Service Request update and Request History entry | TBD | TBD | Baselined |
| FR-011 | Record actions, comments and resolution information | Staff detail UI → Request History service → append-only Request History data | TBD | TBD | Baselined |
| FR-012 | Resolve or close requests | Request Workflow service checks permissions and transition → transactional Service Request and Request History update | TBD | TBD | Baselined |
| FR-013 | Provide management with service activity information | Management dashboard → Reporting read service → Service Request and Category data | TBD | TBD | Baselined |
| FR-014 | Identify open, overdue, resolved and closed requests | Reporting service with consistent overdue rule → management dashboard (rule pending) | TBD | TBD | Baselined |
| FR-015 | Provide request information by category, status and other dimensions | Reporting query service → Service Request and Category data → management dashboard | TBD | TBD | Baselined |
| NFR-001 | Authentication | Authentication/Identity component → protected server routes | TBD | TBD | Baselined |
| NFR-002 | Role-based authorisation | Central server-side Authorisation component for request and reporting operations | TBD | TBD | Baselined |
| NFR-003 | Sensitive data protection | API response/error handling and logging; HTTPS deployment boundary | TBD | TBD | Baselined |
| NFR-004 | Secrets management | Runtime/environment configuration and repository controls | TBD | TBD | Baselined |
| NFR-005 | Response performance | Request Management and Reporting query services; database query/index design | TBD | TBD | Baselined |
| NFR-006 | Usability | Requester, staff and management UI flows and validation feedback | TBD | TBD | Baselined |
| NFR-007 | Reliability | Request Management service → PostgreSQL transactions and Service Request repository | TBD | TBD | Baselined |
| NFR-008 | Availability | Application and PostgreSQL deployment/hosting arrangement (pending) | TBD | TBD | Baselined |
| NFR-009 | Auditability | Request Workflow/Assignment services → Request History in the same transaction as key changes | TBD | TBD | Baselined |
| NFR-010 | Maintainability | Presentation, application and persistence layers; separated identity, request, notification and reporting responsibilities | TBD | TBD | Baselined |
| NFR-011 | Data integrity | UI checks, application business rules and PostgreSQL constraints/transactions | TBD | TBD | Baselined |
| NFR-012 | Browser compatibility | Web UI across requester, staff and management views | TBD | TBD | Baselined |
| NFR-013 | Scalability | Application deployment and indexed request/report queries (load validation pending) | TBD | TBD | Baselined |
| NFR-014 | Recoverability | PostgreSQL backup and restore process (schedule/environment pending) | TBD | TBD | Baselined |

## 8. Risk Register — Milestone Two

The existing Risk Register was reviewed for Milestone Two. Design risks RISK-008–012 were added to [the Risk Register](../Risk/risk-register.md) alongside RISK-001–007. See the register for ratings, mitigation, contingency and current status.
