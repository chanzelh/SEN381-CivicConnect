# Architecturally Significant Requirements & Quality Drivers
## Purpose: 
These are all the functional and non-functional requirements that will force a different architecture decision if they are changed/removed. This is not the full PED requirement list, just the subset that will shape structures.
## ASR Table
   | Req ID | Requirement | Quality Attribute Driven | Priority | Why It's Architecturally Significant |
   |:---:|:---|:---|:---:|:---|
   | FR-005 | Feedback on request state change | Reliability/Usability | Must | Implies a notification mechanism (in-app, email or both), a cross-cutting concern touching every status-change point in the system |
   | FR-006 | Staff see only relevant requests | Security | Must | Forces role-scoped data access - an authorization layer, not just a UI filter. |
   | FR-009 | Assign/accept responsibility | Auditability | Must | Ownership must be tracked and enforced consistently, not just stored as a field |
   | FR-010 | Controlled status transitions | Reliability/Audatibility | Must | Requires a defined workflow/state model so invalid transitions are rejected everywhere, not just in one screen|
   | FR-011 | Record actions/comments | Audatibility | Must | Needs an append-only history model, not just current -state fields. This will shape the design directly |
   | FR-013 | Management Dashboard | Performance/Maintainability | Should | Reporting reads shouldn't degrade transactional performance. May need a seperate read path because of this |
   | FR-014 | Identify overdue requests | Reliability | Must | "Overdue" must be computed consistently (scheduled check or derived field).  This is a design decision and not a UI label |
   | NFR-001 | Authentication required | Security | Must | Determines whether you need a full identity/auth system vs. simple session handling. This is foundational to every layer |
   | NFR-002 | Role-based access | Security | Must | Determines where authorization is enforced (API later, UI layer or both). A structural decision |
   | NFR-003 | Sensitive data protection, HTTPS | Security | Must | Affects deployment (TLS), logging design, and what can appear in error responses. |
  | NFR-004 | No secrets in source control | Security | Must | Drives configuration/secrets management strategy from day one. |
  | NFR-005 | 2s response, 95% of requests | Performance | Must | Influences query design, caching, and whether you can afford chatty client-server calls. |
  | NFR-007 | Data correctness/retrievability | Reliability | Must | Requires transactional integrity at the persistence layer. |
  | NFR-009 | Traceable changes (user/action/timestamp) | Auditability | Must | A cross-cutting audit mechanism touching status changes, assignments, and resolutions — shapes the whole design, not one module. |
  | NFR-010 | Changes shouldn't affect unrelated functionality | Maintainability | Should | This is effectively an instruction to layer/separate concerns — it's the direct architecture-style driver. |
  | NFR-013 | 50 concurrent users, response target holds | Scalability | Could | Lower priority, but a boundary condition your chosen architecture needs to survive without redesign. |
  | NFR-014 | Backup/restore capability | Recoverability | Should | Constrains which persistence technology is viable (must support backup/restore cleanly). |

## Quality Attribute Summary
There are three attributes that clearly show importance, it has been determined by the Must-priority weight and requirement count:
- Security (NFR-001, NFR-002, NFR-003, NFR-004, FR-006) - auth, RBAC, transport security and secrets
- Auditability (NFR-009, FR-009/010/011) - every state change needs a traceable history
- Maintainability (NFR-010) - here separation of concerns is directly instructed

For performance and scalability (NFR-005, NFR-013) do also matter but they do come secondary in regards to the above mentioned attributes. 