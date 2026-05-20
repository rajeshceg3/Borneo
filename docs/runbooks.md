# Operational Runbooks

## Incident response steps
1. **Identify the Incident**: Acknowledge the alert from Grafana or another monitoring tool.
2. **Triaging**: Determine the severity and scope of the impact.
3. **Investigation**: Look into the logs (using Winston) and server metrics. Use the `/health` endpoint or specific service endpoints if available to check the status.
4. **Communication**: Inform stakeholders of the incident and expected time to resolution.
5. **Mitigation**: Apply immediate workarounds or fixes (e.g., restarting PM2 processes or scaling up resources).
6. **Resolution**: Deploy the final fix and monitor for stability.
7. **Post-Mortem**: Document the incident, root cause, and steps to prevent future occurrences.

## Recovery procedures
1. **Application Crash**: If the backend crashes, use PM2 to restart the service (`pm2 restart server.js`). Check `express-winston` logs for any fatal errors leading up to the crash.
2. **Data Loss**: Restore data from the latest backup. Verify data integrity using the `GET /attractions`, `GET /wildlife`, and `GET /trails` endpoints.
3. **Deployment Failure**: If a deployment fails, trigger the rollback workflow via GitHub Actions (see Rollback Strategy) using the last known good commit SHA.

## Offline mode fallback guide
1. **Service Worker**: The frontend uses a Service Worker (`sw.js`) to cache the application shell and critical API responses (`/offline-pack/download`).
2. **Local Storage**: Data from the `/offline-pack/download` endpoint is stored locally to ensure core functionality (map loading, viewing attractions, wildlife info) remains available.
3. **User Communication**: The UI should display a banner indicating the app is in offline mode when network connectivity is lost. Ensure users are aware that new data may not sync until connectivity is restored.
4. **Re-sync**: Once back online, the application should automatically attempt to fetch the latest data from the backend APIs.
