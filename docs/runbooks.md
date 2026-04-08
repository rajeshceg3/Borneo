# Operational Runbooks

This document outlines the standard operational procedures for incident response, recovery, and fallback mechanisms for the Borneo Rainforest Travel Experience App.

## 1. Incident Response Steps

When an alert is triggered (e.g., via Prometheus/Grafana) or an incident is reported, follow these steps:

1. **Acknowledge the Alert:** Confirm receipt of the alert on the incident management platform.
2. **Determine Severity:**
   - **Severity 1 (Critical):** App is down or core features (map, offline pack) are completely broken for all users.
   - **Severity 2 (High):** Major features are failing (e.g., API returning 5xx consistently), but basic UI/offline mode works.
   - **Severity 3 (Low):** Minor degradation, isolated errors.
3. **Investigation:**
   - Check Grafana dashboards for metrics anomalies (CPU, Memory, Request Duration).
   - Check backend logs via Render or PM2 logs (if local).
   - Verify frontend status on Vercel.
4. **Communication:**
   - Update the team channel with the incident status.
   - If user-facing, update the public status page.
5. **Mitigation:**
   - Execute the appropriate recovery procedure (see below).
6. **Post-Mortem:**
   - After resolution, schedule a review to determine root cause and implement preventative measures.

## 2. Recovery Procedures

### 2.1 Backend API Failure (5xx Errors or Down)
- **Restart the Service:** Restart the Node.js process. In Render, use the "Manual Deploy > Clear build cache & deploy" or restart options.
- **Rollback:** If the failure followed a recent deployment, trigger the CI/CD rollback pipeline or redeploy the previous stable commit on Render.
- **Scale Up:** If the issue is due to resource exhaustion (OOM), consider upgrading the service plan or increasing instances.

### 2.2 Frontend Build Failure
- Re-run the Vercel build from the Vercel dashboard.
- Clear the build cache if dependency issues are suspected.
- Rollback to the previous stable Vercel deployment instantly via the dashboard.

## 3. Offline Mode Fallback Guide

The Borneo app is designed to handle network failures gracefully using a Service Worker and local caching.

### 3.1 Normal Behavior
- When the user first opens the app with an internet connection, the Service Worker caches all static assets, map tiles, and API responses.
- If the network drops, the app intercepts network requests and serves the cached data.

### 3.2 Troubleshooting Offline Failures
- **Issue:** User reports app doesn't load offline.
- **Investigation:**
  - Ask the user to ensure they have opened the app at least once while connected to the internet.
  - Verify that the Service Worker is registered (can be checked in browser DevTools -> Application -> Service Workers).
  - Verify that the API responses (from `/attractions`, `/wildlife`, etc.) and tiles are present in the Cache Storage.
- **Fix:** If the Service Worker failed to register or cache, investigate the `sw.js` logic and ensure Vercel headers (`Cache-Control`) are not conflicting with Service Worker fetch interception. Instruct the user to clear browser cache, reconnect to the internet, and refresh the app.
