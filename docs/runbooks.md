# Operational Runbooks

## Incident Response Steps
1. **Acknowledge and Triage**: Identify the issue severity (P1, P2, etc.) based on user impact.
2. **Communicate**: Alert the team in the designated incident channel and notify users if the issue is severe.
3. **Investigate**: Check logs (Winston), performance tracking, and CI/CD pipelines to pinpoint the root cause.
4. **Mitigate**: Apply a hotfix, rollback the latest deployment, or scale resources.
5. **Resolve**: Deploy the permanent fix and verify stability.
6. **Post-Mortem**: Document the incident, root cause, and action items to prevent recurrence.

## Recovery Procedures
1. **Database Restoration**: If data loss occurs, restore the latest stable backup from the storage bucket.
2. **Infrastructure Recovery**: If hosting services (Vercel/AWS) fail, deploy to a fallback region or secondary provider.
3. **Rollback**: Trigger the rollback CI/CD workflow to revert to the last known good commit if a deployment fails.
4. **Verify**: Ensure the app is accessible and functioning correctly after recovery.

## Offline Mode Fallback Guide
1. **Service Worker**: Ensure `sw.js` is active and caching required assets (tiles, map data, API responses).
2. **Data Bundle**: Verify the `offline-pack` ZIP is generated and downloadable for complete offline support.
3. **Missing Data**: Ensure the app gracefully falls back to cached data or displays helpful error messages when offline data is unavailable.
