# Borneo Rainforest Travel App - Operational Runbooks

## 1. Incident Response Steps

When an incident occurs (e.g., API downtime, map rendering failure, etc.), follow these steps:

1. **Acknowledge:** The on-call engineer must acknowledge the alert within 15 minutes.
2. **Triage:** Determine the severity of the incident.
   - Sev 1: Critical path broken (e.g., app completely unusable, map not loading).
   - Sev 2: Feature degraded (e.g., specific markers not appearing, night mode toggle failing).
   - Sev 3: Minor issue (e.g., typo in content, minor styling issue).
3. **Investigate:** Use dashboards (Grafana) and logging (Winston) to identify the root cause.
   - Check backend API response times and error rates.
   - Check CDN/Vercel status for frontend issues.
4. **Mitigate:** Apply a temporary fix or workaround to restore service as quickly as possible. This may involve triggering a rollback (see Recovery Procedures).
5. **Resolve:** Implement a permanent fix and deploy to production.
6. **Post-Mortem:** Conduct a blameless post-mortem for Sev 1 and Sev 2 incidents to identify preventative measures.

## 2. Recovery Procedures

### 2.1 Instant Rollback via CI/CD

If a recent deployment caused an incident, use the instant rollback mechanism.

1. Navigate to the "Actions" tab in the GitHub repository.
2. Select the "Rollback" workflow (`.github/workflows/rollback.yml`).
3. Click "Run workflow".
4. Enter the target commit SHA to rollback to.
5. The workflow will use `git read-tree` to revert the repository state to the target commit and create a new commit, pushing it as the latest HEAD on the current branch (e.g., `main`). This avoids rewriting Git history.
6. Verify the rollback is successful and the incident is resolved.

### 2.2 Backend Service Recovery

If the backend service (AWS/Render) goes down:
1. Check the hosting provider's status page for ongoing outages.
2. If it's isolated to our instance, attempt to restart the PM2 process or the container.
3. If the database/datastore is corrupted, restore from the latest automated backup.

### 2.3 Frontend/CDN Recovery

If the frontend hosting (Vercel/Netlify) or CDN (Cloudflare) is experiencing issues:
1. Verify the deployment status in the Vercel dashboard.
2. If a specific deployment is failing, use Vercel's "Instant Rollback" feature from their dashboard as an alternative to the GitHub Actions rollback.
3. If the CDN is misconfigured, purge the cache or revert recent DNS/caching rule changes.

## 3. Offline Mode Fallback Guide

The application is designed to function offline. If the backend API or internet connectivity fails, the app should gracefully fallback.

### 3.1 Verification Steps

If users report the app is not working offline:

1. **Check Service Worker:** Ensure `sw.js` is successfully registered in the browser. The Service Worker is responsible for serving cached map tiles, assets, and fallback API data.
2. **Check Cache Storage:** Open Developer Tools > Application > Cache Storage. Verify that the necessary caches (static assets, OpenStreetMap tiles, API fallbacks) exist and contain data.
3. **Simulate Offline:** In Developer Tools > Network, select "Offline". Reload the app and verify the map and markers load correctly.
4. **Trigger Offline Packager manually:** If the device cache is empty or corrupted, guide the user (when they have connection) to trigger the download from the `/offline-pack` endpoint to pre-cache data.

### 3.2 Mitigation

If the offline mode is genuinely broken (e.g., due to a recent code change):

1. Escalate to a Sev 1 incident if users are actively stranded without guidance.
2. Implement an immediate rollback to the last known working version with functional offline support.
3. Investigate the Service Worker logic or the backend `/offline-pack` endpoint for errors.
