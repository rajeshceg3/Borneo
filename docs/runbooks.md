# Operational Runbooks

This document contains operational procedures and runbooks for the Borneo Rainforest Travel Experience App.

## Incident Response Steps

1. **Acknowledge the Incident:** Create a dedicated communication channel (e.g., Slack `#incident-YYYYMMDD`).
2. **Assess the Impact:** Determine if the issue is affecting all users, specific regions, or specific features.
3. **Investigate the Root Cause:**
   - Check backend logs (Winston logs, CloudWatch/Vercel/Render logs).
   - Check frontend telemetry and error reporting.
   - Verify infrastructure health (database, external APIs, map tile providers).
4. **Mitigate the Issue:**
   - If a recent deployment caused the issue, trigger a rollback using the CI/CD rollback workflow.
   - If an external dependency is down, switch to fallback mechanisms.
5. **Communicate:** Keep stakeholders informed about the current status and expected resolution time.
6. **Resolve and Verify:** Implement the fix and verify that the system is fully operational.
7. **Post-Mortem:** Conduct a blameless post-mortem to discuss what went wrong, what went right, and how to prevent similar incidents in the future.

## Recovery Procedures

### Backend API Failure
1. Verify the status of the hosting provider (e.g., AWS, Render).
2. Restart the backend service via the provider's dashboard or CLI.
3. If the issue persists, trigger the GitHub Actions rollback workflow to the last known good commit.
4. Ensure the database (or JSON datastore) is accessible and not corrupted.

### Frontend Deployment Failure
1. Check Vercel/Netlify deployment logs for build errors.
2. If a bad build was deployed, revert to the previous successful deployment in the provider's dashboard.
3. Verify that the Service Worker is correctly serving cached content if the backend is down.

### Data Corruption
1. Identify the source of data corruption.
2. Restore data from the latest backup.
3. Verify data integrity in the staging environment before applying to production.

## Offline Mode Fallback Guide

The Borneo app is designed to work offline, which is critical in remote rainforest locations.

1. **Service Worker:** The app uses a Service Worker to cache the application shell, static assets, and OpenStreetMap tiles.
2. **Data Caching:** The frontend caches API responses for attractions, wildlife, and trails using `localStorage` or IndexedDB.
3. **Offline Packager:** Users can download an offline package containing map tiles, images, and JSON data via the `/offline-pack/download` endpoint before they travel.
4. **Fallback Behavior:**
   - If the network fails, the frontend should gracefully fallback to cached data.
   - Ensure the UI indicates the "Offline Mode" status to the user.
   - If both the network and cache fail, display a user-friendly error message instructing the user to connect to the internet to download the latest data.
5. **Troubleshooting Offline Mode:**
   - If users report missing data offline, check if they successfully downloaded the offline package.
   - Verify that the Service Worker is registered and active in the user's browser.
   - Check device storage limits, as caching large map tiles requires significant space.
