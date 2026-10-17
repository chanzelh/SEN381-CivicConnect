# Staging Environment & Parity (#80)
**Type:** simulated staging (local), as permitted by the M3 brief.
**Release candidate:** `
v3.0-rc1` (commit <hash>), deployed <date>.
## How staging is separated from development
| | Development | Staging | CI |
|---|---|---|---|
| Database | civicconnect
dev | civicconnect
_
_
staging | throwaway container |
| Config | .env | .env.staging (NODE
_
ENV=production) | workflow env |
| JWT secret | dev value | separate random value | disposable CI value |
| Client | Vite dev server | **built** files (`
vite preview
`) | built in CI |
| Server | nodemon (auto-restart) | plain node | jest/supertest |
| Data | developers' own | schema + seed only | schema + seed only |
## Parity with production (what's the same / different)
| Aspect | Same as production? | Note |
|---|---|---|
| Code version | Yes | Exact tag v3.0-rc1 |
| Built client | Yes | Same
`
npm run build`
output |
| Node.js | Yes (22) | |
| PostgreSQL | **Differs** | Local 18; CI 16; production would be fixed to
one version |
| HTTPS | **No** | Plain HTTP locally; required in production (NFR-003) |
| Ports / URLs | **No** | API URL and CORS origin are hardcoded to localhost
|
| Load / users | **No** | One machine; real load only estimated by TC-P01 |
| Secrets | Partly | Separate staging secret; production would use a secret
store |
## Start-up commands
Stop any running `npm run dev` terminals first.

### Terminal 1 — Backend (Staging)

```powershell
cd CivicConnectCode\server
$env:DOTENV_CONFIG_PATH=".env.staging"
node -r dotenv/config src/server.js
```

### Terminal 2 — Frontend (Staging)

```powershell
cd CivicConnectCode\client
npm run build
npx vite preview --port 5173 --strictPort
```
## Limitations
Local machine only; hardcoded localhost URLs would need configuration before
a real deployment.