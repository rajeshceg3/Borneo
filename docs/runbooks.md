# Operational Runbooks

This document contains operational procedures for maintaining and recovering the Borneo Rainforest Travel Experience App.

## Incident Response Steps

1. **Acknowledge & Assess:**
   - Acknowledge the alert or report.
   - Determine the severity (e.g., SEV-1: System down, SEV-2: Feature degraded, SEV-3: Minor bug).
   - Check monitoring dashboards (Grafana) to assess impact on response time, errors, and usage.

2. **Communicate:**
   - Notify stakeholders via standard communication channels.
   - Provide a preliminary status update.

3. **Investigate & Mitigate:**
   - Identify the root cause (check Winston logs in backend, Vercel logs for frontend).
   - Apply a quick mitigation if possible (e.g., restart PM2 services, clear cache, or trigger a rollback if a recent deploy caused the issue).
   - Use the Rollback workflow in `.github/workflows/rollback.yml` to instantly rollback via CI/CD to a known good state.

4. **Resolve & Recover:**
   - Develop and test a permanent fix.
   - Deploy the fix to staging, validate, and then promote to production.
   - Monitor the system closely after recovery.

5. **Post-Mortem:**
   - Conduct a blameless post-mortem for SEV-1/SEV-2 incidents.
   - Document root cause, timeline, and action items to prevent recurrence.

## Recovery Procedures

### Backend Recovery

If the backend Express server goes down or becomes unresponsive:

1. SSH into the production server (AWS/Render).
2. Check PM2 logs: `pm2 logs`
3. Restart the backend service: `pm2 restart backend`
4. Verify the service is back online: `curl http://localhost:3000/attractions`

### Frontend Recovery

If the Vercel deployment fails or is serving stale content:

1. Check the Vercel dashboard for build errors.
2. If the issue is a bad release, use the GitHub Actions rollback workflow (`.github/workflows/rollback.yml`) with the last known good commit SHA.
3. If it's a caching issue, clear the Vercel edge cache.

### Infrastructure/Database Recovery

If the JSON data or offline bundle becomes corrupted:

1. Restore data from the most recent backup stored in cloud storage.
2. Re-trigger the CI/CD pipeline to deploy the restored data.

## Offline Mode Fallback Guide

The application is designed to function seamlessly offline in rainforest locations. If users report issues with offline mode, follow these steps:

1. **Verify Service Worker Installation:**
   - Ensure `frontend/public/sw.js` is correctly served and registered on the client.
   - Instruct users to load the app once while connected to a stable network to cache static assets, OSM map tiles, and backend API responses.

2. **Check Offline Package (`/offline-pack/download`):**
   - Verify the backend `/offline-pack/download` endpoint is correctly bundling map tiles, images, and JSON data.
   - Check if the generated `.zip` file is valid and complete.

3. **Fallback Data:**
   - If the API goes down while the user has connectivity, the app will fall back to `localStorage` caches or pre-packaged data.
   - Ensure the frontend caching layer gracefully handles `fetch` failures by instantly falling back to cached responses without showing errors to the user.

4. **Troubleshooting User Device:**
   - Ask the user to clear browser cache and storage if offline mode behaves inconsistently.
   - Confirm the device has sufficient storage space to hold the cached data and offline package.
