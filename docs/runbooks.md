# Operational Runbooks - Borneo Rainforest Travel App

## Incident Response Steps

1. **Acknowledge:** The on-call engineer should acknowledge the incident within 15 minutes of an alert firing.
2. **Investigate:**
   - Check the status of backend APIs using monitoring dashboards (e.g., Grafana) and logs.
   - Verify frontend functionality and caching mechanisms.
   - Check third-party dependencies (e.g., CDN, mapping providers).
3. **Mitigate:** Apply temporary fixes or rollbacks if necessary to restore service.
4. **Resolve:** Implement a permanent fix and verify its effectiveness.
5. **Post-Mortem:** Conduct a blameless post-mortem for any Sev 1 or Sev 2 incidents to prevent recurrence.

## Recovery Procedures

1. **Backend Rollback:** Use the GitHub Actions rollback workflow (`.github/workflows/rollback.yml`) to revert the application code to the last known good state.
2. **Database Restore:** (If applicable) Restore data from the latest automated backup.
3. **Frontend Re-deployment:** Re-trigger the deployment pipeline for the frontend from the main branch or a specific stable commit.
4. **Clear Caches:** Invalidate CDN caches and instruct users to refresh or clear local application caches if necessary.

## Offline Mode Fallback Guide

If the application is experiencing widespread backend connectivity issues, the offline mode features should handle the degradation gracefully:
1. **Frontend Resilience:** The frontend relies on Service Workers and cached map tiles/JSON payloads. It should continue to function for core features even without backend connectivity.
2. **Offline Package Distribution:** Guide users to download the offline package beforehand while they have a connection.
3. **Error Messaging:** Ensure the UI gracefully notifies the user that the app is in offline mode and restricts actions requiring connectivity.
