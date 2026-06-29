# Operational Runbooks

## Incident response steps
1. Acknowledge the alert (e.g. from Grafana/PagerDuty).
2. Identify the impacted service (Frontend, Backend, Database).
3. If the backend is unreachable, check server health and logs using PM2 / Vercel logs.
4. Assess the impact and attempt to isolate the issue.
5. Apply immediate mitigations (like spinning up additional instances or bypassing CDN caching if it is a caching issue).
6. Resolve and perform a post-mortem.

## Recovery procedures
1. In case of a bad deployment, utilize the CI/CD instant rollback pipeline (`.github/workflows/rollback.yml`) to revert to the last known stable state.
2. If data is corrupted, restore from the last hourly backup.
3. Verify the system is functioning normally by running E2E and operational readiness tests.

## Offline mode fallback guide
1. The app is built to work offline through a Service Worker.
2. If the user experiences no connectivity, they should still be able to access pre-cached data and map tiles.
3. Ensure the Service Worker (`frontend/public/sw.js`) is correctly caching static assets and the offline JSON pack.
4. If offline mode fails, instruct the user to ensure they downloaded the latest offline pack via the "Download Offline Pack" feature before losing signal.
