# Operational Runbooks

## Incident Response Steps

1. **Acknowledge the Alert**: Ensure that the alert is recognized and assigned to an on-call engineer.
2. **Assess Severity**: Determine the impact of the incident (e.g., Critical, High, Medium, Low).
3. **Communicate**: Notify stakeholders about the ongoing issue and estimated time to resolution.
4. **Investigate**: Check logs using Winston in the backend, performance tracking in the frontend, and verify network connectivity.
5. **Mitigate**: Apply temporary fixes or workarounds if a full resolution takes longer.
6. **Resolve**: Deploy the fix and ensure services return to a healthy state.
7. **Post-Mortem**: Document what happened, why it happened, and how to prevent it in the future.

## Recovery Procedures

### Database/State Recovery
- **Backend JSON State**: Restore the latest valid JSON state from backup if corrupted.
- **Service Disruption**: Restart PM2 instances for the backend API and frontend servers.

### Rollback Strategy
If a bad deployment is detected:
1. Navigate to the GitHub Actions tab.
2. Select the **Rollback** workflow.
3. Click "Run workflow".
4. Enter the `target_commit` hash of the last known good state.
5. Confirm the rollback completes and the system stabilizes.

## Offline Mode Fallback Guide

When the app is offline or the backend is unreachable:
- Ensure the Service Worker (`sw.js`) is correctly caching static assets and OpenStreetMap tiles.
- Verify the offline package download functionality is caching the bundled assets for locations without signal.
- Encourage users to download the offline package before their trips.
- If data fails to load, check that the pre-cached fallback responses in the Service Worker are served effectively to maintain app usability.
