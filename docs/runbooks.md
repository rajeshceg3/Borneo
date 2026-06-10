# Operational Runbooks

This document contains operational procedures for the Borneo Rainforest Travel Experience App.

## 1. Incident Response Steps

If an incident occurs (e.g., app is down, API is failing, performance is severely degraded):

1. **Acknowledge:** Acknowledge the alert (via PagerDuty, Slack, or email).
2. **Assess:** Determine the scope of the incident.
    - Is the frontend down? (Check Vercel dashboard)
    - Is the backend API down? (Check Render/AWS dashboard)
    - Is it affecting all users or specific regions?
3. **Mitigate:** Apply a quick fix to stop the bleeding.
    - If a recent deployment caused the issue, trigger the **Rollback Workflow** (see below).
    - If the backend is failing under load, scale up the instances.
4. **Resolve:** Find the root cause and deploy a permanent fix.
    - Check logs (Winston logs for backend, browser console for frontend).
5. **Post-Mortem:** Document the incident, root cause, and steps to prevent it in the future.

## 2. Recovery Procedures

### 2.1 Backend Recovery

1. **Restart Service:** Restart the backend Node.js application via the hosting provider's dashboard.
2. **Check Logs:** Monitor the Winston logs for errors during startup.
3. **Verify API:** Test the API endpoints (`/attractions`, `/wildlife`, etc.) manually.

### 2.2 Frontend Recovery

1. **Redeploy:** Trigger a redeployment in Vercel.
2. **Clear CDN Cache:** If assets are stale or corrupted, clear the Vercel CDN cache.
3. **Verify:** Check the live URL to ensure the app loads correctly.

### 2.3 CI/CD Rollback Workflow

We maintain previous builds and can enable instant rollback via CI/CD.

To rollback the `main` or `develop` branch to a specific commit:

1. Go to the **Actions** tab in GitHub.
2. Select the **Rollback Pipeline** workflow.
3. Click **Run workflow**.
4. Enter the `target_commit` SHA you want to rollback to.
5. The workflow will use `git read-tree` to revert the tree to the target commit state and create a new commit, pushing it to the current branch.

## 3. Offline Mode Fallback Guide

The application is designed to work offline. If users are experiencing issues in areas with poor or no connectivity:

1. **Service Worker:** Ensure the Service Worker (`sw.js`) is correctly registered and active. The Service Worker caches static assets, OpenStreetMap tiles, and fallback backend API responses.
2. **Pre-caching:** Advise users to open the app while they have a strong internet connection (e.g., at the hotel) to pre-cache map tiles and data.
3. **Offline Package:** If the Service Worker is not functioning, users can download the offline bundle (via the `/offline-pack/download` API endpoint, though this must be done while online).
4. **Data Fallback:** If the API cannot be reached and there is no cached data, the frontend should display a user-friendly error message, but still allow navigation of the map if tiles are cached.
