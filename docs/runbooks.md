# Operational Runbooks

## Incident response steps

1. **Acknowledge**: Respond to the alert or incident report within the defined SLA.
2. **Assess**: Determine the impact and severity of the incident.
3. **Isolate**: If the issue is related to a specific component (e.g., API server, database), isolate it to prevent further impact.
4. **Investigate**: Check logs, metrics, and error dashboards (e.g., Grafana) to identify the root cause.
5. **Mitigate/Resolve**: Apply a fix, restart services, or trigger a rollback if necessary.
6. **Communicate**: Keep stakeholders informed throughout the incident.
7. **Post-Mortem**: Document the incident, root cause, and actions taken to prevent recurrence.

## Recovery procedures

*   **API Server Failure**: Restart the backend application using the deployment orchestration tool. If the issue persists, rollback to the previous stable release.
*   **Frontend Degradation**: Clear CDN cache or rollback the frontend deployment if a recent change introduced issues.
*   **Database Outage**: Switch to a read replica if available, or restore from the latest snapshot.
*   **Rollback Mechanism**: Use the CI/CD rollback workflow (`.github/workflows/rollback.yml`) to quickly revert to a known good commit.

## Offline mode fallback guide

1. Ensure users have the latest version of the app.
2. Advise users to download the offline package before entering areas with poor connectivity.
3. The app's Service Worker will automatically serve cached map tiles, attraction data, and assets when the network is unavailable.
4. If offline mode fails, check the user's local storage and Service Worker registration status.
5. Provide instructions to clear cache and re-download the offline package if data is corrupted.
