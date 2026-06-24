# Operational Runbooks

## Incident Response Steps

1. **Acknowledge and Triage**
   - Confirm the incident and identify user impact.
   - Check available metrics (logs, performance tracking).

2. **Investigate**
   - Check if backend APIs are responding (e.g. `/attractions`, `/wildlife`).
   - Check if frontend is loading assets correctly.
   - Look for recent deployments.

3. **Mitigate**
   - If a recent deployment caused issues, use the Rollback CI/CD workflow to revert to a stable commit.
   - If backend is down, instruct users to rely on the Offline mode.

4. **Resolve**
   - Fix the underlying issue.
   - Write post-mortem and add preventive measures.

## Recovery Procedures

- **Database/Storage Recovery**: Restore latest snapshot from backups.
- **Service Recovery**: Restart the Node server via PM2 or redeploy the latest healthy build via CI/CD.

## Offline Mode Fallback Guide

If backend connectivity is lost:
1. Ensure the Service Worker (`sw.js`) is correctly registered on the frontend.
2. The Service Worker will automatically cache API responses and map tiles.
3. For fully disconnected setups, instruct users to use the Offline Packager (`GET /offline-pack`) to download a pre-bundled zip of JSON data, images, and map tiles before entering no-signal areas.
