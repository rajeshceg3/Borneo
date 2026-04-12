# Operational Runbooks

## Incident Response Steps
1. **Identify the Incident**: Acknowledge the alert (e.g., from Grafana/Prometheus).
2. **Assess Impact**: Determine the severity and scope (e.g., API down, Map lagging, etc).
3. **Communicate**: Notify the team and update status pages if necessary.
4. **Investigate Root Cause**: Check logs (Winston logs for backend, browser console for frontend).
5. **Resolve**: Apply the fix (rollback deployment, restart service, fix bug).
6. **Post-Mortem**: Document the incident, root cause, and steps to prevent future occurrences.

## Recovery Procedures
### Backend Service Down
1. Check Render dashboard for deployment status.
2. Review application logs for crashes.
3. If necessary, trigger a manual redeployment of the last known stable commit.
4. Verify `/metrics` and `/` endpoints are accessible.

### Frontend Unreachable
1. Check Vercel dashboard for deployment errors.
2. Ensure environment variables (`API_BASE_URL`, `MAP_TILE_URL`) are correctly set in production.
3. Roll back to the previous successful Vercel deployment if a code issue is suspected.

## Offline Mode Fallback Guide
The app is designed to work offline using a Service Worker. If offline mode fails:
1. Ensure the user has visited the app while online at least once to cache assets.
2. Verify that the `sw.js` file is successfully registered in the browser console.
3. Check the "Application" tab in Developer Tools to confirm that cache storage contains `map-tiles`, `static-assets`, and `api-cache`.
4. If the offline package download fails, ensure the backend `/offline-pack/download` endpoint is functioning and the generated zip file is not corrupted.