# Operational Runbooks

## Incident Response Steps
1. **Acknowledge and Triage**: Acknowledge the alert, verify the impact, and assign a severity level.
2. **Investigate**: Check application logs, performance metrics, and infrastructure status to identify the root cause.
3. **Mitigate**: Apply temporary workarounds or rollbacks to restore service quickly.
4. **Resolve**: Implement the permanent fix and deploy it.
5. **Post-Mortem**: Document the incident, root cause, and steps to prevent future occurrences.

## Recovery Procedures
- **Database Restoration**: Restore the data from the latest automated backup.
- **Service Restart**: Restart affected services using process managers (e.g., PM2) or orchestration tools.
- **Rollback Deployment**: Revert to the previous stable release using the CI/CD pipeline or deployment platform controls.

## Offline Mode Fallback Guide
- **Service Worker Check**: Ensure the Service Worker (`sw.js`) is registered and actively caching assets.
- **Cache Verification**: Verify that essential assets (HTML, CSS, JS, map tiles) are present in the browser cache.
- **Data Fallback**: Confirm the app gracefully falls back to cached JSON data when backend APIs are unreachable.
- **User Notification**: Display a clear, non-intrusive indicator to the user that the app is currently operating in offline mode.
