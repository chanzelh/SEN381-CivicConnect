# SEN381-CivicConnect
Community Service Request Management Platform - SEN381 Integrated Team Project.

## About
CivicConnect is a controlled digital platform for submitting, managing, monitoring 
and reporting on community service requests, replacing a fragmented email/phone/
spreadsheet-based process.

## Team
Group L: Chanzél, Alyssa, Kaylee

## Status
Milestone 1: Engineering Foundation & Requirements Baseline -Complete  
Milestone 2: Architecture, Technology & Initial Design Baseline -Complete
Milestone 3: Controlled Construction, Integration, Quality & Release Readiness -Ongoing
Milestone 4: Finalize, Consolidate & Conclude -Not started

## Setup Instructions:
## 1. App Setup
Insert Notes here @ Kaylee

## 2. Local setup and running tests

### Prerequisites
- Node.js 22, PostgreSQL 16+ (pgAdmin 4 optional), Git

### 1. Install dependencies
```bash
cd CivicConnectCode/server && npm install
cd ../client && npm install
```

### 2. Create two local databases
| Database | Used for | Created from |
|---|---|---|
| `civicconnect_dev` | Running the app (`npm run dev`) | `server/db/schema.sql` then `server/db/seed.sql` |
| `civicconnect_test` | Automated tests (**wiped by tests**) | `server/db/schema.sql` then `server/db/seed.sql` |

In pgAdmin: right-click **Databases → Create → Database**, enter the name, then on that database open **Tools → Query Tool**, open `schema.sql` and run (F5), then `seed.sql` and run (F5).
Or with psql:
```bash
createdb civicconnect_test
psql -d civicconnect_test -f CivicConnectCode/server/db/schema.sql -f CivicConnectCode/server/db/seed.sql
```

### 3. Create env files in `CivicConnectCode/server/` (both are gitignored, never commit them)
`.env` (app):
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=civicconnect_dev
DB_USER=postgres
DB_PASSWORD=<your local postgres password>
JWT_SECRET=<any long random text>
```
`.env.test` (tests): same, but `DB_NAME=civicconnect_test`.

### 4. Test accounts (from seed.sql, test-only)
| Role | Email | Password |
|---|---|---|
| Requester | requester@test.civicconnect.local | CivicTest#2026 |
| Staff | staff@test.civicconnect.local | CivicTest#2026 |
| Management | management@test.civicconnect.local | CivicTest#2026 |

### 5. Run the app
```bash
cd CivicConnectCode/server && npm run dev     # http://localhost:5000
cd CivicConnectCode/client && npm run dev     # http://localhost:5173
```

### 6. Run the tests
```bash
cd CivicConnectCode/server && npm test        # unit + API tests (needs civicconnect_test)
cd CivicConnectCode/client && npm test        # client unit tests
cd CivicConnectCode/client
npx playwright install chromium firefox     # once; Edge uses the installed browser
npx playwright test                          # E2E journeys (stop your own dev servers first)
npx playwright test --project=msedge         # Edge only, if disk space is short
```
E2E starts the API and client itself, using `server/.env.test` (the test database).
```
Server tests run one file at a time (`maxWorkers: 1`) because API tests share and reset the test database. CI runs the same tests automatically on every PR (see `docs/Quality/ci-pipeline.md`).