# Operational Runbooks

## Incident response steps
1. Acknowledge the incident.
2. Identify the scope and impact of the issue.
3. Establish communication channels (e.g., dedicated Slack channel, war room).
4. Investigate the root cause.
5. Mitigate the issue (e.g., rollback to previous stable commit, failover to standby).
6. Resolve the issue permanently.
7. Conduct a post-incident review (postmortem) to prevent future occurrences.

## Recovery procedures
1. Determine the exact time of failure and data loss window.
2. For state issues, restore the latest backup of the database or object storage.
3. For deployment issues, use the Rollback GitHub Actions workflow with the last known good commit hash.
4. Verify system health and critical services.
5. Notify stakeholders of recovery.

## Offline mode fallback guide
1. Ensure users have downloaded the latest offline pack before entering low-connectivity areas.
2. In the event of backend API downtime, the Service Worker will intercept requests and serve cached data or fallback to local JSON bundles.
3. Verify that the app displays a subtle indicator when operating in offline mode.
4. Direct users to the pre-downloaded map and attraction information.
5. When connectivity is restored, ensure the Service Worker syncs in the background.