# Operational Runbooks

This document outlines the operational procedures for managing the Borneo Rainforest Travel Experience App, specifically detailing incident response, recovery procedures, and an offline mode fallback guide.

## 1. Incident Response Steps

When an incident occurs (e.g., API downtime, frontend inaccessible, database failure), follow these steps to systematically address and mitigate the issue:

### Phase 1: Detection & Triage
- **Acknowledge:** Acknowledge the alert (via Grafana, OpsGenie, Slack, or email notification).
- **Identify:** Determine the scope of the incident. Is it affecting all users, a specific feature, or a subset of users?
- **Communicate:** Notify the relevant stakeholders (development team, product managers) about the ongoing issue and provide an estimated time for the next update.

### Phase 2: Investigation & Diagnostics
- **Check Logs:** Review backend logs using Winston/CloudWatch for error traces.
- **Check Metrics:** Observe application performance metrics (latency, error rates, CPU/Memory usage) on Grafana dashboards.
- **Isolate:** Determine if the issue is in the frontend client, the backend API, the database, or third-party services (e.g., map tile providers).

### Phase 3: Mitigation & Resolution
- **Immediate Mitigation:** Apply a quick fix to restore service if possible (e.g., restarting the server, scaling up resources, blocking abusive IPs).
- **Rollback:** If a recent deployment caused the issue, initiate a rollback using the `.github/workflows/rollback.yml` CI/CD workflow to revert to the last known stable state.
- **Root Cause Fix:** Develop and deploy a permanent fix once the immediate impact is mitigated.

### Phase 4: Post-Incident Review (PIR)
- **Document:** Record the incident timeline, root cause, and the steps taken to resolve it.
- **Action Items:** Identify preventive measures to ensure the incident does not recur.

---

## 2. Recovery Procedures

### 2.1 Backend API Recovery
- **Service Restart:** If the backend service crashes, it is managed by PM2. Ensure PM2 is running and restarting the app automatically: `pm2 status` and `pm2 restart all` if necessary.
- **Database Restoration:** If the JSON data store becomes corrupted, restore it from the latest backup or pull the original files from the git repository.

### 2.2 Frontend Application Recovery
- **Rebuild and Deploy:** If the frontend build is corrupted on the CDN (Vercel/Netlify), trigger a manual redeploy from the `main` branch via the respective dashboard or GitHub Actions.
- **Cache Invalidation:** If stale or corrupted static assets are being served, manually invalidate the CDN cache for the frontend assets.

### 2.3 Rollback Procedure via CI/CD
In the event of a critical failure caused by a new release:
1. Navigate to the GitHub Actions tab in the repository.
2. Select the "Rollback" workflow.
3. Trigger the workflow manually (`workflow_dispatch`), providing the `target_commit` hash of the last known stable release.
4. Monitor the workflow to ensure it successfully creates a new commit reverting to the specified state and pushes it to the current branch.

---

## 3. Offline Mode Fallback Guide

The application is designed to function smoothly even when users (such as travelers in the rainforest) lose network connectivity. The offline mode is primarily powered by a Service Worker (`frontend/public/sw.js`).

### 3.1 Expected Offline Behavior
- **App Shell & Assets:** HTML, CSS, JavaScript, and key images are cached during the first visit. The app should load instantly without an internet connection.
- **Map Tiles:** Map tiles that have been previously viewed or pre-fetched via the offline packager are cached locally.
- **Data (API Responses):** Fallback responses for `/attractions`, `/wildlife`, and `/trails` are stored in the Service Worker cache or `localStorage`.

### 3.2 Troubleshooting Offline Mode
If a user reports that the app is not functioning offline:

**Step 1: Verify Service Worker Registration**
- Instruct the user to open Developer Tools (if on a capable device/browser) and check the "Application" > "Service Workers" tab. Ensure the service worker is activated and running.
- If it is not registered, advise the user to reconnect to the internet and refresh the page to allow the service worker to install.

**Step 2: Check Cache Storage**
- Inspect the "Application" > "Cache Storage" tab to confirm that static assets and API responses are present in the respective caches (e.g., `borneo-static-v1`, `borneo-api-v1`).

**Step 3: Clear Storage (Last Resort)**
- If the application state becomes corrupted, instruct the user to clear the site data (Cache and Local Storage) and reload the app while connected to a stable network to re-download a clean state.

### 3.3 Utilizing the Offline Package
For the most reliable offline experience, users should be encouraged to download the "Offline Package" before their journey.
- Ensure the `/offline-pack/download` backend endpoint is operational.
- Verify that the frontend correctly downloads and extracts (or utilizes) the provided zip package to pre-populate caches and `localStorage` with comprehensive data and map tiles.