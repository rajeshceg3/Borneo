# Operational Runbooks

This document outlines the operational procedures for maintaining the Borneo Rainforest Travel App in a healthy and resilient state.

## 1. Incident Response Steps

If an anomaly is detected via our monitoring systems (or reported by users):

1. **Acknowledge the Incident:** Respond to the alert in our on-call notification system (e.g., PagerDuty, Slack) and create an incident tracking ticket.
2. **Assess the Impact:** Check dashboards (e.g., Grafana, Cloudflare) to determine the scope of the incident. Note how many users are affected and which services (Frontend, Backend API, CDN) are experiencing issues.
3. **Isolate the Problem:**
   - Backend API failing? Verify database and log errors via Winston logs.
   - Frontend slow or unavailable? Check Vercel/CDN status and investigate the latest deployments.
   - Investigate recent commits using GitHub Actions logs.
4. **Determine Mitigation/Resolution:**
   - If a recent deployment caused the failure, immediately perform a rollback.
   - For backend/server errors, restart services or apply emergency patches.
5. **Post-Incident Analysis:** After resolution, document the root cause, what fixed it, and the time-to-recovery in an incident post-mortem. Add preventative steps to the backlog.

## 2. Recovery Procedures

### Rolling Back a Deployment
For rapid recovery following a bad deployment, execute the rollback workflow in GitHub Actions.
- Navigate to the Actions tab in the GitHub repository.
- Run the "Rollback" workflow manually.
- The rollback process utilizes `git read-tree` to revert the repository to a known good state and pushes a new commit without destroying history.

### Restarting the Backend Server
If the backend crashes and PM2 is managing the process:
- Execute `pm2 restart all` (or specific process name) to refresh the services.
- Verify logs with `pm2 logs` to ensure a successful start.

### Recovering from API Outages
If the third-party dependencies or upstream providers go down:
- Monitor the provider's status page.
- Alert stakeholders about the downtime.
- The application will automatically rely on fallback data and the offline mode until connectivity returns.

## 3. Offline Mode Fallback Guide

The Borneo Rainforest App is designed with an "Offline First" approach to handle scenarios with no internet connectivity.

### How Offline Mode Works
- **Service Worker:** The app uses a Service Worker (`sw.js`) to cache the shell of the application, static assets (HTML, CSS, JS, images), and essential backend API responses.
- **Tile Caching:** Map tiles from OpenStreetMap are fetched and stored locally in the cache to allow continuous map rendering.

### Troubleshooting Offline Mode
If users report issues functioning offline:
1. **Verify Cache:** Advise the user to ensure they have opened the application at least once with a stable internet connection to populate the cache.
2. **Check Storage:** Instruct the user to verify their device storage isn't full, as browsers can clear caches under storage pressure.
3. **Debug Locally:**
   - Run the frontend in a local environment.
   - Emulate offline mode using Chrome DevTools (Network tab -> Throttle -> Offline).
   - Ensure the required assets and APIs fetch correctly from the Service Worker cache.
4. **Manual Package Download:**
   - In cases where the automated caching fails, users can be prompted to download the comprehensive offline zip package via the `/offline-pack/download` endpoint when they have connectivity.

---
*Maintained by the Platform Engineering Team*