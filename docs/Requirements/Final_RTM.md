| Req ID | Requirement | Design / Component | GitHub Issue / PR | Test | Status |
|---|---|---|---|---|---|
| FR-001 | Submit a new service request | Requester UI → Request Management service → Service Request repository | #91, #92 | TC-B01, TC-I03, TC-E01 | Met |
| FR-002 | Categorize a service request | Requester UI → Category lookup → Service Request and Category data | #91, #92 | TC-B01, TC-B02, TC-E01 | Met |
| FR-003 | View current request status | Requester dashboard → authorised Request Management read service → Service Request data | #91, #92 | TC-E01 | Met |
| FR-004 | View previously submitted requests | Requester dashboard → Request History read service → Service Request and Request History data | #91, #92 | TC-E01 | Met |
| FR-005 | Receive feedback on request updates | Request Workflow service → in-process Notification interface → requester feedback. Notification failure handling remains to be finalised. | #91, #92 | TC-U05, TC-E02 | Partially Met |
| FR-006 | Staff view relevant requests | Staff dashboard → server-side Authorisation component → Request Management read service | #91, #92 | TC-I02, TC-B06, TC-E02 | Met |
| FR-007 | Search, filter and sort requests | Staff dashboard → Request Management query service → Service Request and Category data | #91, #92 | TC-E02 | Met |
| FR-008 | Staff view complete request details | Staff detail UI → authorised Request Management read service → Service Request and Request History data | #91, #92 | TC-E02 | Partially Met |
| FR-009 | Accept or assign responsibility | Assignment/Request Workflow service → Service Request assignment and history. Assignment history model remains to be finalised. | #91, #92 | TC-U04, TC-I04, TC-E02 | Met |
| FR-010 | Update request status through controlled transitions | Request Workflow service validates transitions → Service Request update and Request History entry saved in one database transaction | #91, #92 | TC-U01, TC-B05, TC-B06 | Met |
| FR-011 | Record actions, comments and resolution information | Staff detail UI → Request History service → append-only Request History data | #91, #92 | TC-E02 | Met |
| FR-012 | Resolve or close requests | Request Workflow service checks permissions and transitions → Service Request and Request History updated in one database transaction | #91, #92 | TC-U01, TC-B06, TC-E02 | Met |
| FR-013 | Provide management with service activity information | Management dashboard → Reporting read service → Service Request and Category data | #91, #92 | TC-I08 | Partially Met |
| FR-014 | Identify open, overdue, resolved and closed requests | Reporting service → management dashboard. A consistent rule for identifying overdue requests remains to be finalised. | #91, #92 | TC-U02, TC-I08 | Partially Met |
| FR-015 | Provide request information by category, status and other dimensions | Reporting query service → Service Request and Category data → management dashboard | #92 | TC-I08 | Partially Met |
| NFR-001 | Authentication | Authentication/Identity component → protected server routes | #91 | TC-I01 | Met |
| NFR-002 | Role-based authorisation | Central server-side Authorisation component for request and reporting operations | #91 | TC-U03, TC-I02 | Met |
| NFR-003 | Sensitive data protection | API response handling, error handling and logging controls; HTTPS configuration for deployment | #91 | TC-I01, TC-I02, TC-I05 | Partially Met |
| NFR-004 | Secrets management | Runtime/environment configuration and repository controls | #91 | No Test Planned | Met |
| NFR-005 | Response performance | Request Management and Reporting query services; database query and index design | #91 | TC-P01 | Baselined |
| NFR-006 | Usability | Requester, staff and management UI flows with clear validation feedback | #91 | No Test Planned | Met |
| NFR-007 | Reliability | Request Management service → PostgreSQL transactions → Service Request repository | #91 | TC-I03 | Met |
| NFR-008 | Availability | Application and PostgreSQL hosting arrangement. Evidence: docs/Deployment/availability.md | #91 | TBD | Baselined |
| NFR-009 | Auditability | Request Workflow and Assignment services → Request History saved in the same transaction as key changes | #91 | TC-B05, TC-I04, TC-I05 | Met |
| NFR-010 | Maintainability | Presentation, application and persistence layers; separated identity, request, notification and reporting responsibilities | #91 | No Test Planned | Met |
| NFR-011 | Data integrity | UI validation, application business rules and PostgreSQL constraints and transactions | #91 | TC-U04, TC-B02, TC-B03 | Partially Met |
| NFR-012 | Browser compatibility | Web UI across requester, staff and management views | #91 | TC-E01, TC-E02 | Met |
| NFR-013 | Scalability | Application deployment and indexed request/report queries. Load testing remains pending. | #91 | TC-P01 | Baselined |
| NFR-014 | Recoverability | PostgreSQL backup and restore process. Backup schedule and deployment environment remain to be finalised. | #91 | TBD | Partially Met |