# Operational Runbooks

## Incident Response Steps
1. Identify the issue.
2. Mitigate impact.
3. Investigate root cause.
4. Resolve issue.
5. Post-mortem.

## Recovery Procedures
- If the database fails, switch to the read-replica.
- If a service goes down, attempt a restart via PM2.
- Use CI/CD rollback pipeline to restore a previous known good state if a bad deployment occurs.

## Offline Mode Fallback Guide
- Ensure the Service Worker is registered.
- Check if cached tiles and static assets exist.
- Fallback to `/offline-pack/download` to retrieve bundle.
