# Operational Runbooks

## Incident Response Steps
1. Acknowledge the alert.
2. Investigate the issue using Grafana dashboards and Winston logs.
3. Determine the severity of the issue.
4. If it's a critical bug in production, initiate instant rollback via CI/CD.
5. Communicate the incident status to stakeholders.
6. Develop a hotfix for the issue.
7. Test the hotfix thoroughly.
8. Deploy the hotfix to production.
9. Conduct a post-incident review.

## Recovery Procedures
1. Ensure the underlying issue is resolved.
2. Gradually restore traffic to the affected service.
3. Monitor performance metrics to ensure stability.
4. Verify data integrity if applicable.
5. Update runbooks if necessary based on the recovery experience.

## Offline Mode Fallback Guide
1. Inform users that the application is operating in offline mode.
2. The Service Worker will automatically serve cached assets (map tiles, images, JSON data).
3. Ensure users have previously downloaded the offline package via `GET /offline-pack/download`.
4. Some features like live syncing or new attraction updates will be disabled.
5. When connectivity is restored, the Service Worker will sync any pending changes.