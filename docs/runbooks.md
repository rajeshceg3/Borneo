# Operational Runbooks

## Incident Response Steps
1. **Acknowledge and Triage**: Acknowledge the alert. Determine impact.
2. **Investigate**: Check application logs, metrics, and tracing to identify root cause.
3. **Mitigate**: Implement a temporary fix or rollback if possible.
4. **Resolve**: Apply a permanent fix and ensure tests are updated.
5. **Post-Mortem**: Document the incident, cause, and preventative measures.

## Recovery Procedures
- **Database Failure**: Restore from the latest snapshot. Check for data integrity.
- **Backend Service Down**: Restart the service. If it fails, check logs for recent deployment errors and rollback.
- **Frontend Issues**: Clear CDN cache or revert the recent frontend deployment.

## Offline Mode Fallback Guide
The app is designed to work offline via a Service Worker and cached assets.
- If the backend is unreachable, the Service Worker will serve the fallback `offline-pack.zip` or cached JSON responses.
- Ensure that users have previously loaded the app to cache the necessary data.
- If the map fails to load tiles, the Service Worker provides cached OSM tiles.
