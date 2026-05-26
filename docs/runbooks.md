# Operational Runbooks

## Incident Response Steps
1. **Acknowledge and Triage:** Identify the issue and alert the relevant team members.
2. **Investigate:** Check system logs (Winston), frontend performance tracking, and API metrics.
3. **Mitigate:** Apply immediate fixes or rollback to a stable version using the CI/CD pipeline if the issue is critical.
4. **Resolve:** Find the root cause and apply a permanent fix.
5. **Post-Mortem:** Document the incident, root cause, and steps taken to prevent it from happening again.

## Recovery Procedures
1. **Application Rollback:** Use the GitHub Actions rollback workflow (`.github/workflows/rollback.yml`) to revert the codebase to a specific working commit.
2. **Data Restoration:** (If applicable) Restore backend data from the latest backup.
3. **Cache Clearing:** In cases of stale or corrupted frontend data, force a clear of the Service Worker cache by incrementing the cache version or advising users to reload.

## Offline Mode Fallback Guide
1. **Detect Offline State:** The app automatically switches to offline mode when the network is unreachable.
2. **Fallback Content:** The app relies on the Service Worker (`frontend/public/sw.js`) and the downloaded offline package (from `GET /offline-pack/download`).
3. **Troubleshooting Offline Issues:**
   - If map tiles fail to load, ensure the offline package was downloaded completely.
   - If API data is missing, check if it's cached by the Service Worker or `localStorage`.
   - Re-download the offline package when the connection is restored to update data.
