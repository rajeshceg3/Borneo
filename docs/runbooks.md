# Operational Runbooks

## Incident Response Steps

1. **Acknowledge and Triage**: The on-call engineer acknowledges the alert and assesses severity.
2. **Investigate**: Check logs and metrics.
3. **Mitigate**: Apply a quick fix, failover, or rollback.
4. **Communicate**: Update status page or stakeholders.
5. **Resolve**: Deploy permanent fix.
6. **Review**: Write a post-mortem to prevent recurrence.

## Recovery Procedures

1. **Database Failure**: Failover to replica. If complete failure, restore from latest backup.
2. **App Server Failure**: Ensure autoscaling groups spawn new instances. If regional failure, route traffic to secondary region.
3. **Data Corruption**: Rollback database to a point before corruption occurred and replay valid transactions.
4. **Deployment Failure**: Use the rollback workflow to revert to the previous stable release.

## Offline Mode Fallback Guide

If the application is experiencing network or backend outages, the frontend should still function via the Service Worker:

1. **Ensure Caching**: The Service Worker caches essential assets, map tiles, and fallback data.
2. **Fallback Content**: If live data cannot be fetched, the app will serve the last cached JSON data.
3. **User Communication**: Display a subtle "Offline Mode" indicator so users know data might not be up-to-date.
4. **Recovery**: Once network is restored, the Service Worker will re-fetch and update caches.
