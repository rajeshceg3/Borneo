# Operational Runbooks

This document outlines the operational procedures for managing the Borneo Rainforest Travel Experience App in production.

## Incident Response Steps

1. **Detection:**
   - Monitor alerts in Grafana or external monitoring tools (e.g., uptime checks).
   - Acknowledge the alert within 15 minutes.
   - Designate an Incident Commander (IC).

2. **Triage:**
   - Assess the impact (e.g., frontend unresponsiveness, API failures, map loading issues).
   - Identify the affected component (Frontend, Backend, CI/CD, Infrastructure).
   - Communicate the status to stakeholders via designated channels (e.g., Slack).

3. **Investigation:**
   - Review recent deployments or configuration changes.
   - Analyze server logs (Winston logs for backend) and frontend console errors.
   - Check infrastructure health metrics (CPU, Memory, Network).

4. **Mitigation/Resolution:**
   - Apply a fix, restart services, or initiate a rollback (see Recovery Procedures).
   - Verify the resolution by checking monitoring dashboards and performing manual tests.

5. **Post-Incident:**
   - Conduct a blameless post-mortem.
   - Document root causes and preventative measures.
   - Update runbooks as necessary.

## Recovery Procedures

### Rollback Deployments

If a recent deployment has introduced critical issues, initiate an immediate rollback to the previous stable state.

- For automated rollbacks, trigger the CI/CD rollback workflow in GitHub Actions (`.github/workflows/rollback.yml`).
- Specify the target commit hash of the last known stable build.
- The workflow will securely restore the application state and push the updated branch securely without rewriting Git history.

### Service Restarts

If a service is degraded but not resulting from code changes:

- **Backend:** Restart the PM2 process managing the Node.js server.
  ```bash
  pm2 restart backend-api
  ```
- **Frontend/CDN:** Clear CDN caches if stale or malformed assets are being served.

## Offline Mode Fallback Guide

The application is designed to function smoothly in environments with zero connectivity. When API or network failures occur, the app should seamlessly fallback to offline mode.

1. **Verify Service Worker:** Ensure the `sw.js` is active and actively intercepting requests.
2. **Check Cached Assets:** Validate that critical assets (HTML, CSS, JS, Map Tiles, JSON Data) are available in the browser's Cache Storage.
3. **Trigger Manual Fallback:** If the network is flaky but not fully offline, instruct users to disable their device's connection (airplane mode) to force the app into offline mode explicitly, which relies on the cached package from `/offline-pack/download`.
4. **Data Synchronization:** Advise users that any dynamic content updates will resume once connectivity is restored and the app reloads.
