# Borneo Rainforest Travel App - Operational Runbooks

This document contains operational procedures for maintaining the Borneo Rainforest Travel App.

## 1. Incident Response Steps

When an incident is reported or detected, follow these steps:

### 1.1 Acknowledge and Triage
* **Acknowledge:** Acknowledge the alert or report within 5 minutes.
* **Triage:** Determine the severity of the incident:
  * **SEV1 (Critical):** App is completely down, API is unreachable, or core functionality (map rendering, offline sync) is broken for all users.
  * **SEV2 (High):** Major functionality is broken (e.g., gesture navigation fails, specific API endpoints return 5xx), but the app is still partially usable.
  * **SEV3 (Medium):** Minor bugs, localized performance degradation, or non-critical features (e.g., specific images not loading) failing.

### 1.2 Investigate
* **Logs:** Check backend logs in the Render console (Winston logs) for errors, stack traces, or abnormal traffic patterns.
* **Monitoring:** Check the hosting provider's dashboard (Vercel for frontend, Render for backend) for CPU/Memory spikes, high error rates, or latency issues.
* **Network:** Use network developer tools to verify if requests to the backend (`/attractions`, `/wildlife`, etc.) are failing.
* **Offline Status:** Verify if the issue is reproducible in offline mode vs. online mode.

### 1.3 Mitigate
* **Rollback:** If the incident started immediately after a recent deployment, initiate an instant rollback via the CI/CD pipeline (GitHub Actions or hosting provider dashboard).
* **Scale Up:** If the incident is due to high traffic, manually scale up backend resources on Render.
* **Fallback Data:** Ensure the frontend is properly utilizing cached data if the backend API is temporarily unavailable.

### 1.4 Resolve and Review
* **Fix:** Develop and deploy a permanent fix for the underlying issue.
* **Post-Mortem:** For SEV1 and SEV2 incidents, conduct a blameless post-mortem to analyze the root cause and identify preventative measures.

## 2. Recovery Procedures

If the system experiences a catastrophic failure or data loss, follow these recovery procedures:

### 2.1 Backend API / Database Failure
* **Current State:** The application currently relies on a static JSON datastore loaded in memory at startup. There is no external database.
* **Recovery:** Restart the backend Node.js service on Render. The in-memory data will be reloaded from the static JSON files.
* **Long-Term:** If migrating to an external database (e.g., PostgreSQL/MongoDB) in the future, implement point-in-time recovery (PITR) and daily automated backups.

### 2.2 Frontend Hosting Failure (Vercel)
* **Recovery:** If Vercel experiences a regional outage, wait for the provider to resolve the issue. The frontend relies heavily on offline mode, so users who have already loaded the app and cached the Service Worker will still be able to use it.
* **Redeploy:** If necessary, trigger a manual redeployment from the `main` branch in GitHub.

### 2.3 Deployment Pipeline Failure (GitHub Actions)
* **Recovery:** Inspect the failing CI/CD job logs. Common issues include dependency installation failures (e.g., peer dependency conflicts) or test regressions.
* **Workaround:** If CI/CD is completely broken, manual deployments can be triggered directly from the CLI using Vercel CLI (`vercel --prod`) and Render CLI.

## 3. Offline Mode Fallback Guide

The Borneo app is designed for areas with zero signal. This section outlines how the offline fallback works and how to troubleshoot it.

### 3.1 Architecture Overview
* **Service Worker (`frontend/public/sw.js`):** Intercepts network requests and serves cached assets (HTML, JS, CSS, images, map tiles, API responses) when offline.
* **Offline Packager (`/offline-pack/download`):** A backend endpoint that bundles map tiles, images, and JSON data into a downloadable ZIP file for initial offline setup (future enhancement for explicit downloads).

### 3.2 Troubleshooting Offline Mode
* **Issue: App shows "No Internet" and fails to load.**
  * *Check:* Verify the Service Worker is registered. Open Chrome DevTools -> Application -> Service Workers. Ensure it is activated and running.
  * *Fix:* Reload the page while online to ensure the Service Worker installs and caches the initial assets.

* **Issue: Map tiles are missing when offline.**
  * *Check:* Inspect the Cache Storage in DevTools. Look for cached OpenStreetMap tiles (`*.tile.openstreetmap.org`).
  * *Fix:* Ensure the user has navigated around the map while online to trigger tile caching, or verify the caching logic in `sw.js` is correctly intercepting tile requests.

* **Issue: Wildlife or Attraction data is missing when offline.**
  * *Check:* Verify the backend API responses (`/api/attractions`, `/api/wildlife`) are present in the Service Worker's dynamic cache.
  * *Fix:* The app fetches this data on load. Ensure the initial load completes successfully while online.
