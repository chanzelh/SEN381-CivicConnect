# Technology Stack Decision Matrix

## Candidates Considered

### Option A – .NET Stack

- Frontend: ASP.NET Core MVC / Razor
- Backend/Runtime: C# with ASP.NET Core
- Persistence: PostgreSQL with Entity Framework Core
- Build/Dependency Management: .NET SDK and NuGet
- Testing: .NET testing tools

### Option B – Node.js Stack

- Frontend: HTML/CSS/JavaScript
- Backend/Runtime: Node.js with Express
- Persistence: PostgreSQL
- Build/Dependency Management: npm
- Testing: Node.js testing tools

Both options are technically viable for CivicConnect and can support the selected modular layered monolith architecture.

---

## Evaluation Criteria & Weights

The technology stacks were evaluated against the project requirements, ASRs, team capability, schedule, security, maintainability, deployment compatibility, cost and licensing, and ecosystem and dependency risk.

| Criterion | Weight |
|---|---:|
| Requirements & ASR Fit | 20% |
| Team Capability | 20% |
| Security | 15% |
| Maintainability | 15% |
| Schedule | 10% |
| Deployment Compatibility | 10% |
| Cost & Licensing | 5% |
| Ecosystem & Dependency Risk | 5% |
| **Total** | **100%** |

Requirements and ASR fit and team capability receive the highest weighting because the selected technology must support the CivicConnect requirements while remaining realistic for the development team.

Security and maintainability also receive significant weighting because they are important quality drivers identified for CivicConnect.

### Scoring Scale

- **1** – Poor fit
- **2** – Weak fit
- **3** – Acceptable fit
- **4** – Good fit
- **5** – Very strong fit

---

## Scoring Matrix

| Criterion | Weight | .NET Score | .NET Weighted | Node.js Score | Node.js Weighted |
|---|---:|---:|---:|---:|---:|
| Requirements & ASR Fit | 20% | 5 | 1.00 | 4 | 0.80 |
| Team Capability | 20% | 5 | 1.00 | 3 | 0.60 |
| Security | 15% | 4 | 0.60 | 4 | 0.60 |
| Maintainability | 15% | 5 | 0.75 | 4 | 0.60 |
| Schedule | 10% | 5 | 0.50 | 3 | 0.30 |
| Deployment Compatibility | 10% | 4 | 0.40 | 4 | 0.40 |
| Cost & Licensing | 5% | 4 | 0.20 | 4 | 0.20 |
| Ecosystem & Dependency Risk | 5% | 4 | 0.20 | 4 | 0.20 |
| **Total** | **100%** |  | **4.65 / 5** |  | **3.70 / 5** |

---

## Scoring Justification

### Requirements & ASR Fit

**.NET – 5/5**

.NET provides a strong fit for the CivicConnect requirements and identified ASRs, including authentication, role-based access, controlled status changes, auditability and separation of responsibilities. It can also support the selected modular layered monolith architecture.

**Node.js – 4/5**

Node.js can also support the identified requirements and ASRs and can be structured as a modular layered monolith. It remains a strong alternative for the project.

### Team Capability

**.NET – 5/5**

.NET is already familiar within the project context and has previously been considered in Assignment 2, including the use of the .NET SDK and `dotnet test` for CI and automated testing.

**Node.js – 3/5**

Node.js is a realistic alternative, but the current project documentation provides less evidence of its use within the planned CivicConnect development environment.

### Security

**.NET – 4/5**

.NET can support CivicConnect's authentication, role-based access and sensitive-data protection requirements.

**Node.js – 4/5**

Node.js can also support the required security controls. There is not enough project-specific evidence to claim that either technology is automatically more secure, so both receive the same score.

### Maintainability

**.NET – 5/5**

.NET can support clear separation between application responsibilities and fits well with the selected modular layered monolith architecture.

**Node.js – 4/5**

Node.js can also support a modular layered structure. It therefore remains a strong option for maintainability when the application is structured and managed correctly.

### Schedule

**.NET – 5/5**

The available project work already includes consideration of .NET tooling, which reduces the amount of additional technology planning required before development begins.

**Node.js – 3/5**

Node.js could also be implemented within the project timeframe, but less project-specific planning for the Node.js development environment has been documented so far.

### Deployment Compatibility

**.NET – 4/5**

.NET provides realistic deployment options for CivicConnect and there are currently no identified project constraints that make it unsuitable.

**Node.js – 4/5**

Node.js also provides realistic deployment options. The current project evidence does not show a significant deployment advantage for either stack.

### Cost & Licensing

**.NET – 4/5**

No significant cost or licensing constraint has been identified that would prevent the use of .NET for CivicConnect.

**Node.js – 4/5**

No significant cost or licensing constraint has been identified that would prevent the use of Node.js for CivicConnect.

### Ecosystem & Dependency Risk

**.NET – 4/5**

.NET provides suitable development and dependency-management tools. Dependencies and versions would need to be controlled and documented throughout development.

**Node.js – 4/5**

Node.js also provides suitable development and dependency-management tools. Dependencies and versions would similarly need to be controlled and documented throughout development.

---

## Result

The .NET stack achieved a weighted score of **4.65/5**, while the Node.js stack achieved **3.70/5**, giving .NET a weighted advantage of **0.95 points**.

Both technology stacks are technically viable for CivicConnect. Based on the current evaluation, the selected technology stack is:

**C# / ASP.NET Core with PostgreSQL.**

The main factors contributing to the result are requirements and ASR fit, team capability, maintainability and schedule.

---

## Justification Narrative

The .NET stack was selected because it achieved the strongest overall score against the current CivicConnect evaluation criteria.

Both .NET and Node.js can support the selected modular layered monolith architecture and the project's security, auditability and maintainability requirements.

Previous CivicConnect research has also considered .NET tooling. Assignment 2 referred to using an agreed .NET SDK version and `dotnet test` as part of the project's CI and automated testing approach.

Node.js remains a viable alternative and scored equally in security, deployment compatibility, cost and licensing, and ecosystem and dependency risk because the current project evidence does not justify claiming a significant advantage for either technology in these areas.

Based on the weighted evaluation, .NET currently provides the stronger overall fit for CivicConnect.

The selected technology stack and reasoning will be recorded in the CivicConnect Decision Log as an Architecture Decision Record (ADR).