# Operational Runbooks

## Incident Response Steps

1. **Acknowledge:** The on-call engineer acknowledges the alert.
2. **Investigate:** Check logs, dashboards, and error rates to identify the root cause.
3. **Mitigate:** Apply a quick fix, failover, or rollback to restore service.
4. **Resolve:** Implement a permanent fix for the issue.
5. **Post-Mortem:** Document the incident, root cause, and preventative measures.

## Recovery Procedures

1. **Database Recovery:** Restore from the latest automated snapshot. Verify data integrity.
2. **Application Rollback:** Execute the GitHub Actions rollback workflow using the last known good commit SHA.
3. **Cache Purge:** If stale or corrupt data is served, invalidate CDN and application caches.

## Offline Mode Fallback Guide

1. **Detection:** The service worker automatically detects loss of connectivity.
2. **Tile Caching:** Ensure OpenStreetMap tiles and static assets are pre-cached by the service worker.
3. **Fallback Data:** API requests falling back to cached responses should be verified via local storage or indexedDB if available.
4. **User Communication:** The UI should display a banner indicating "Offline Mode" when connectivity is lost.
