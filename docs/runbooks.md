# Operational Runbooks

This document contains operational procedures for managing the Borneo Rainforest Travel Experience App.

## Incident Response Steps
1. **Identify the Incident**: Monitor alerts from Grafana and users. Determine scope (e.g., API downtime, map lag).
2. **Communicate**: Notify the team and update status page if user-facing.
3. **Investigate**: Check Winston logs and Vercel/Render server logs. Check CI/CD actions for recent failures.
4. **Mitigate**: If a recent deployment caused the issue, initiate a rollback (see Recovery Procedures).
5. **Resolve & Post-Mortem**: Implement a permanent fix and write a post-mortem to prevent recurrence.

## Recovery Procedures
### Application Rollback
To rollback to a previous version without rewriting git history:
1. Trigger the `Rollback Pipeline` in GitHub Actions.
2. Provide the target commit hash to rollback to.
3. The pipeline will use `git read-tree` to revert the state to the target commit and create a new commit pushed to the current branch.

### Database/State Recovery
1. Ensure offline caches are populated correctly by triggering `/offline-pack/download`.
2. Static JSON data is stored in the repo, so a rollback will also revert data changes.

## Offline Mode Fallback Guide
1. **Detection**: The app automatically detects when the network is unreachable via the Service Worker.
2. **Fallback Content**:
   - Static assets (HTML, CSS, JS) are cached locally.
   - OSM Map tiles are cached in CacheStorage.
   - API endpoints (`/attractions`, `/wildlife`, `/trails`) fallback to previously cached responses or static fallback data.
3. **User Communication**: Users will see an "Offline Mode" banner, but full app functionality (navigation, viewing data, gestures) remains intact.
4. **Pre-caching**: Advise users traveling to deep jungle areas to pre-load the app while connected to Wi-Fi.
