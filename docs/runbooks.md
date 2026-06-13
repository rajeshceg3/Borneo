# Operational Runbooks

This document provides operational procedures for maintaining the Borneo Rainforest Travel App in production.

## Incident Response Steps

When an incident occurs (e.g., system downtime, API failure, or performance degradation), follow these steps:

1. **Acknowledge & Triage:**
   - Acknowledge the alert (via Grafana/PagerDuty or email).
   - Determine the severity (e.g., SEV1 for full outage, SEV2 for partial degradation).
   - Identify the affected components (Frontend, Backend API, CDN).

2. **Investigate:**
   - Review recent deployments in the `.github/workflows/ci.yml` run history.
   - Check application logs via Winston (Backend) or browser console logs if issues are isolated to the Frontend.
   - Verify server resources (CPU, Memory, Disk) and network connectivity.

3. **Mitigate/Resolve:**
   - If a recent deployment caused the issue, initiate a rollback (see Recovery Procedures).
   - If the backend is unreachable, ensure the frontend gracefully degrades to Offline Mode.
   - Restart the affected services using PM2: `pm2 restart all`.

4. **Communicate:**
   - Update internal status channels.
   - If user-facing functionality is heavily impacted, publish a notice on the public status page.

5. **Post-Incident Review:**
   - After resolution, conduct a blameless post-mortem.
   - Document the root cause, timeline, and action items to prevent recurrence.

## Recovery Procedures

If the production system needs to be reverted to a previous stable state:

1. **Instant Rollback via CI/CD:**
   - Navigate to the GitHub Actions tab.
   - Select the `Rollback` workflow.
   - Click "Run workflow".
   - Provide the exact Git Commit SHA of the last known stable state as the input.
   - The workflow will automatically revert the repository tree to that commit and push the changes, triggering a fresh deployment of the stable code.

2. **Manual Intervention (If CI/CD is down):**
   - SSH into the production server.
   - Navigate to the application root directory.
   - Run `git reset --hard <STABLE_COMMIT_SHA>`.
   - Run `pm2 restart all`.

## Offline Mode Fallback Guide

The Borneo app is designed to function smoothly in environments with zero connectivity. If the backend API fails or the user loses network connection:

1. **Service Worker Activation:**
   - The Service Worker (`frontend/public/sw.js`) intercepts all network requests.
   - It serves cached static assets (HTML, CSS, JS, images).
   - It intercepts Leaflet map tile requests and serves them from the local cache.

2. **Data Fallback:**
   - If an API request to `/attractions`, `/wildlife`, or `/trails` fails, the Service Worker will return the latest cached response.
   - The frontend `localStorage` also acts as a secondary cache for JSON data.

3. **User Experience:**
   - A subtle UI indicator will notify the user they are operating in Offline Mode.
   - The user can still browse pre-cached map areas, view attraction details, and use the gesture navigation seamlessly.
   - Features requiring real-time data will be gracefully disabled.

4. **Troubleshooting Offline Mode:**
   - If a user reports missing data offline, advise them to download the "Offline Pack" (`GET /offline-pack/download`) while connected to a stable network.
   - Ensure the Service Worker is registered successfully on the client side.
