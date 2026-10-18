# CivicConnect Final Requirements Traceability Matrix

## Milestone Four — Final

This matrix records the final assessed outcome for each of the 29 baseline requirements. Met and Partially Met align with `scope-completion.md`; test results and manual verification evidence are distinguished below. Outcomes apply to the assessed staging baseline `v3.0-rc1`, not production readiness.

| Req ID | Requirement | Design / Component | GitHub Issue / PR | Test / Verification Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| FR-001 | Submit a new service request | Requester UI → Request Management service → Service Request repository | #91, #92 | TC-B01, TC-I03, TC-E01 | Met |
| FR-002 | Categorize a service request | Requester UI → Category lookup → Service Request and Category data | #91, #92 | TC-B01, TC-B02, TC-E01 | Met |
| FR-003 | View current request status | Requester dashboard → authorised Request Management read service → Service Request data | #91, #92 | TC-E01 | Met |
| FR-004 | View previously submitted requests | Requester dashboard → Request History read service → Service Request and Request History data | #91, #92 | TC-E01 | Met |
| FR-005 | Receive feedback on request updates | Request Workflow service → in-process Notification interface → requester feedback. Notification failures are logged without undoing the request update; retry is not implemented (TD-005), and no Rejected status exists (TD-006). | #91, #92 | TC-U05, TC-E02 | Partially Met |
| FR-006 | Staff view relevant requests | Staff dashboard → server-side Authorisation component → Request Management read service | #91, #92 | TC-I02, TC-B06, TC-E02 | Met |
| FR-007 | Search, filter and sort requests | Staff dashboard → Request Management query service → Service Request and Category data Sorting is implemented; TC-E02 asserts search/filter, not sorting. | #91, #92 | TC-E02 | Met |
| FR-008 | Staff view complete request details | Staff detail UI → authorised Request Management read service → Service Request and Request History data Stored status history is not displayed to staff. | #91, #92 | TC-E02 | Partially Met |
| FR-009 | Accept or assign responsibility | Assignment/Request Workflow service → Service Request assignment and history. Assignment and its history entry are saved in one transaction; management performs assignment. | #91, #92 | TC-U04, TC-I04, TC-E02 | Met |
| FR-010 | Update request status through controlled transitions | Request Workflow service validates transitions → Service Request update and Request History entry saved in one database transaction | #91, #92 | TC-U01, TC-B05, TC-B06 | Met |
| FR-011 | Record actions, comments and resolution information | Staff detail UI → Request History service → append-only Request History data | #91, #92 | TC-E02 | Met |
| FR-012 | Resolve or close requests | Request Workflow service checks permissions and transitions → Service Request and Request History updated in one database transaction | #91, #92 | TC-U01, TC-B06, TC-E02 | Met |
| FR-013 | Provide management with service activity information | Management dashboard → Reporting read service → Service Request and Category data | #91, #92 | TC-I08 | Partially Met |
| FR-014 | Identify open, overdue, resolved and closed requests | Reporting service → management dashboard. Overdue is calculated from due dates in the browser; resolved and closed requests are excluded (TD-002). | #91, #92 | TC-U02, TC-I08 | Partially Met |
| FR-015 | Provide request information by category, status and other dimensions | Reporting query service → Service Request and Category data → management dashboard | #92 | TC-I08 | Partially Met |
| NFR-001 | Authentication | Authentication/Identity component → protected server routes | #91 | TC-I01 | Met |
| NFR-002 | Role-based authorisation | Central server-side Authorisation component for request and reporting operations | #91 | TC-U03, TC-I02 | Met |
| NFR-003 | Sensitive data protection | API response handling, error handling and logging controls; HTTPS configuration for deployment | #91 | TC-I01, TC-I02, TC-I05 | Partially Met |
| NFR-004 | Secrets management | Runtime/environment configuration and repository controls | #91 | Secret scans; `../Quality/security-scanning.md` | Met |
| NFR-005 | Response performance | Request Management and Reporting query services; database query and index design Evidence meets the target for the tested local workload only. | #91 | TC-P01 | Met |
| NFR-006 | Usability | Requester, staff and management UI flows with clear validation feedback | #91 | Usability sessions (#88); `../Deployment/usability-test.md` | Met |
| NFR-007 | Reliability | Request Management service → PostgreSQL transactions → Service Request repository | #91 | TC-I03 | Met |
| NFR-008 | Availability | Local staging monitoring: 100.00% availability on 17 October 2026; short window and external-network limitations apply. | #91 | 120/120 checks up over 60 minutes; `../Deployment/availability.md` | Met |
| NFR-009 | Auditability | Request Workflow and Assignment services → Request History saved in the same transaction as key changes | #91 | TC-B05, TC-I04, TC-I05 | Met |
| NFR-010 | Maintainability | Presentation, application and persistence layers; separated identity, request, notification and reporting responsibilities | #91 | CI gate evidence and lint; `../Quality/ci-pipeline.md`, `../Quality/static-analysis.md` | Met |
| NFR-011 | Data integrity | UI validation, application business rules and PostgreSQL constraints and transactions | #91 | TC-U04, TC-B02, TC-B03 | Partially Met |
| NFR-012 | Browser compatibility | Web UI across requester, staff and management views | #91 | TC-E01, TC-E02 | Met |
| NFR-013 | Scalability | Local request-list API load test with 50 virtual users; production-scale behaviour remains unverified. Evidence meets the target for the tested local workload only. | #91 | TC-P01 | Met |
| NFR-014 | Recoverability | Manual PostgreSQL backup/restore drill on local staging; row counts matched, but request tables were empty and no automated backup schedule was demonstrated. | #91 | Backup/restore drill (#83); `../Deployment/backup-restore.md` | Partially Met |
