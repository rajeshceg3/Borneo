# Operational Runbooks

This document contains operational procedures for maintaining the Borneo Rainforest Travel Experience App, specifically detailing incident response steps, recovery procedures, and the offline mode fallback guide.

## 1. Incident Response Steps

When an incident (e.g., API downtime, map rendering failure, or critical user-facing error) is detected or reported:

1. **Acknowledge and Triage:**
   - Confirm the alert via monitoring tools (e.g., Grafana/uptime alerts).
   - Assess severity (Critical, High, Medium, Low).
   - If Critical (e.g., API completely down), establish an incident communication channel.

2. **Investigate:**
   - Check backend logs: Use Winston logs to identify 5xx errors or connection timeouts.
   - Check frontend logs/reports: Determine if the issue is client-side or network-related.
   - Verify infrastructure status: Check hosting provider status pages (Vercel, AWS/Render).

3. **Mitigate:**
   - If the backend is down, ensure the frontend gracefully falls back to cached data (Offline Mode).
   - If a recent deployment caused the issue, initiate a rollback (see Rollback Strategy).

4. **Resolve and Document:**
   - Apply a fix to the issue.
   - Verify resolution through automated testing and manual checks.
   - Document the incident and resolution in a post-mortem report.

## 2. Recovery Procedures

### 2.1 Backend Service Recovery
- **Issue:** Backend server crashes or becomes unresponsive.
- **Action:**
  - The server should be managed by a process manager (e.g., PM2) which will attempt to auto-restart.
  - If auto-restart fails, manually restart the service.
  - Investigate logs for memory leaks or unhandled exceptions.

### 2.2 Database/Data Store Recovery
- **Issue:** The JSON-based datastore is corrupted or unreachable.
- **Action:**
  - Restore the last known good state of the JSON data files from the repository or backup storage.
  - Verify data integrity locally before deploying.

### 2.3 Rollback
- **Issue:** A bad deployment introduces critical bugs.
- **Action:**
  - Trigger the GitHub Actions Rollback workflow (`.github/workflows/rollback.yml`) specifying the target stable commit SHA. This will safely revert the tree state without rewriting git history.

## 3. Offline Mode Fallback Guide

The application is designed to operate in areas with zero network connectivity.

- **Service Worker (`sw.js`):** Intercepts network requests and serves cached static assets, map tiles, and API responses.
- **Offline Packager:** Users can download an offline bundle containing map tiles, images, and JSON data via `/offline-pack/download` before their trip.
- **Fallback Flow:**
  - If a network request fails (e.g., fetching `/attractions`), the app will automatically read from `localStorage` or the Service Worker cache.
  - If no cache is available, the app should gracefully notify the user that they are offline and only previously accessed or pre-downloaded content is available.
- **Troubleshooting Offline Mode:**
  - If users report offline mode not working, verify that the Service Worker is correctly registered and that the user successfully downloaded the offline package while connected to the internet.
