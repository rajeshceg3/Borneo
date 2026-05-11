# Operational Runbooks

## Incident Response Steps
1. **Acknowledge**: Acknowledge the incident in the alerting system.
2. **Investigate**: Check dashboards and logs to determine the root cause.
3. **Mitigate**: Apply quick fixes or rollbacks if available.
4. **Resolve**: Implement a permanent fix and verify its success.
5. **Review**: Conduct a post-mortem to prevent future occurrences.

## Recovery Procedures
1. **Database Recovery**: Restore from the latest snapshot if data corruption is suspected.
2. **Service Restart**: Restart affected services if they are unresponsive.
3. **Rollback**: Trigger the rollback workflow in GitHub Actions to revert to the last known good commit.

## Offline Mode Fallback Guide
1. Ensure users have downloaded the offline package before venturing into the field.
2. If the app fails to load online resources, verify that the Service Worker is correctly serving cached assets.
3. Instruct users to check their device's storage to ensure the offline package is not corrupted.
