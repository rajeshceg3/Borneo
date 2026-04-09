# Borneo Rainforest App - Operational Runbooks

## Incident Response Steps

1. **Acknowledge:** Acknowledge the alert (e.g. from Prometheus/Grafana) and notify the team.
2. **Assess:** Determine the severity (e.g. total outage, partial degradation).
3. **Investigate:** Check logs (Winston), monitor dashboards, verify recent deployments.
4. **Mitigate:** Apply immediate fixes (e.g., rollback deployment, restart services).
5. **Resolve:** Identify the root cause and apply a permanent fix.
6. **Post-Mortem:** Document the incident, root cause, timeline, and action items to prevent recurrence.

## Recovery Procedures

### Backend API Failure
1. Verify the Render service status.
2. Check for recent database or code changes that might cause failures.
3. If necessary, trigger a rollback to the previous stable release using the CI/CD pipeline.
4. Restart the Node.js application via the Render dashboard if the service is stuck.

### Frontend Failure
1. Verify the Vercel deployment status.
2. If the issue is related to a recent deployment, use the Vercel dashboard to revert to the last working deployment.
3. Ensure static assets are cached correctly and the CDN is functioning.

## Offline Mode Fallback Guide

If the application loses internet connectivity, the offline mode fallback is activated:
1. **Service Worker:** The app uses a Service Worker (`sw.js`) to cache static assets, map tiles, and API responses.
2. **User Experience:** Users should still be able to navigate the map and view attractions seamlessly.
3. **Troubleshooting Offline Mode:**
   - Verify that the Service Worker is registered properly in the browser.
   - Check if the initial download of the offline package was successful.
   - Instruct users to ensure they have downloaded the offline package before their trip.
