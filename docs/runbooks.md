# Operational Runbooks

This document contains operational procedures for maintaining the Borneo app.

## Incident Response Steps

1. **Identify the Issue:** Monitor alerts from Grafana or GitHub Actions. Check logs to understand the nature of the issue.
2. **Determine Severity:** Assess if it is a critical failure (e.g., app is down, API is unreachable) or a minor issue (e.g., single API failure, UI bug).
3. **Notify Stakeholders:** Inform the team about the issue and the estimated time for resolution.
4. **Investigate:** Dive deep into the logs, metrics, and recent deployments to identify the root cause.
5. **Mitigate:** Apply a quick fix if possible (e.g., restart services, revert a faulty PR). If a recent deployment caused the issue, trigger a rollback.
6. **Resolve:** Implement a permanent fix and verify its correctness.
7. **Post-Mortem:** Document the incident, root cause, and steps taken to prevent it in the future.

## Recovery Procedures

1. **Service Restart:** If a service is unresponsive, attempt a restart. For PM2, use `pm2 restart all`.
2. **Database Restore:** If data is corrupted, restore from the latest backup. Verify the integrity of the restored data.
3. **Rollback:** Use the GitHub Actions `.github/workflows/rollback.yml` pipeline to revert to a stable state if a new deployment introduces critical bugs.

## Offline Mode Fallback Guide

The Borneo app is designed to work seamlessly in areas with limited or no internet connectivity.

1. **Service Worker:** The app utilizes a Service Worker (`frontend/public/sw.js`) to cache essential static assets (HTML, CSS, JS), OpenStreetMap tiles, and fallback backend API responses.
2. **Pre-fetching:** When the user has an active connection, the app pre-fetches and caches map tiles and attraction data.
3. **Offline Detection:** The app automatically detects when the device is offline and switches to the cached resources.
4. **Fallback Content:** If specific data is not available in the cache, the app gracefully displays fallback content or error messages indicating the lack of connectivity.
5. **Troubleshooting:**
    *   **User Issue:** "App won't load offline."
        *   **Solution:** Ensure the user previously loaded the app while online to allow the Service Worker to install and cache assets.
    *   **User Issue:** "Map tiles are missing."
        *   **Solution:** Advise the user to zoom in on the desired areas while online to cache those specific tiles.
