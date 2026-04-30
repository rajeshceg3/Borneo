# Borneo Rainforest Travel Experience App - Operational Runbooks

This document provides operational runbooks for managing the Borneo Rainforest Travel Experience App. It includes procedures for handling incidents, recovering from failures, and managing the offline mode fallback.

## 1. Incident Response Steps

When an incident is detected (e.g., via monitoring alerts or user reports), follow these steps:

1. **Acknowledge the Alert:** Acknowledge the alert in the monitoring system (e.g., Grafana, PagerDuty) to indicate that someone is investigating.
2. **Assess the Impact:** Determine the severity of the incident.
   - **Sev-1 (Critical):** App is completely down or unusable for all users.
   - **Sev-2 (High):** Major features (e.g., Map, APIs) are failing, but the app is somewhat usable.
   - **Sev-3 (Medium):** Minor features failing or intermittent issues.
3. **Investigate the Root Cause:**
   - Check application logs in the backend (Winston logs) or frontend console.
   - Check infrastructure metrics (CPU, Memory, Network).
   - Check API health endpoints (`/`, `/attractions`, `/wildlife`, etc.).
   - Review recent deployments or infrastructure changes.
4. **Implement Mitigation:** Apply a temporary fix to restore service as quickly as possible.
   - Restart backend server.
   - Rollback to a previous known-good deployment via CI/CD.
   - Switch to fallback mechanisms if external services are down.
5. **Communicate Status:** Update stakeholders and users about the incident, expected resolution time, and any workarounds.
6. **Implement Permanent Fix:** Develop and deploy a long-term solution to prevent the issue from recurring.
7. **Post-Incident Review (PIR):** Conduct a blameless post-mortem to analyze what happened, why it happened, and how to improve processes or systems to prevent future occurrences.

## 2. Recovery Procedures

### 2.1 Backend Server Failure
- **Symptom:** App cannot fetch dynamic data, API requests timeout or return 5xx errors.
- **Action:**
  1. Check PM2 or orchestration platform logs for the backend service.
  2. Restart the Node.js process: `pm2 restart app` or equivalent command.
  3. Verify the database or JSON datastore is accessible.
  4. If restart fails, redeploy the last stable build from the CI/CD pipeline.

### 2.2 Frontend CDN/Hosting Failure
- **Symptom:** Users cannot access the web app, or assets (JS, CSS, Images) are failing to load.
- **Action:**
  1. Check Vercel/Netlify deployment logs.
  2. Verify DNS settings and CDN status (e.g., Cloudflare).
  3. Trigger a manual rebuild and deploy from the `main` branch.
  4. If the hosting provider is down, consider failing over to a secondary hosting environment if configured.

### 2.3 Data Corruption
- **Symptom:** Incorrect attractions or wildlife data displayed.
- **Action:**
  1. Inspect the JSON data files in `backend/data/`.
  2. Restore the data files from the latest backup or Git repository.
  3. Restart the backend service to load the corrected data.

## 3. Offline Mode Fallback Guide

The Borneo app is designed to work in remote rainforest locations with little to no signal. It uses a Service Worker (`frontend/public/sw.js`) and an Offline Packager API (`GET /offline-pack/download`).

### 3.1 Expected Offline Behavior
- Users should be prompted to download the offline package before their trip.
- When offline, the Service Worker intercepts network requests and serves cached assets (HTML, CSS, JS, Map Tiles, JSON data, and Images).
- The map should remain fully interactive using locally cached tiles.
- The UI should indicate that the app is operating in "Offline Mode".

### 3.2 Troubleshooting Offline Mode
- **Symptom:** App fails to load when offline.
  - **Action:** Instruct the user to ensure they have fully downloaded the offline package while connected to Wi-Fi. Check if the Service Worker is correctly registered and active in the browser's developer tools.
- **Symptom:** Map tiles are missing when offline.
  - **Action:** Verify that the user navigated around the map while online to cache tiles, or that the offline package included the necessary zoom levels for their specific location.
- **Symptom:** Stale data is shown.
  - **Action:** The Service Worker uses a "Stale-While-Revalidate" or "Cache-First" strategy. Instruct the user to connect to the internet and refresh the app to fetch the latest data and update the cache.

### 3.3 Offline Package Management
- The backend `/offline-pack/download` endpoint generates a ZIP file containing current data and map assets.
- Ensure the compression process (using `archiver`) does not consume excessive memory, which could crash the server. Monitor memory usage during package generation.
- Periodically update the static fallback data bundled within the app if major changes occur.
