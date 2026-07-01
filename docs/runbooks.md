# Operational Runbooks

## Incident Response Steps

1. **Acknowledge and Triage**
   - Confirm the incident and identify the impact (e.g., frontend down, backend API failures).
   - Communicate status to stakeholders.
2. **Investigate**
   - Check application logs via monitoring tools (e.g., Grafana, Winston logs).
   - Check server health and resource usage (CPU, Memory).
   - Verify network connectivity and DNS settings.
3. **Mitigate**
   - If a recent deployment caused the issue, trigger the instant rollback via CI/CD.
   - Restart affected services or scale up resources if under heavy load.
4. **Resolve and Document**
   - Confirm service restoration.
   - Document the root cause, timeline, and preventive measures in a post-mortem report.

## Recovery Procedures

- **Database/Data Store Failure:** Restore data from the latest backup. Verify data integrity before redirecting traffic.
- **Frontend Build Failure:** Ensure the artifact build process in CI/CD is successful. If necessary, manually build and deploy the previous stable commit using Vercel CLI.
- **Backend Server Crash:** Check PM2 logs for crash reasons. Restart the process (`pm2 restart <app-name>`). Ensure dependencies are correctly installed.

## Offline Mode Fallback Guide

If users report issues accessing the application while offline:
1. **Verify Service Worker:** Ensure the Service Worker (`sw.js`) is correctly registered and active in the user's browser.
2. **Check Cached Assets:** Instruct users to verify that initial assets (HTML, CSS, JS, Map Tiles) were downloaded successfully during their first online visit.
3. **Offline Data Package:** Ensure the `GET /offline-pack/download` endpoint was successfully accessed previously and the data is available locally.
4. **Troubleshooting Steps:**
   - Advise the user to refresh the page.
   - If the app is stuck, advise the user to clear browser cache and re-download the offline package when an internet connection is available.