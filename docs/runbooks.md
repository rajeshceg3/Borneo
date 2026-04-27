# Operational Runbooks - Borneo Rainforest Travel App

This document outlines the operational procedures for the Borneo Rainforest Travel App, covering incident response, recovery procedures, and an offline mode fallback guide. These are critical components of our post-launch readiness plan.

## 1. Incident Response Procedures

In the event of a system failure or significant degradation, follow these incident response steps.

### 1.1 Detection and Triage
*   **Alert Channels:** Monitor Slack alerts from Grafana/Prometheus (Frontend/Backend) and AWS/Render infrastructure monitors.
*   **Initial Assessment:**
    *   Is the app completely down (5xx errors)?
    *   Is it a performance issue (latency > 2s)?
    *   Is it an isolated feature failure (e.g., API returns 404, offline pack generation fails)?
*   **Severity Levels:**
    *   **SEV-1 (Critical):** App is inaccessible, Map fails to load, or API is down for all users.
    *   **SEV-2 (Major):** Offline packager fails, significant latency (> 5s).
    *   **SEV-3 (Minor):** Non-critical UI bugs, slow image loading.

### 1.2 Communication
*   **Internal:** Notify the on-call engineer and the broader development team via the `#incidents-borneo` Slack channel. Open a Jira incident ticket.
*   **External (if SEV-1/SEV-2):** Update the status page with a brief, non-technical explanation (e.g., "We are currently investigating issues with map loading.") and estimated time to resolution (ETR) if known.

### 1.3 Investigation and Mitigation
1.  **Check Logs:** Use Winston logs (via your log aggregation tool, e.g., Datadog, ELK) to trace errors. Pay attention to `express-winston` request logs.
2.  **Check Infrastructure:** Verify the status of the Render/AWS hosting environments. Are resources maxed out (CPU/Memory)?
3.  **Check Deployments:** Did a recent deployment cause the issue? If yes, consider an immediate rollback (see Recovery Procedures).
4.  **Mitigate:** Apply a quick fix if possible (e.g., restarting the PM2 instances: `pm2 restart all`).

### 1.4 Post-Mortem
*   Within 48 hours of a SEV-1 or SEV-2 incident, conduct a post-mortem review.
*   Document the root cause, timeline of events, how it was detected, resolution steps, and action items to prevent recurrence.

---

## 2. Recovery Procedures

If a critical failure occurs, follow these steps to restore service.

### 2.1 Backend API Recovery
1.  **Restart Service:** Attempt to restart the Node.js process using PM2.
    ```bash
    # On the server
    pm2 restart backend
    ```
2.  **Rollback Deployment:** If a recent release introduced a critical bug, rollback to the previous stable version via the Render/AWS dashboard or GitHub Actions workflow.
3.  **Data Recovery:** The current datastore is JSON-based. If data is corrupted, restore `backend/data/*.json` files from the latest stable Git commit.

### 2.2 Frontend Recovery
1.  **Vercel/Netlify Rollback:** Navigate to the Vercel dashboard and use the "Instant Rollback" feature to revert to the last successful production build.
2.  **Clear CDN Cache:** If bad assets are cached, trigger a cache invalidation on Cloudflare or the Vercel CDN.

### 2.3 Local Environment Recovery
If your local development environment becomes unrecoverable:
1.  Reset dependencies:
    ```bash
    rm -rf node_modules package-lock.json
    rm -rf backend/node_modules backend/package-lock.json
    rm -rf frontend/node_modules frontend/package-lock.json
    npm install && npm install --prefix backend && npm install --prefix frontend
    ```

---

## 3. Offline Mode Fallback Guide

The Borneo app is designed for environments with zero signal. This guide explains how the offline mode works and how to troubleshoot it.

### 3.1 How it Works
1.  **Pre-caching:** When users have connectivity, they can trigger a download of the "Offline Pack" via the `GET /offline-pack/download` endpoint.
2.  **Service Worker (`sw.js`):** The frontend Service Worker aggressively caches static assets (HTML, CSS, JS), OpenStreetMap tiles, and fallback JSON data from the backend.
3.  **Network Strategy:** The app uses a "Cache First, falling back to Network" strategy for assets, and a specific fallback mechanism for API calls in `api.js` (using `localStorage` or static fallbacks).

### 3.2 Troubleshooting Offline Failures
*   **Symptoms:** User opens the app without internet, and the map is blank or data is missing.
*   **Potential Causes & Checks:**
    1.  **Service Worker not registered:** Ensure `main.js` successfully registers the Service Worker on load. Check the browser console for registration errors.
    2.  **Cache limits exceeded:** Browsers have storage quotas. If the offline pack is too large, it might fail to cache. Monitor cache storage usage.
    3.  **Incomplete caching:** Did the user close the app before the offline pack finished downloading? The UI should clearly indicate download progress.
    4.  **Fallback logic failure:** If `localStorage` is empty and the network fails, `frontend/api.js` must successfully return the hardcoded static fallback data.

### 3.3 Validating Offline Mode Readiness
Before every major release, QA must perform the following manual test:
1.  Open the app in a browser.
2.  Navigate around the map and open several attraction cards to trigger caching.
3.  Disconnect the network (use browser DevTools -> Network -> Offline).
4.  Reload the page.
5.  Verify the map renders, markers appear, and tap gestures open cards successfully.
