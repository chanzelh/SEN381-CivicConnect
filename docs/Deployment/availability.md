
# Availability Monitoring (#89, NFR-008)

**Target:** ≥ 99% availability over the test period (NFR-008).

**Method:** `operations/availability-monitor.js` polled `GET /health` on staging (v3.0-rc1) every 30 seconds for 60 minutes. A check counts as **up** only if it returns HTTP 200 within 5 seconds (the health check also confirms the database answers).

**Period:** 13:38 – 14:38 UTC (15:38 – 16:38 SAST), 17 October 2026

## Result

| Checks | Up | Down | Availability | Target | Result |
| --- | --- | --- | --- | --- | --- |
| 120 | 120 | 0 | 100.00% | ≥ 99% | MET |

**Evidence:** `CivicConnectCode/operations/availability-log.csv`

## Limitations

- **Short window:** 1 hour can't show issues that appear over days (memory leaks, restarts).
- **Local:** The monitor and server ran on the same machine, so external network failures were not tested. Real availability would be measured from outside, e.g. an uptime service.
- **Light load:** Availability was measured without real users; TC-P01 covers behaviour under load separately.
