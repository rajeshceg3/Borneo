# Operational Runbooks

## Incident Response Steps
1. **Identify the Incident**: Acknowledge alerts from Grafana/Prometheus or user reports.
2. **Triage and Assess Impact**: Determine if the issue affects core features (e.g., API downtime, map lag).
3. **Communicate**: Notify the team and update status pages if applicable.
4. **Investigate**: Check Winston logs, API response times, and server health.
5. **Mitigate/Resolve**: Apply fixes, rollback deployments, or increase resources.
6. **Post-Mortem**: Document the incident, root cause, and preventative measures.

## Recovery Procedures
1. **Database/Data Store Failure**: Restore `data/*.json` from the latest backup or re-deploy the latest stable build.
2. **API Unavailability**:
   - Check if the backend service is running using PM2 or Render dashboard.
   - Restart the service: `pm2 restart borneo-api` or trigger a restart on Render.
3. **Deployment Rollback**: Revert to the previous stable commit and trigger the CI/CD pipeline, or use Render/Vercel rollback features.

## Offline Mode Fallback Guide
1. **Trigger Condition**: When the user has no internet connectivity or the API is unreachable.
2. **Action**: The frontend Service Worker (`sw.js`) automatically serves cached static assets, OpenStreetMap tiles, and fallback backend API responses.
3. **Validation**: Ensure users can still navigate the map, view pre-cached attractions/wildlife cards, and use gesture navigation seamlessly without errors.
4. **Resumption**: Once connectivity is restored, the Service Worker resumes normal network requests and updates the cache in the background.