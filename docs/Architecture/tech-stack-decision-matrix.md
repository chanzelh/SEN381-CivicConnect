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
| Requirements & ASR Fit | 20% | 4 | 0.80 | 4 | 0.80 |
| Team Capability | 20% | 4 | 0.80 | 5 | 1.00 |
| Security | 15% | 4 | 0.60 | 4 | 0.60 |
| Maintainability | 15% | 4 | 0.60 | 4 | 0.60 |
| Schedule | 10% | 4 | 0.40 | 5 | 0.50 |
| Deployment Compatibility | 10% | 4 | 0.40 | 4 | 0.40 |
| Cost & Licensing | 5% | 4 | 0.20 | 4 | 0.20 |
| Ecosystem & Dependency Risk | 5% | 4 | 0.20 | 4 | 0.20 |
| **Total** | **100%** |  | **4.00 / 5** |  | **4.30 / 5** |

---

## Scoring Justification

### Requirements & ASR Fit

**.NET – 4/5**

.NET can support the CivicConnect requirements and identified ASRs, including authentication, role-based access, controlled status changes, auditability and separation of responsibilities. It can also support the selected modular layered monolith architecture.

**Node.js – 4/5**

Node.js can also support the identified requirements and ASRs and can be structured as a modular layered monolith. The current project requirements do not provide a strong reason to favour either stack in this area.

### Team Capability

**.NET – 4/5**

.NET is a suitable option and has previously been considered within the project, including the use of .NET tooling in Assignment 2.

**Node.js – 5/5**

Team review identified greater comfort with Node.js, particularly for REST API development and handling requests and responses. This reduces learning and implementation risk for the team.

### Security

**.NET – 4/5**

.NET can support CivicConnect's authentication, role-based access and sensitive-data protection requirements.

**Node.js – 4/5**

Node.js can also support the required security controls. There is not enough project-specific evidence to claim that either technology is automatically more secure, so both receive the same score.

### Maintainability

**.NET – 4/5**

.NET can support clear separation between application responsibilities and fits the selected modular layered monolith architecture.

**Node.js – 4/5**

Node.js can also support a modular layered structure and clear separation of responsibilities. The maintainability of either option will depend on how the application is structured and managed.

### Schedule

**.NET – 4/5**

.NET is suitable for development within the available project timeframe.

**Node.js – 5/5**

The team's greater comfort with Node.js, particularly for the planned API development, is expected to reduce learning and implementation time within the project schedule.

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

Node.js achieved a weighted score of **4.30/5**, compared with **4.00/5** for .NET, giving Node.js a weighted advantage of **0.30 points**.

Both technology stacks can support the CivicConnect requirements and selected modular layered monolith architecture. Node.js scored higher mainly because team review identified greater familiarity and comfort with Node.js for the project's REST API development.

Based on the weighted evaluation and team review, the selected technology stack is:

**Node.js with Express and PostgreSQL.**

---

## Justification Narrative

Node.js was selected because both stacks can meet the CivicConnect requirements and ASRs, while team review identified greater comfort with Node.js for REST API development. This reduces learning and implementation risk within the project schedule.

The final technology decision will be recorded in the CivicConnect Decision Log as an ADR.
