# Operational Runbooks

This document outlines the operational procedures for the Borneo Rainforest Travel Experience App.

## Incident Response Steps

1. **Acknowledge the Alert**: Ensure the on-call engineer has acknowledged the alert in the monitoring system.
2. **Assess Severity**: Determine the impact of the incident (e.g., Critical: API down for all users; Warning: high latency on specific endpoints).
3. **Investigate**:
   - Check application logs via the logging provider (e.g., Winston logs).
   - Review performance metrics (CPU, Memory, Request times).
   - Check infrastructure health (Vercel/AWS/Render status pages).
4. **Mitigate**:
   - Apply an immediate fix if known (e.g., restart services, scale up resources).
   - If a recent deployment caused the issue, trigger the Rollback workflow in GitHub Actions.
5. **Resolve & Verify**: Ensure the issue is resolved and monitor the application for at least 15 minutes to confirm stability.
6. **Post-Incident Review (PIR)**: Document the root cause, timeline, and action items to prevent future occurrences.

## Recovery Procedures

### Database/Datastore Failure
- Currently, the application uses a JSON-based datastore. If the data is corrupted, restore the `data/` directory from the latest commit in the main branch.

### Service Outage
- **Frontend (Vercel)**: Ensure the Vercel deployment is active. If the domain is unreachable, check DNS settings in Cloudflare.
- **Backend (Render/AWS)**: Restart the backend service instance. If the instance is unreachable, spin up a new instance using the CI/CD deployment pipeline.

### Rollback Procedure
If a bad deployment is released to production, trigger the GitHub Actions `Rollback` workflow. Provide the target commit SHA to revert the main branch back to the stable state.

## Offline Mode Fallback Guide

The application is designed to function seamlessly offline in the Borneo rainforest.

### Client-Side Fallback
1. **Service Worker**: The app relies on a Service Worker (`sw.js`) to cache map tiles, images, and JSON data.
2. **Missing Data**: If a user accesses an uncached area while offline, the frontend will display a "Data not available offline" fallback message without crashing.
3. **Sync**: Data synchronization only occurs when the user connects to a stable network.

### Offline Package Maintenance
- The backend serves a pre-packaged zip file of offline assets via the `/offline-pack/download` endpoint.
- Ensure the bundle generation logic in the backend uses `archiver` correctly and includes the latest static map tiles and images.
- Test the bundle generation periodically to ensure the zip file size remains manageable (< 50MB).
