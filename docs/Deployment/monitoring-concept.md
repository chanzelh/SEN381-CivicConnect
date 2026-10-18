# Health Check, Logging & Monitoring Concept (#82)

## Health check

- Endpoint:
`GET /health` (public, no login)

- 200 `{ status: "ok", database: "ok" }`
when the API and database answer

- 503 `{ status: "degraded", database: "unavailable" }`
when the database
fails; no internal details (NFR-003)

- Tests:
`server/tests/api/REG-82.health-check.test.js` (both cases), run in
CI

- Used by: staging verification (#81) and availability monitoring (#89)

## Logging (current)

- Errors are written to the server console with `console.error` (e.g.
"Could not update request status")

- No passwords, tokens or request bodies are logged; debug logging is blocked
by ESLint `no-console` in the client (DEF-008)

- Limitation: logs are plain text on the server console only; they're lost on
restart

## What to monitor

| Signal | How | Alert when |
| --- | --- | --- |
| Availability | Poll `/health` every 30 s (#89 monitor) | 2 failed checks in a row |
| Errors | Count `console.error` lines | Sudden increase |
| Response time | k6 baseline from TC-P01 | p95 above 2 s (NFR-005) |
| Notification failures | "Could not create notification" log lines | Any, since they aren't retried (TD-005) |

## Production next steps (not built)

Structured JSON logs, log storage, an uptime service that alerts the team,
and HTTPS (NFR-003).
