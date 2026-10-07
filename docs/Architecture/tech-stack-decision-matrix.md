# CivicConnect: Technology Stack Decision

## 1. What this decision covers

CivicConnect needs to let residents submit service requests and follow their progress. Staff need to assign requests, update their status, keep an action history and produce reports. The stack must support these connected records and protect access to them.

This comparison looks at three complete application stacks. The scores are design assessments based on the requirements and documented technology capabilities. They are not benchmark results. The weights show which requirements matter most for this project; they are priorities, not measured facts.

## 2. Stacks compared

| Layer | PERN | MERN | React + ASP.NET Core + PostgreSQL |
| --- | --- | --- | --- |
| Frontend | React | React | React |
| Backend framework | Express | Express | ASP.NET Core |
| Backend runtime | Node.js | Node.js | .NET |
| Application languages | JavaScript | JavaScript | JavaScript and C# |
| Database | PostgreSQL | MongoDB | PostgreSQL |

PERN means PostgreSQL, Express, React and Node.js. MERN uses MongoDB instead of PostgreSQL. The third option is named by its actual components because there is no widely established acronym needed for this comparison. ASP.NET Core is its backend framework; “.NET” alone does not identify the complete stack.

React is shared by all three options, so frontend features do not affect their relative scores. Hosting is a separate deployment choice and is not implied by these names.

## 3. How the scoring works

Each criterion uses a score from 1 to 5. A higher score means a closer fit with less extra integration or design work for the requirement being assessed.

| Score | Meaning |
| --- | --- |
| 5 | Strong fit: the stack provides a direct approach with little additional adaptation. |
| 4 | Good fit: it supports the requirement well but needs some additional integration or design work. |
| 3 | Workable fit: it needs a more substantial change in modelling or implementation. |
| 2 | Weak fit: it introduces significant work or limitations for this requirement. |
| 1 | Poor fit: it cannot reasonably meet the requirement within the intended design. |

The ratings judge suitability for CivicConnect. They do not mean that one framework is always better than another. For example, MongoDB supports transactions and reporting; the question is how naturally its document model fits the connected records in this project.

### Criteria and weights

| Criterion | Weight | Why it matters | Requirement links |
| --- | --- | --- | --- |
| Data relationships and integrity | 25% | Requests, residents, staff, categories and assignments must stay correctly linked. This has the largest weight because incorrect links affect the whole system. | FR001–FR002, FR009; NFR011 |
| Request updates and audit history | 20% | A status change and its history entry must be saved consistently. This is separate from checking relationships between records. | FR010–FR012; NFR007, NFR009 |
| Reporting and filtering | 15% | Staff need filtered request lists, summaries and reports across related data. | FR007, FR013–FR015 |
| Security integration | 15% | Authentication, role checks and protected request data are required. This criterion compares available facilities and integration effort. | NFR001–NFR004 |
| Backend structure and maintainability | 15% | Request rules, data access and services need to remain understandable as the system grows. | NFR010 |
| Language and development simplicity | 10% | Fewer application languages reduce context switching and duplicated conventions. This has a lower weight than correctness and security. | NFR010; delivery considerations |
| **Total** | **100%** |  |  |

## 4. Completed decision matrix

| Criterion | Weight | PERN | MERN | React + ASP.NET Core + PostgreSQL |
| --- | --- | --- | --- | --- |
| Data relationships and integrity | 25% | 5 | 3 | 5 |
| Request updates and audit history | 20% | 5 | 4 | 5 |
| Reporting and filtering | 15% | 5 | 4 | 5 |
| Security integration | 15% | 4 | 4 | 5 |
| Backend structure and maintainability | 15% | 4 | 4 | 5 |
| Language and development simplicity | 10% | 5 | 5 | 4 |

### Reasons for the ratings

**Data relationships and integrity — PERN 5, MERN 3, React + ASP.NET Core + PostgreSQL 5.** PostgreSQL supports foreign keys, unique constraints and checks directly in the database. These fit the proposed links between users, requests, categories and assignments. Both PostgreSQL options receive the same score. MongoDB offers validation, embedding and references, but references do not provide PostgreSQL-style foreign-key enforcement. Keeping separately stored records correctly linked would require more application logic or a different document design. 

**Request updates and audit history — PERN 5, MERN 4, React + ASP.NET Core + PostgreSQL 5.** PostgreSQL transactions can commit a request change and its history entry together, or roll both back. MongoDB can also perform multi-document transactions, so it remains a good fit. Those transactions require a replica set or sharded deployment rather than a standalone database. Embedding history can make some updates atomic within one document, but that would change the proposed data design. The one-point difference reflects that extra design and deployment consideration. 

**Reporting and filtering — PERN 5, MERN 4, React + ASP.NET Core + PostgreSQL 5.** The planned reports combine request status, category, assignment and dates. SQL joins and grouping fit that relational design directly. MongoDB supports aggregation and `$lookup`, so the reports are achievable there too. Its score reflects the extra document-modelling decisions needed for the same cross-record reports. This is a judgement about query design, not a claim about query speed. 

**Security integration — PERN 4, MERN 4, React + ASP.NET Core + PostgreSQL 5.** The Express options can implement the required protections, but authentication, role checks, validation and security middleware need to be selected and connected. ASP.NET Core provides an integrated authentication and policy-based authorisation framework. It still requires configuration, an identity approach and correctly written access rules. Its higher rating reflects integration support, not a guarantee that the finished application will be more secure.

**Backend structure and maintainability — PERN 4, MERN 4, React + ASP.NET Core + PostgreSQL 5.** Express supports a clear layered backend, but the project needs to establish its own service organisation and dependency conventions. ASP.NET Core supplies dependency injection, configuration and logging facilities within the framework. These reduce the number of conventions the team needs to assemble. This is an engineering judgement about the proposed backend structure; Express can also produce maintainable code. 

**Language and development simplicity — PERN 5, MERN 5, React + ASP.NET Core + PostgreSQL 4.** The first two use JavaScript in both the frontend and backend. The third uses JavaScript for React and C# for the backend, introducing another application language and toolchain. This comparison does not assume that anyone on the team is more experienced in either language. Database query languages are outside this particular criterion. 

## 5. Weighted calculations

For each criterion:

`Weighted contribution = (weight ÷ 100) × score`

The contributions are added to give a total out of 5. For example, a score of 5 on a criterion weighted at 25% contributes `0.25 × 5 = 1.25`.

| Criterion | PERN | MERN | React + ASP.NET Core + PostgreSQL |
| --- | --- | --- | --- |
| Data relationships and integrity | 1.25 | 0.75 | 1.25 |
| Request updates and audit history | 1.00 | 0.80 | 1.00 |
| Reporting and filtering | 0.75 | 0.60 | 0.75 |
| Security integration | 0.60 | 0.60 | 0.75 |
| Backend structure and maintainability | 0.60 | 0.60 | 0.75 |
| Language and development simplicity | 0.50 | 0.50 | 0.40 |
| **Total out of 5** | **4.70** | **3.85** | **4.90** |
| **Normalised total: total ÷ 5 × 100** | **94%** | **77%** | **98%** |
| **Rank** | **2** | **3** | **1** |

The percentages are normalised matrix totals. A result of 98% does not mean 98% certainty, 98% requirement coverage or a measured success rate.

## 6. Does changing the weighting change the decision?

The difference between the two PostgreSQL stacks is small: **0.20 out of 5**. To check how much the result depends on priorities, the table below moves weight from backend maintainability to language simplicity. All other weights and ratings stay the same, and each scenario still totals 100%.

| Maintainability weight | Language simplicity weight | PERN | MERN | React + ASP.NET Core + PostgreSQL | Highest total |
| --- | --- | --- | --- | --- | --- |
| 15% | 10% | 4.70 | 3.85 | 4.90 | React + ASP.NET Core + PostgreSQL |
| 10% | 15% | 4.75 | 3.90 | 4.85 | React + ASP.NET Core + PostgreSQL |
| 5% | 20% | 4.80 | 3.95 | 4.80 | Tie: PERN and React + ASP.NET Core + PostgreSQL |
| 0% | 25% | 4.85 | 4.00 | 4.75 | PERN |

Moving 10 percentage points creates a tie. Moving 15 makes PERN the highest-scoring option. The recommendation therefore depends on giving backend structure more importance than keeping one application language.

The ratings also involve judgement. If ASP.NET Core received 4 rather than 5 for both security integration and maintainability, its baseline total would fall to **4.60**, below PERN’s **4.70**. The reasons for those two ratings are therefore central to the decision and should be reviewed alongside the totals.

## 7. Recommendation

**React + ASP.NET Core + PostgreSQL is the recommended stack under this assessment, with 4.90 out of 5.** It fits the proposed relational data design and provides integrated backend facilities for access control and service organisation.

**PERN is a close alternative at 4.70.** It provides the same database strengths and keeps JavaScript across the frontend and backend. It becomes the preferred option if language simplicity carries substantially more weight. If development has already started with PERN, the small difference in this matrix would not, by itself, justify a rewrite: the cost of changing existing work would need to be included.

**MERN scores 3.85.** It can meet the requirements, but the current data design gives it less of an advantage. Its document flexibility is useful when records can be handled as self-contained documents; CivicConnect’s proposed design places more emphasis on shared relationships, consistent history and cross-record reports.

This is a stack recommendation based on the documented requirements. It does not record a team approval or claim that any implementation has already passed testing.

## 8. Implementation considerations

| Area | What the design needs to address |
| --- | --- |
| Access control | Check ownership and staff roles on the backend for every protected operation. Hiding a frontend button is insufficient. |
| Failed updates | Save a request change and its audit entry in one transaction. Roll back both when either write fails. |
| Notifications | Keep notification delivery separate from saving the request. A failed notification should be logged and retried without undoing a valid request update. |
| Reporting | Add indexes around actual filters and inspect queries using representative data. The matrix does not establish performance. |
| Data changes | Use versioned migrations for PostgreSQL; manage document/schema changes deliberately if MongoDB is chosen. |
| Dependencies | Keep supported versions, track updates and review packages. Express requires more assembly; an integrated framework still needs maintenance. |
| Recovery | Configure backups and verify restoration. A database choice alone does not provide an application recovery plan. |

