# Operational Runbooks

## Incident Response Steps

1. **Acknowledge and Triage**: Confirm the alert and identify the severity (P1, P2, P3).
2. **Communicate**: Notify the team in the designated incident channel.
3. **Investigate**: Check metrics, logs, and dashboards to find the root cause.
4. **Mitigate**: Apply temporary fixes or rollbacks to restore service.
5. **Resolve**: Implement a permanent fix and verify.
6. **Post-Mortem**: Document the incident, root cause, and preventative measures.

## Recovery Procedures

### Database Recovery
- Restore from the latest snapshot if data corruption occurs.
- Verify data integrity post-restoration.

### Application Recovery
- If the application is down, check the deployment status and logs.
- Restart the application service or perform a rollback using the CI/CD pipeline if a recent deployment caused the issue.

## Offline Mode Fallback Guide

- The application uses a Service Worker to cache static assets and API responses.
- If the backend is unreachable, the Service Worker will serve cached data.
- Ensure that the offline package (`/offline-pack/download`) is regularly updated and accessible to users before they travel to areas without connectivity.
- Verify that critical user flows (map rendering, marker interaction) function without network access.
