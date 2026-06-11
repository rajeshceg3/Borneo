# Borneo Rainforest Travel App - Operational Runbooks

## Incident Response Steps

When an incident occurs (e.g., API downtime, slow performance, offline cache failure), follow these steps:

1. **Acknowledge & Triage**
   - Identify the scope of the incident.
   - Check automated alerts in monitoring dashboards.

2. **Investigate & Diagnose**
   - Review logs from Vercel (frontend) and hosting provider (backend).
   - Check error rates and response times.

3. **Mitigate & Recover**
   - If a recent deployment caused the issue, trigger a rollback (see Recovery Procedures).
   - If an external dependency is failing, ensure fallback mechanisms are working correctly.

4. **Post-Mortem**
   - After resolution, document the root cause and implemented fix.
   - Propose long-term solutions to prevent recurrence.

## Recovery Procedures

If the application is in an unstable state due to a recent release, initiate a rollback.

1. **Identify Stable Commit**
   - Find the hash of the last known good commit on the affected branch (e.g., `main`).

2. **Execute Rollback via CI/CD**
   - Go to GitHub Actions.
   - Select the **Rollback Pipeline** workflow.
   - Click **Run workflow**.
   - Enter the target commit hash identified in step 1.
   - The workflow will securely revert the codebase and deploy the stable state.

3. **Verify Recovery**
   - Monitor error rates and confirm the issue is resolved.

## Offline Mode Fallback Guide

The application relies on Service Workers and cached assets to function in environments with zero connectivity.

If users report issues with offline mode:

1. **Verify Asset Bundling**
   - Ensure the `/offline-pack` backend endpoint is successfully generating and serving the `.zip` archive containing the latest data and tiles.

2. **Check Service Worker Registration**
   - Confirm the Service Worker (`sw.js`) is correctly registered and intercepting requests in the frontend.

3. **Troubleshoot Caching**
   - Instruct users (or field testers) to clear their browser cache and reload the application while online to fetch the newest offline bundle.
   - Verify the `localStorage` cache has adequate space and is storing the fallback JSON payloads correctly.
