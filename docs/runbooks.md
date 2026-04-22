# Operational Runbooks

## 1. Incident Response Steps

When an incident is detected (e.g., via Grafana alerts, user reports, or uptime monitoring), follow these steps to manage and resolve the issue:

1. **Acknowledge the Alert**: Claim the incident in the alerting system to let the team know it is being investigated.
2. **Assess the Impact**: Determine the severity and scope of the incident. Is the backend API down? Is the map failing to load? Are a subset of users affected or all?
3. **Check Dashboards & Logs**:
   - Review Grafana dashboards for metrics (e.g., response times, error rates).
   - Check backend application logs (via Render dashboard or centralized logging system) for errors or stack traces.
   - For frontend issues, check Vercel deployment logs and user interaction tracking.
4. **Isolate the Problem**: Determine if the issue originates from the frontend, backend, database, network, or a third-party service (like OpenStreetMap tiles).
5. **Implement Mitigation/Fix**:
   - Apply a fix if the root cause is clear and safely deployable.
   - Use rollback strategies (e.g., instant rollback via Vercel/Render CI/CD) to revert to a previous stable state.
   - Utilize "Offline mode fallback guide" (see below) to ensure service continuity if backend APIs are temporarily unavailable.
6. **Communicate**: Keep stakeholders updated on the status of the incident, impact, and expected resolution time.
7. **Post-Mortem**: Conduct a post-mortem review after resolution to identify the root cause, document lessons learned, and implement preventative measures to avoid recurrence.

---

## 2. Recovery Procedures

Follow these procedures to recover services in case of failure or downtime:

### Backend Recovery (Render)
- **Restart Service**: If the backend process is unresponsive or hung, manually restart the web service via the Render dashboard.
- **Rollback Deployment**: If a newly deployed backend version is causing errors, trigger a rollback to the previous successful deploy in the Render UI or via the deployment pipeline.
- **Data Restoration**: In case of data corruption in the JSON store, restore the `data/` directory from a known good backup or the latest commit in the main branch.

### Frontend Recovery (Vercel)
- **Rollback Deployment**: If a new frontend deployment introduces critical bugs, use Vercel's instant rollback feature to revert to the previous production deployment.
- **Clear Cache**: If cached assets are stale or corrupted, trigger a manual cache purge via the Vercel dashboard or update the deployment to invalidate the cache.

### General Network/Infrastructure Recovery
- If external services (e.g., map tile providers) are down, rely on the offline packager and service worker caching (see Offline Mode Fallback Guide).

---

## 3. Offline Mode Fallback Guide

The Borneo Rainforest Travel App is designed to function smoothly even when users lose network connectivity or if the backend API experiences downtime.

### How it Works
- **Service Worker (`sw.js`)**: Intercepts network requests and serves cached assets.
- **Tile Caching**: Leaflet map tiles from OpenStreetMap are aggressively cached for offline map viewing.
- **Data Caching**: The frontend app uses `localStorage` and Service Worker caches to store backend API responses (`/attractions`, `/wildlife`, `/trails`).

### Fallback Procedures During Outages

If the backend API goes offline:
1. **Automatic Fallback**: The frontend application will automatically fall back to cached data stored in `localStorage` or served by the Service Worker.
2. **Static Data Fallback**: If the cache is empty or unavailable, the frontend (`api.js`) is configured to use built-in static JSON data to ensure the app remains functional.
3. **Offline Packages**: Users should be encouraged to download the offline package (`/offline-pack/download`) before embarking on their trip to ensure a complete local copy of all necessary assets, tiles, and data is available on their device.
4. **Monitoring Offline Effectiveness**: The frontend's user tracking module can be adapted (in future iterations) to queue tracking events while offline and sync them back to the server when connectivity is restored.

By leveraging these fallback mechanisms, users will still be able to navigate the map, view attraction details, and browse the wildlife index without interruption.
