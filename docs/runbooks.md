# Operational Runbooks - Borneo Rainforest Travel App

This document outlines standard operating procedures for resolving incidents, recovering from disasters, and handling system degradation such as offline fallback mode.

## 1. Incident Response Steps

When an incident occurs (e.g., API downtime, frontend rendering failures, missing critical data):

### Triage & Identification
1. **Acknowledge the Alert**: Assign an incident commander to investigate.
2. **Determine Scope**: Is the issue affecting the backend API, the frontend CDN, or both?
3. **Check Logs**:
   - Inspect backend application logs (via Winston) in the deployed environment.
   - Look for error spikes (e.g., 5xx status codes, timeouts).
   - Check frontend telemetry/performance logs if available.

### Containment & Mitigation
1. **Rollback (if applicable)**: If the incident was caused by a recent deployment, trigger the `Rollback` workflow in GitHub Actions (providing the last known good commit hash).
2. **Traffic Redirection**: If a specific backend node is failing, route traffic to healthy nodes via the load balancer.
3. **Enable Fallbacks**: Ensure offline fallback mode is triggered on the client if backend is completely unavailable.

### Resolution & Post-Mortem
1. **Fix Root Cause**: Apply the fix in the `develop` branch and test thoroughly before promoting to `main`.
2. **Monitor Recovery**: Watch dashboards and alerts to confirm the system is healthy.
3. **Post-Mortem**: Document the timeline, root cause, and preventative action items.

---

## 2. Recovery Procedures

### Infrastructure Failure
- **Frontend / CDN Failure**: Wait for Vercel/Cloudflare status to resolve or clear cache. If Vercel is fully down, deploy static assets manually to a backup S3 bucket configured for website hosting.
- **Backend API Server Failure**: Ensure Auto Scaling Groups (if AWS) or Render's automatic restarts bring up new instances. If the database/datastore is corrupted, restore from the latest snapshot.
- **Map Tile Provider Failure**: The app relies on OpenStreetMap tiles. If OSM is unreachable, the app should naturally fallback to cached tiles via the Service Worker.

### Data Corruption
- Restore the `data/` directory (attractions, wildlife, trails) from a known good state in Git repository.

---

## 3. Offline Mode Fallback Guide

The Borneo Rainforest App is designed to function smoothly in environments with zero internet connectivity (e.g., deep jungle).

### How Offline Mode Works
- A Service Worker (`frontend/public/sw.js`) intercepts network requests.
- When online, the app pre-caches map tiles, JSON data (attractions, wildlife, trails), and UI assets.
- When offline, the Service Worker serves these cached assets instead of attempting to hit the network.
- The `GET /offline-pack` endpoint allows users to explicitly download a comprehensive offline bundle before they travel.

### Troubleshooting Offline Issues
- **User reports missing data while offline**: Instruct the user to ensure they open the app at least once while on Wi-Fi to prime the Service Worker cache, or to manually use the "Download Offline Data" feature (hitting `/offline-pack`).
- **Map tiles not rendering**: OpenStreetMap tiles might have been purged from cache. Verify the Service Worker storage quota isn't exceeded in the user's browser.
- **App stuck in offline mode while connected**: Ensure the Service Worker's network-first or stale-while-revalidate strategy is functioning. A hard refresh (`Ctrl + Shift + R` or `Cmd + Shift + R`) will bypass the Service Worker and fetch fresh data.
