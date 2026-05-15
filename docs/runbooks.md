# Borneo Rainforest Travel Experience App - Operational Runbooks

This document contains operational runbooks for the Borneo Rainforest Travel Experience App to ensure smooth operations, rapid incident response, and proper fallback mechanisms.

## Incident Response Steps

When an incident occurs (e.g., app crash, API failure, high latency), follow these steps:

1. **Acknowledge the Incident:** Respond to the alert and confirm you are investigating.
2. **Assess Impact:** Determine if the issue is affecting all users, specific features, or specific regions. Check Grafana dashboards.
3. **Identify the Root Cause:**
   - Check backend logs (Winston) for errors.
   - Inspect infrastructure metrics (CPU, Memory, Network).
   - Review recent deployments in the CI/CD pipeline.
4. **Communicate:** Update stakeholders and users if the issue is significant.
5. **Mitigate/Resolve:**
   - If a recent deployment caused the issue, initiate the rollback procedure using the CI/CD pipeline.
   - If a dependency failed, check its status page.
   - Apply hotfixes if necessary.
6. **Verify:** Confirm the issue is resolved and metrics return to normal.
7. **Post-Incident Review (PIR):** Document the incident, root cause, timeline, and action items to prevent recurrence.

## Recovery Procedures

If the system needs to be recovered or rolled back:

### Instant Rollback via CI/CD

1. Navigate to the GitHub Actions tab.
2. Select the `Rollback Deployment` workflow.
3. Click `Run workflow`.
4. Provide the `target_commit` (the SHA of the known good commit to rollback to).
5. Provide the `branch_name` (e.g., `main` or `develop`).
6. Execute the workflow. It will revert the tree to the target commit and create a new commit safely.

### Service Restart

If a service is unresponsive, restart it using the appropriate hosting provider's interface or CLI (e.g., AWS, Render, PM2 for local).

## Offline Mode Fallback Guide

The application is designed to function offline. If the backend API or internet connection is unavailable:

1. **Service Worker:** The app relies on the Service Worker (`sw.js`) to cache static assets, map tiles, and API responses.
2. **Data Presentation:** If a user navigates to a new area without cached data, display a user-friendly message indicating they are offline and showing cached content instead.
3. **Offline Package:** Encourage users to download the Offline Package (`/offline-pack`) before their trip. This pre-loads all necessary data and images.
4. **Testing Offline Mode:** Developers can test offline mode by disabling the network in browser DevTools or using the `Offline` throttling profile.
