# Operational Runbooks

## Incident Response Steps

1. **Detection and Alerting**: Identify the incident through automated alerts (e.g., API failures, performance degradation) or user reports.
2. **Triage**: Assess the severity of the incident. Determine if it is a critical system failure (e.g., backend API down, offline sync failing) or a localized issue.
3. **Communication**: Notify the relevant stakeholders and create a dedicated incident channel (e.g., Slack `#incident-123`).
4. **Investigation**:
   - Check backend logs for errors using Winston.
   - Verify frontend observability metrics via the performance tracker.
   - Investigate recent deployments or configuration changes.
5. **Mitigation**: Implement temporary fixes or workarounds to restore partial or full service.
   - *Example*: If a new deployment caused the issue, initiate the rollback via the CI/CD pipeline.
6. **Resolution**: Develop and deploy a permanent fix for the underlying issue. Verify the fix in staging before deploying to production.
7. **Post-Incident Review (PIR)**: Conduct a blameless post-mortem to analyze the root cause and implement preventative measures for the future.

## Recovery Procedures

### Instant Rollback via CI/CD
To maintain previous builds and quickly revert to a known good state, use the `rollback.yml` GitHub Actions workflow.
1. Navigate to the "Actions" tab in GitHub.
2. Select the "Rollback" workflow.
3. Provide the commit SHA of the known good state.
4. Run the workflow. This will use `git read-tree` to revert the repository tree to the target commit state and push the change to the active branch.

### Database / Data Restore
- If the JSON datastore (`attractions`, `wildlife`, `trails`) becomes corrupted, restore from the latest automated snapshot or the checked-in source of truth in the repository.

### Infrastructure Redeployment
- If the server infrastructure fails, redeploy the frontend (Vercel) and backend (AWS/Render) using the automated CI/CD pipelines.

## Offline Mode Fallback Guide

The Borneo Rainforest Travel Experience App relies heavily on offline functionality for users in the jungle.

1. **Verify Service Worker**: Ensure the `sw.js` is correctly caching static assets, OpenStreetMap tiles, and fallback backend API responses.
2. **Test Offline Packager**: Verify that `GET /offline-pack/download` is serving the latest bundled JSON data, images, and map tiles.
3. **Handling Failed Syncs**:
   - If the app fails to fetch live data, the service worker should automatically fallback to the local cache.
   - Check the user's `localStorage` (via the state store) to ensure previously cached JSON data is intact.
4. **Offline Troubleshooting**:
   - Instruct users to completely close and reopen the app if they experience offline maps not rendering.
   - If a user clears their browser cache, they will need to connect to the internet to redownload the offline package before re-entering the offline zone.
