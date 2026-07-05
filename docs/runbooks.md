# Operational Runbooks

## Incident Response Steps

1. **Acknowledge**: Acknowledge the alert within 5 minutes.
2. **Investigate**: Check logs and metrics in Grafana.
3. **Mitigate**: If a recent deployment caused the issue, trigger the Rollback workflow.
4. **Resolve**: Deploy a fix to staging, test, and promote to production.
5. **Post-Mortem**: Document the root cause and preventive measures.

## Recovery Procedures

- **Database Failure**: Restore from the latest automated snapshot.
- **Service Outage**: Check deployment status and scale up instances if necessary.
- **Rollback**: Trigger `.github/workflows/rollback.yml` with the last known good commit SHA.

## Offline Mode Fallback Guide

If the backend is unreachable or offline:
1. Ensure the Service Worker (`sw.js`) is active.
2. Verify that `offline-pack.zip` was successfully downloaded and cached.
3. The app will automatically fallback to serving static assets and cached map tiles.
4. Data requests will be intercepted by the Service Worker and served from the cache.
