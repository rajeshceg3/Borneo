# Operational Runbooks

## Incident Response Steps

1. **Acknowledge the Incident:** Respond to the alert (e.g., in Slack or PagerDuty) to let the team know you are investigating.
2. **Assess the Impact:** Determine the severity and scope of the incident. Are all users affected? Is a specific feature broken?
3. **Communicate:** Update the status page or communicate directly with users if necessary. Keep the team informed of progress.
4. **Investigate:** Check logs (Winston logs in the backend), metrics (Grafana, Performance Tracking), and recent changes to identify the root cause.
5. **Mitigate:** Apply a quick fix, rollback, or scale resources to restore service as quickly as possible.
6. **Resolve:** Implement a permanent fix and verify it in staging before deploying to production.
7. **Post-Mortem:** Conduct a blameless post-mortem to analyze the incident, identify what went wrong, and implement preventative measures.

## Recovery Procedures

### Backend API Failure
1. Verify if the database (or JSON datastore) is accessible.
2. Check server resource utilization (CPU, memory).
3. Restart the backend service using PM2: `pm2 restart borneo-backend`.
4. If the failure persists, consider reverting the last deployment.

### Frontend Serving Issue
1. Check Vercel deployment status and build logs.
2. If there's an issue with the latest build, rollback to a previously successful deployment via the Vercel dashboard.
3. Verify CDN cache status; clear cache if necessary.

## Offline Mode Fallback Guide

The Borneo app is designed to work offline, but if users experience issues, guide them through these steps:

1. **Ensure Initial Load:** The user MUST have opened the app at least once while connected to the internet to cache static assets, map tiles, and JSON data.
2. **Check Service Worker Registration:** The Service Worker (`frontend/public/sw.js`) handles offline caching. Instruct users to ensure their browser supports and has enabled Service Workers.
3. **Cache Storage Limits:** If the user's device is low on storage, the browser might evict cached data. Advise users to clear space.
4. **Manual Offline Package:** If the Service Worker fails, instruct users to download the offline package directly via the `/offline-pack/download` endpoint while they have a connection, and extract it locally if a standalone offline viewer is available (future feature).
5. **No Data Fallback:** If data cannot be loaded, the app should display gracefull fallback messages (e.g., "Wildlife data not available offline"). Verify these messages are visible and not throwing unhandled exceptions.