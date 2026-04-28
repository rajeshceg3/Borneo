# Operational Runbooks

## Incident Response Steps

1. **Acknowledge:** The on-call engineer acknowledges the incident via the alerting system.
2. **Triage & Investigate:** Determine the severity (e.g., SEV1 - App down, SEV2 - degraded performance). Use Grafana dashboards and Winston logs to pinpoint the issue.
3. **Mitigate:** Apply a quick fix if possible (e.g., restart services, rollback to the previous stable release via the CI/CD pipeline). The goal is to restore service as quickly as possible.
4. **Communicate:** Update stakeholders (users, management) on the status of the incident.
5. **Resolve:** Implement a permanent fix for the underlying issue.
6. **Post-Mortem:** Document the incident, root cause, timeline, and action items to prevent future occurrences.

## Recovery Procedures

### Backend Service Failure
1. Verify the status of the backend infrastructure (e.g., AWS, Render).
2. Check recent deployment logs for errors.
3. If the recent deployment caused the issue, initiate an instant rollback using the CI/CD pipeline.
4. Restart the backend service if it's unresponsive but the infrastructure is healthy.

### Frontend Serving Failure
1. Verify the status of the frontend hosting platform (e.g., Vercel, Netlify).
2. Check the CDN (e.g., Cloudflare) for caching issues or configuration errors.
3. If necessary, purge the CDN cache.
4. If a recent frontend deployment is faulty, rollback to the previous stable build.

### Data Store/API Dependency Failure
1. If external APIs or datastores are down, verify if the fallback mechanisms (cached data) are functioning.
2. Escalate to the appropriate third-party support team if necessary.

## Offline Mode Fallback Guide

The Borneo Rainforest Travel App is designed to function even when network connectivity is lost.

1. **Service Worker:** The app utilizes a Service Worker (`frontend/public/sw.js`) to cache core assets, including HTML, CSS, JavaScript, and initial map tiles. Ensure the Service Worker is correctly registered and updated.
2. **Tile Caching:** OpenStreetMap tiles are cached locally to allow map navigation without an internet connection.
3. **Data Caching:** Backend API responses (Attractions, Wildlife, Trails) are cached in the browser's `localStorage` or IndexedDB (via Zustand state persistence or Service Worker caching).
4. **Offline Packager:** Users can proactively download an offline bundle containing map tiles, images, and JSON data via the `/offline-pack/download` endpoint. This is crucial for users heading into areas with known poor connectivity.
5. **User Experience:** When offline, the app should display a subtle indicator that it is running in offline mode. If specific data is missing from the cache, the app should gracefully handle the missing data without crashing (e.g., displaying a generic placeholder image or fallback text).
