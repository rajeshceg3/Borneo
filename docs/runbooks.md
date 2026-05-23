# Operational Runbooks

## Incident Response Steps

1. **Acknowledge and Triage**
   - Confirm the alert or incident report.
   - Determine the severity (e.g., P1 - Full outage, P2 - Partial degradation, P3 - Minor bug).
   - Assign an incident commander if necessary.

2. **Investigate**
   - Check application logs via monitoring dashboards (e.g., Grafana/Winston logs).
   - Verify server health and backend API connectivity.
   - Check external dependencies (e.g., map tile providers, CDNs).

3. **Mitigate**
   - Apply a quick fix if identified (e.g., restart services, scale up resources).
   - If a recent deployment caused the issue, initiate a rollback (see Recovery Procedures).
   - If the backend is unreachable, ensure the frontend gracefully falls back to offline mode.

4. **Communicate**
   - Inform stakeholders of the issue, current status, and estimated time to resolution.
   - Update internal status pages or communication channels.

5. **Resolve and Review**
   - Confirm the system is stable and fully operational.
   - Write a post-mortem document detailing the root cause, timeline, and preventative measures.

## Recovery Procedures

### Rollback via CI/CD

If a recent deployment introduced critical bugs or instability, use the Rollback Pipeline to quickly revert to a known good state.

1. Navigate to the **Actions** tab in the GitHub repository.
2. Select the **Rollback Pipeline** workflow.
3. Click **Run workflow**.
4. Enter the `target_commit` hash of the last known stable commit.
5. Execute the workflow. It will safely revert the tree state and push a new commit.
6. Verify the automated deployment pipeline picks up the rollback commit and deploys it.

### Manual Service Restart

If services are unresponsive but code is stable:

- **Backend:** Restart the PM2 process or backend service container.
- **Frontend/CDN:** Purge the Cloudflare/Vercel cache if serving stale or corrupted assets.

## Offline Mode Fallback Guide

The application is designed to function even without an active internet connection, which is critical for users in remote rainforest locations.

1. **Service Worker and Caching**
   - The application uses a Service Worker (`sw.js`) to cache static assets and map tiles.
   - If the network fails, the Service Worker intercepts requests and serves cached content.
   - Ensure users have visited the app at least once while online to populate the cache.

2. **Offline Data Package**
   - The backend provides an offline package (`GET /offline-pack`).
   - If the live API is unreachable, the frontend will attempt to load the cached offline JSON data.

3. **Troubleshooting Offline Mode**
   - **Missing Map Tiles:** Check if the user's cache storage contains the OSM tiles. Ensure they zoomed into the relevant areas while online, or triggered the offline pack download.
   - **Stale Data:** Offline data may be outdated. The app will attempt to sync with the backend when the network is restored.
   - **App Not Loading Offline:** Verify that the Service Worker is registered and active in the browser's developer tools. Ensure the initial load completed successfully.