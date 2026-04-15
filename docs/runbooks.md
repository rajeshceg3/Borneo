# Operational Runbooks

## Incident Response Steps
1. **Identify the Incident**: Monitor alerts from Grafana and Prometheus, or receive user reports. Determine the scope (e.g., API down, Map tiles failing).
2. **Log the Incident**: Create an incident ticket tracking the symptoms, start time, and potential impact.
3. **Investigate**:
   - Check backend logs via Winston.
   - Verify infrastructure status (Render, Vercel).
   - Check third-party services (e.g., OpenStreetMap for tiles).
4. **Mitigate**: Apply temporary fixes to restore service (e.g., fallback data, restart services).
5. **Resolve**: Implement the root cause fix and deploy.
6. **Post-Mortem**: Document the incident, root cause, and steps taken to prevent recurrence.

## Recovery Procedures
### Backend Service Failure
1. Verify the Render dashboard for deployment status.
2. If the service is stuck, trigger a manual restart from the Render dashboard.
3. Check recent commits; if a bad deployment caused the issue, initiate a rollback to the last known stable commit.
4. Verify `/metrics` and `/` endpoints return 200 OK.

### Frontend Service Failure
1. Verify Vercel deployment logs.
2. If the build is failing, rollback to the previous successful Vercel deployment.
3. Clear Vercel Edge Cache if static assets are serving stale/corrupt data.

## Offline Mode Fallback Guide
1. **Service Worker Fallback**: The app relies on the Service Worker (`sw.js`) to cache the UI shell, static assets, and map tiles.
2. **API Data Fallback**: If the backend is unreachable, the frontend automatically falls back to `localStorage` caches or pre-packaged static data.
3. **User Communication**: Ensure the UI displays the "Offline Mode" indicator when network requests fail.
4. **Data Sync**: When the network is restored, the app should fetch the latest data from the backend to refresh the caches.