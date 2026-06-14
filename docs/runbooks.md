# Operational Runbooks

## Incident Response Steps

1.  **Acknowledge and Assess:** Recognize the incident and determine its severity (e.g., P1 - System Outage, P2 - Degraded Performance, P3 - Minor Bug).
2.  **Communicate:** Notify stakeholders via the appropriate channels (e.g., Slack `#incidents`). Keep communication clear and concise.
3.  **Investigate:** Use monitoring tools (Grafana, logs, etc.) to identify the root cause.
4.  **Mitigate:** Apply a temporary fix to stop the bleeding. If a recent deployment caused the issue, trigger the Rollback strategy.
5.  **Resolve:** Develop and deploy a permanent fix.
6.  **Post-Mortem:** Conduct an incident review to discuss what happened, why it happened, and how to prevent it in the future. Document the findings.

## Recovery Procedures

### Database/Data Store Failure
- Our current datastore relies on local JSON files. If data corruption occurs, restore from the latest working branch or commit.
- For backend state issues, restart the backend server using PM2.

### CI/CD Deployment Failure
- Check GitHub Actions logs to identify the failing job.
- Address the error (e.g., failing tests, build errors) and push a new commit.
- If the deployment to production fails or introduces critical bugs, use the Rollback workflow.

## Offline Mode Fallback Guide

The Borneo Rainforest app is designed to function effectively without an internet connection using Service Workers and a cached offline package.

-   **Service Worker:** Ensure the Service Worker (`sw.js`) is correctly caching core assets (HTML, CSS, JS) and map tiles.
-   **Offline Package:** Users can download an offline bundle containing necessary data (attractions, wildlife, trails) before entering areas with poor connectivity.
-   **Troubleshooting:** If offline mode fails:
    -   Verify the user has successfully downloaded the offline package.
    -   Check if the Service Worker is registered and active in the browser's developer tools.
    -   Ensure the user hasn't cleared their browser cache.
