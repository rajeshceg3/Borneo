# Operational Runbooks

## Incident Response Steps

1. **Acknowledge**: Immediately acknowledge the incident alert in the monitoring channel.
2. **Assess**: Determine the severity and impact of the incident.
3. **Communicate**: Notify stakeholders about the ongoing issue and estimated resolution time.
4. **Investigate**: Identify the root cause by checking logs, metrics, and recent deployments.
5. **Mitigate**: Apply temporary fixes or rollbacks to restore service as quickly as possible.
6. **Resolve**: Implement a permanent fix and verify its effectiveness.
7. **Post-Mortem**: Document the incident, root cause, and steps to prevent future occurrences.

## Recovery Procedures

- **Database Failure**: Restore from the latest snapshot and verify data integrity.
- **Service Outage**: Restart the affected service or scale up resources.
- **Deployment Issue**: Execute the instant rollback CI/CD workflow (`.github/workflows/rollback.yml`).

## Offline Mode Fallback Guide

If the primary online services are unavailable, users should still have access to the app's core features via the offline mode.
- Ensure that the Service Worker (`frontend/public/sw.js`) is correctly caching essential assets and map tiles.
- Verify that the offline packager (`GET /offline-pack`) endpoint is functioning properly when online, allowing users to pre-download content.
- If the offline mode fails, provide users with troubleshooting steps, such as clearing browser cache or re-downloading the offline package.
