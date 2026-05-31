# Operational Runbooks

## Incident Response Steps

1. **Acknowledge and Triage**: The on-call engineer should acknowledge the alert and begin assessing the impact (e.g., is the frontend inaccessible, is the API failing, or are there data issues?).
2. **Identify the Root Cause**: Check the logs (via Grafana/CloudWatch), inspect recent deployments, and review the current system state.
3. **Mitigate**: If a recent deployment caused the issue, trigger the instant rollback via the CI/CD pipeline (`Rollback` workflow). If it is a dependency or infrastructure issue, escalate to the appropriate team or service provider.
4. **Communicate**: Post an update in the appropriate channels (e.g., #incidents) detailing the issue, current status, and ETA for resolution.
5. **Resolve and Monitor**: Once the issue is resolved, monitor the system to ensure stability.
6. **Post-Mortem**: Document the incident, root cause, timeline, and action items to prevent recurrence.

## Recovery Procedures

*   **Database Failure**: Restore from the latest automated snapshot.
*   **Application Server Failure**: Scale up new instances or restart the affected services. Ensure the auto-scaling groups are functioning correctly.
*   **CDN/Caching Issue**: Invalidate the CDN cache.
*   **Rollback Procedure**: Use the `Rollback` GitHub Actions workflow. Provide the target commit hash to revert the tree state safely.

## Offline Mode Fallback Guide

The application is designed to function entirely offline in remote rainforest areas.

1.  **Pre-requisites**: Users must load the app at least once while having an internet connection. The Service Worker will automatically cache the necessary assets, including UI elements and the static offline bundle (`/offline-pack/download`).
2.  **Offline Pack**: The backend provides an offline package containing map tiles, images, and JSON data. Ensure the frontend successfully fetched and cached this pack before heading offline.
3.  **Troubleshooting**:
    *   If the map is not loading, ensure the user didn't clear their browser cache or Service Worker storage.
    *   If data is missing, the user might not have completed the initial data load. Advise them to connect to a network and allow the app to fully load.
    *   The Service Worker intercepts network requests; if a request fails, it serves the cached fallback response. Ensure the fallback mechanisms in the frontend API client are active.
