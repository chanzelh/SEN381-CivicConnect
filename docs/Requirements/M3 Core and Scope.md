# M3 Core and Scope

**Historical planning baseline:** This document records the intended Milestone 3 release-candidate scope. Final delivery outcomes and variances are recorded in `Final_RTM.md` and `scope-completion.md`.

## 1. Core Functionality

The release candidate should focus on the main service-request workflow. Requesters must be able to submit service requests, select predefined categories, check their request status and receive meaningful feedback. Authorised staff must be able to view requests, access their details, accept or assign responsibility, update statuses through valid transitions, record comments and resolution information, and resolve or close requests where permitted.

Management functionality should allow authorised users to identify open, overdue, resolved and closed requests. Supporting security and data-integrity functionality must ensure that users authenticate before accessing protected features, role permissions are enforced, invalid information is rejected, submitted requests are stored correctly, and important changes can be traced.

## 2. Release Candidate Scope

| Scope | Requirements | Decision |
| --- | --- | --- |
| Request submission and tracking | FR-001–FR-003, FR-005 | Core release functionality |
| Requester history | FR-004 | Include if implemented and verified |
| Staff request management | FR-006, FR-008–FR-012 | Core release functionality |
| Search, filtering and sorting | FR-007 | Include if implemented and verified |
| Management reporting | FR-013–FR-015 | Include implemented and verified functionality; defer incomplete enhancements only with approval |
| Authentication and access control | NFR-001–NFR-004 | Required release checks |
| Performance and usability | NFR-005–NFR-006 | Verify against the agreed targets where test evidence is available |
| Reliability and auditability | NFR-007, NFR-009, NFR-011 | Required release checks |
| Availability, maintainability and compatibility | NFR-008, NFR-010, NFR-012 | Verify against the applicable criteria |
| Concurrent use and recovery | NFR-013–NFR-014 | Confirm through load and backup-restoration testing, or document outstanding work |

## 3. Exclusions and Deferred Scope

Original exclusions and optional scope are defined in `../PED/PED_v1.0.md`, Sections 4.2–4.3. These items were outside the committed baseline.

Implementation compromises are recorded in `../Quality/technical-debt-register.md`; defects and their deferred fixes are recorded in `../Quality/defect-register.md`. These do not automatically remove requirements from the committed scope. Read the final scope-completion report for the delivered outcome and reasons for variance.
