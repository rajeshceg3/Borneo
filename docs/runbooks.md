# Operational Runbooks

This document contains operational procedures for maintaining and recovering the Borneo Rainforest Travel Experience App.

## 1. Incident Response Steps

When an incident is reported or an alert is triggered (e.g., API downtime, slow map rendering, frontend offline):

1.  **Acknowledge the Alert:** Confirm reception of the alert on the primary communication channel.
2.  **Assess the Impact:** Determine the severity of the incident. Is it affecting all users, specific features, or specific regions? Check dashboards if available.
3.  **Identify the Source:**
    *   **Frontend (Vercel):** Check Vercel deployment status and logs. Look for recent deployment failures or asset loading errors.
    *   **Backend (Render):** Check Render service status and logs. Look for API errors (5xx), timeouts, or database connection issues.
    *   **External Dependencies:** Verify status of OpenStreetMap tiles or other third-party services.
4.  **Mitigation:**
    *   If a recent deployment caused the issue, initiate an immediate rollback to the last known stable version via CI/CD or the hosting provider's dashboard.
    *   If the backend is overloaded, consider scaling up the service on Render.
5.  **Communication:** Update stakeholders on the status of the incident and expected resolution time.
6.  **Resolution:** Implement a permanent fix.
7.  **Post-Mortem:** Document the incident, root cause, and steps taken to resolve it. Update this runbook if necessary.

## 2. Recovery Procedures

### 2.1 Backend Service Recovery

If the backend service on Render goes down:

1.  Navigate to the Render dashboard.
2.  Locate the `borneo-backend` service.
3.  Check the logs to identify the cause of the failure (e.g., memory leak, unhandled exception).
4.  If the service is stopped, restart it manually.
5.  If a code change caused the failure, redeploy the previous commit.

### 2.2 Frontend Service Recovery

If the frontend on Vercel is unreachable:

1.  Check the Vercel status page.
2.  Navigate to the Vercel project dashboard.
3.  Review recent build logs. If a build failed, fix the underlying code issue and trigger a new deployment.
4.  If a bad deployment went live, use Vercel's "Instant Rollback" feature to revert to the previous deployment.

## 3. Offline Mode Fallback Guide

The application is designed to function seamlessly offline, particularly in remote rainforest areas.

### 3.1 Understanding Offline Mode

*   **Service Worker:** The application relies on a Service Worker (`frontend/public/sw.js`) to cache static assets, map tiles, and API responses.
*   **Offline Packager:** Users can proactively download an offline bundle via the `/offline-pack/download` endpoint.

### 3.2 Troubleshooting Offline Issues

If users report that the app is not working offline:

1.  **Verify Service Worker Installation:** Instruct the user to check if the Service Worker is registered and active in their browser (e.g., via Chrome DevTools -> Application -> Service Workers).
2.  **Check Cache Storage:** Ensure that assets and API responses are correctly stored in the browser's Cache Storage.
3.  **Clear Cache:** If the cache is corrupted or outdated, the user can try clearing the site data to force the Service Worker to refetch assets when they next have connectivity.
4.  **Test the Fallback:** When the network is unavailable, the app should gracefully fall back to cached data. Ensure that the UI clearly indicates when the app is running in offline mode.
