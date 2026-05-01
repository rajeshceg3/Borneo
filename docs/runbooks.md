# Operational Runbooks

This document contains operational procedures for the Borneo Rainforest Travel Experience App.

## Incident response steps

1. **Acknowledge:** The on-call engineer acknowledges the alert in PagerDuty or the relevant alerting system.
2. **Assess:** Determine the severity and scope of the incident. Check logs and monitoring dashboards.
3. **Communicate:** Notify stakeholders and users if the impact is significant (e.g., via status page).
4. **Mitigate:** Apply temporary fixes to restore service as quickly as possible. This may involve rolling back to a previous stable release using the Rollback workflow.
5. **Resolve:** Implement a permanent fix for the root cause of the incident.
6. **Post-Mortem:** Document the incident, root cause, timeline, and action items to prevent future occurrences.

## Recovery procedures

### Backend Services Down

1. Verify server status in the hosting provider's dashboard (e.g., AWS, Render).
2. Check backend application logs for crashes or unhandled exceptions.
3. Restart the backend service if necessary.
4. Verify database or datastore connectivity.

### Frontend Unavailable

1. Check CDN status (e.g., Cloudflare, Vercel).
2. Verify domain DNS records are resolving correctly.
3. Check for recent failed deployments and trigger a rollback if needed.

## Offline mode fallback guide

1. **Initial Cache:** Users must open the application at least once while online to populate the offline cache (Service Worker).
2. **Offline Package:** Alternatively, users can trigger a download of the complete offline package before heading into areas with no signal.
3. **Data Freshness:** The Service Worker is configured to serve stale data while revalidating in the background when an intermittent connection is available.
4. **No Map Tiles:** If a user navigates to an area without cached map tiles, a fallback "No Coverage" tile or subtle pattern will be shown, but local POI data will still be accessible.
