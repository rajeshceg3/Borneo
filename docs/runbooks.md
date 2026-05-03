# Operational Runbooks

## Incident Response Steps
1. **Identify the Incident**: Acknowledge the alert from monitoring systems (e.g., API failure, downtime).
2. **Triaging**: Assess the severity of the incident. Determine if it affects a subset of users or the entire application.
3. **Investigation**:
    - Check backend logs (Winston) for errors.
    - Check frontend telemetry.
    - Check server/CDN health.
4. **Resolution**: Apply a fix or trigger a rollback if a recent deployment caused the issue.
5. **Post-Mortem**: Document the incident, root cause, and steps taken to prevent future occurrences.

## Recovery Procedures
- **Database/Data Store Failure**: If the JSON datastore fails, ensure the offline bundle is still accessible via the CDN.
- **Backend API Downtime**: Implement temporary static fallback responses on the frontend/service worker until the API is restored.
- **Rollback Deployment**: Use the GitHub Actions Rollback workflow to revert to the last known good state if a bad deployment occurs.

## Offline Mode Fallback Guide
- **Pre-Caching**: The Service Worker aggressively pre-caches essential map tiles, static assets, and data JSONs on the first load.
- **Network Failure**: If the app detects a network failure, it should gracefully switch to cached data.
- **Data Freshness**: The offline bundle should be updated periodically when a connection is available.
- **User Messaging**: Notify the user that they are in offline mode with a subtle UI indicator, avoiding alarming error messages.
