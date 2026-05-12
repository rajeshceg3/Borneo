# Operational Runbooks

This document outlines the operational procedures for managing and maintaining the Borneo Rainforest Travel Experience App.

## Incident Response Steps

When a critical incident occurs (e.g., app crash, API downtime, map not loading), follow these steps:

1. **Acknowledge & Triage**
   - Confirm the incident via monitoring alerts or user reports.
   - Determine severity (Critical, High, Medium, Low).
   - Assign an Incident Commander.

2. **Investigate & Diagnose**
   - Check application logs (Frontend telemetry, Backend Winston logs).
   - Check infrastructure metrics (CPU, Memory, Network).
   - Verify if recent deployments or changes caused the issue.

3. **Mitigate & Resolve**
   - Apply a fix or workaround (e.g., rollback deployment, restart services).
   - If API is down, ensure offline fallback is engaged.
   - Deploy hotfix if necessary.

4. **Verify & Recover**
   - Confirm the issue is resolved by checking logs and testing the application.
   - Monitor closely for the next 1-2 hours.

5. **Post-Incident Review**
   - Conduct a blameless post-mortem.
   - Document root cause, timeline, and action items to prevent recurrence.

## Recovery Procedures

### Service Restart
- **Backend:** Restart the Express server (`pm2 restart backend` or equivalent depending on hosting).
- **Frontend:** Usually requires redeployment or cache invalidation on the CDN.

### Database/Data Store Recovery
- Since the current datastore is JSON-based, restore the `backend/data/` directory from version control or a recent backup.

### Rollback Strategy
- Use the instant rollback CI/CD workflow to revert to a previous stable state.
- Ensure any CDN caches are purged after a rollback.

## Offline Mode Fallback Guide

The application is designed to operate offline, but sometimes manual intervention or specific understanding is needed.

### Expected Behavior Offline
- The Service Worker (`frontend/public/sw.js`) intercepts network requests.
- Static assets (HTML, CSS, JS, Images) are served from cache.
- Map tiles are served from the local cache.
- API requests (`/api/attractions`, `/api/wildlife`) return cached responses or default fallback data.

### Troubleshooting Offline Issues
- **Cache Missing:** If assets are missing offline, ensure the Service Worker installed correctly on the first visit with an active connection.
- **Stale Data:** To force an update, clear the browser cache or increment the Service Worker cache version.
- **Tile Gaps:** Ensure the user previously zoomed into the area while online, or downloaded the offline pack.

### Manual Fallback Verification
1. Open the app online.
2. Navigate the map and open a few cards.
3. Disconnect from the internet (DevTools -> Network -> Offline).
4. Refresh the page.
5. Verify the map loads, markers are clickable, and cards show cached information without errors.
