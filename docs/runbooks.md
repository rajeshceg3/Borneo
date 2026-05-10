# Operational Runbooks

## Incident Response Steps

1. **Acknowledge**: First responder to acknowledge the alert in Slack/PagerDuty.
2. **Assess**: Determine severity (e.g., SEV1 for full outage, SEV2 for degraded performance, SEV3 for minor issues).
3. **Communicate**: Start a dedicated incident Slack channel and notify relevant stakeholders.
4. **Investigate**:
   - Check application logs via monitoring tools or dashboard (Grafana/Kibana).
   - Review recent deployments or infrastructure changes.
   - Monitor system metrics (CPU, Memory, API latencies).
5. **Mitigate**: Apply temporary fixes, such as scaling resources or activating fallback features, to restore service.
6. **Resolve**: Fix the root cause and ensure full service availability.
7. **Post-Mortem**: Document incident details, root cause, and preventative measures in a post-mortem report.

## Recovery Procedures

### API Failure Recovery
- Check the status of the backend API servers.
- Ensure the database is accessible and responsive.
- If a recent code change caused the failure, rollback using `.github/workflows/rollback.yml`.
- Verify the DNS and network connectivity to the API endpoints.

### Frontend Failure Recovery
- Verify CDN status and clear CDN cache if necessary.
- Check for recent frontend deployment issues.
- Re-run frontend build and deployment pipelines if a bad bundle was deployed.
- Use `.github/workflows/rollback.yml` if rollback is needed.

### Database/Store Recovery
- If the offline datastore or primary database is corrupted, restore from the latest snapshot.
- Validate data integrity post-restoration.

## Offline Mode Fallback Guide

The application is designed to function gracefully even when the user has limited or no internet connectivity. Follow these guidelines to ensure the offline mode fallback works correctly:

1. **Service Worker Configuration**:
   - Ensure the service worker (`frontend/public/sw.js`) is correctly registered and caching static assets, map tiles, and critical API responses.
2. **Caching Strategy**:
   - The app preloads map tiles and caches JSON data from `/offline-pack/download`.
   - If the backend is unreachable, the frontend will serve the last cached JSON payload and images from local storage.
3. **Fallback UI**:
   - The UI should indicate when the app is in offline mode (e.g., a subtle "Offline Mode" indicator).
   - Real-time features or non-cached data requests should fail gracefully, providing clear messages to the user without breaking the core experience.
4. **Resyncing**:
   - Once connectivity is restored, the service worker should seamlessly fetch the latest data in the background and update the local cache.
