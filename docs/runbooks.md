# Operational Runbooks

This document outlines the operational procedures for the Borneo Rainforest Travel App, including incident response, recovery procedures, and an offline mode fallback guide.

## Incident Response Steps

When an incident occurs (e.g., API downtime, frontend application crash, or performance degradation), follow these steps to triage and mitigate the issue.

### 1. Identify and Triage
- **Acknowledge the alert**: Confirm receipt of the monitoring alert (e.g., API failures or high latency).
- **Assess Impact**: Determine if the issue is isolated to a specific service (e.g., offline packaging) or affecting core features like Map loading or Navigation.

### 2. Investigate Root Cause
- Check the backend logs for errors (`/backend` Winston logs).
- Verify the status of external services (CDN, Mapbox/OpenStreetMap tile servers).
- Check the latest deployments in the CI/CD pipeline for recently introduced issues.

### 3. Mitigate
- If the issue stems from a recent deployment, perform an instant rollback (see Recovery Procedures).
- If the backend API is unreachable, ensure the frontend gracefully degrades to the Offline Mode Fallback.
- Scale up backend resources if the incident is caused by high traffic load.

### 4. Post-Incident Review
- Document the timeline, root cause, and resolution.
- Identify action items to prevent recurrence.

## Recovery Procedures

### Rollback
If a faulty deployment causes critical issues, initiate an instant rollback using the GitHub Actions workflow.

1. Navigate to the **Actions** tab in the GitHub repository.
2. Select the **Rollback** workflow.
3. Click **Run workflow**.
4. Provide the **target commit SHA** to rollback to.
5. The workflow will automatically revert the tree state to the specified commit and push it.

### Data Recovery
The application uses a JSON datastore. In case of data corruption:
1. Revert to the last known good state of the JSON data files in `backend/data/`.
2. Redeploy the backend service.

## Offline Mode Fallback Guide

The Borneo app is designed to function reliably even when offline, particularly in remote rainforest locations.

### Expected Behavior
- When the device loses network connectivity, the Service Worker (`sw.js`) intercepts network requests.
- Static assets, map tiles, and JSON data are served from the local cache.
- The UI should continue to function normally without showing standard browser offline error pages.

### Troubleshooting Offline Mode
If users report that offline mode is failing:
1. **Verify Offline Package Generation**: Check if the backend `/offline-pack/download` endpoint is functioning and returning a valid zip file.
2. **Check Service Worker Registration**: Ensure the Service Worker is correctly registering on the frontend and not throwing errors during the install or activate phases.
3. **Inspect Cache Contents**: Use browser developer tools (Application > Cache Storage) to verify that the necessary assets (tiles, images, JSON) are successfully cached.
4. **Clear Cache and Re-download**: Instruct users to connect to a reliable network, clear their app cache, and download the offline package again.
