# Operational Runbooks

This document contains instructions for resolving common incidents, recovering systems, and enabling offline fallback modes.

## Incident response steps

1. **Acknowledge the alert:** Ensure someone is actively investigating the alert.
2. **Determine impact:** Identify whether it is a global outage, localized issue, or partial degradation.
3. **Check metrics:** Review Grafana dashboards or application logs (Winston logs) to pinpoint the failure.
4. **Identify the root cause:** Examine recent deployments, server metrics, or third-party API dependencies.
5. **Implement fix:** Apply a hotfix, rollback the deployment, or adjust configurations to mitigate the issue.
6. **Verify restoration:** Test the application end-to-end to confirm services are functioning properly.
7. **Post-mortem:** Write up an incident report detailing the root cause and steps to prevent recurrence.

## Recovery procedures

- **API Downtime:**
  - If the Node.js backend fails, confirm PM2 logs or Render deployment status.
  - Restart the service if it is a transient error.
  - Roll back to the previous stable release via CI/CD (GitHub Actions) if the failure is caused by a new code change.
- **Frontend Issues:**
  - If Vite fails to build or deploy, check Vercel build logs.
  - Trigger a redeployment without cache.

## Offline mode fallback guide

1. Ensure the Service Worker (`frontend/public/sw.js`) is correctly registered and caching static assets and API responses.
2. If users report being unable to use the app in areas with zero signal:
   - Remind them to download the offline package (`GET /offline-pack/download`) before losing connection.
   - The app automatically relies on cached map tiles and data models when `navigator.onLine` is false.
   - Instruct users to ensure their device storage is not full, as local caches may be evicted.