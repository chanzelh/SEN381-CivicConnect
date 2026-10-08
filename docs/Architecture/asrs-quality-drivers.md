# Architecturally Significant Requirements & Quality Drivers
## Purpose: 
These are all the functional and non-functional requirements that will force a different architecture decision if they are changed/removed. This is not the full PED requirement list, just the subset that will shape structures.
## ASR Table
   | ASR | Source | Quality Attribute | Priority | Architectural Impact | Example (cause-> response-> measure)
   |:---:|:---|:---|:---:|:---|:---|
   | ASR 1 : Centralised access control | NFR-001 and NFR-002 | Security | Must | The authentication and role checks are only enforced once in the application layer. They do not get duplicated across all components and is also not left to the UI only. | A staff user calls for a request that is outside the allowed scope for them and also bypasses the UI -> Rejected with an error 403 and no data is returned -> 100% of attempts |
   | ASR 2 : Consistent audit of the state changes | NFR-009 and NFR-007 | Reliability and Auditability |  Must | There is one audit mechanism that records the user, timestamps and action for every assignment and status change. Each change and the audit record are persisted together | Status update fails midway through -> Either the change and audit record are stored together or neither -> There are zero changes without a matching audit record |
   | ASR 3 : Change isolation between the functional areas | NFR-010 | Maintainability | Should | The reporting, notifications, request management and authentication are all seperate modules that interact only through interfaces and not through any shared data-access or business code | Developer makes changes to reporting logic -> Change is confied to the reporting module only. All other files such as request management etc are unchanged. |
   | ASR 4 : Bounded load and response | NFR-005, NFR-013 | Scalability and Performance | Must | The anticipated load is fixed and small and there is no requirment for independent scaling of certain components. One deployable must meet the target and needs. | 40 users under normal operation -> Requests processed -> 95% complete in 2s or less |
 

## Quality Attribute Summary
There are three attributes that clearly show importance, it has been determined by the Must-priority weight and requirement count:
- Security (NFR-001, NFR-002, NFR-003, NFR-004, FR-006) - auth, RBAC, transport security and secrets
- Auditability (NFR-009, FR-009/010/011) - every state change needs a traceable history
- Maintainability (NFR-010) - here separation of concerns is directly instructed

For performance and scalability (NFR-005, NFR-013) do also matter but they do come secondary in regards to the above mentioned attributes. 