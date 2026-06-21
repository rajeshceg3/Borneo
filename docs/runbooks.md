# Operational Runbooks

## Incident Response Steps

1. **Acknowledge**: Respond to automated alerts or user reports immediately.
2. **Triange**: Determine severity (e.g., SEV1 for full outage, SEV2 for degraded performance).
3. **Communicate**: Update status page and notify stakeholders.
4. **Investigate**: Check logs via Winston and infrastructure dashboards (e.g., Grafana, AWS/Vercel logs).
5. **Mitigate**: Apply temporary fixes, perform rollbacks (see below), or bypass failing services.
6. **Resolve**: Deploy root cause fix.
7. **Post-Mortem**: Document root cause, timeline, and preventative measures.

## Recovery Procedures

### Application Rollback
- If a recent deployment causes issues, trigger the rollback CI/CD workflow.
- Ensure the previous stable state is loaded correctly.

### Database Recovery
- Not applicable for initial static JSON datastore phase.
- Ensure the backup zip of `offline-pack` is accessible.

## Offline Mode Fallback Guide

If backend APIs are completely unavailable or the user is in a zero-signal area (e.g., rainforest):
1. The app will automatically switch to offline mode using the Service Worker (`sw.js`).
2. Map tiles and data will be served from the local cache.
3. If users report missing data, direct them to download the offline package beforehand while connected to Wi-Fi.
4. Test offline mode manually by disabling network access and ensuring interactions (gestures, map, cards) function using cached assets.
