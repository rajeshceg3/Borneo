# Operational Runbooks

## Incident Response Steps
1. **Identify the Issue:** Look at system metrics, alerts, or user reports to understand what is failing.
2. **Contain the Issue:** Apply immediate workarounds or roll back the deployment if the issue was introduced recently.
3. **Investigate the Root Cause:** Check server logs (`backend/`), client performance trackers, and integration points.
4. **Resolve the Issue:** Implement a fix, write a test for the regression, and deploy via the standard CI/CD pipeline.
5. **Post-Mortem:** Document the incident, the root cause, the resolution, and any preventative measures taken.

## Recovery Procedures
1. **App Crash:** Restart the application via PM2 (`pm2 restart app`). Ensure no zombie processes are blocking the ports.
2. **Database/Storage Failure:** Restore from the latest automated backups. For static assets, ensure S3/Cloudflare/Vercel are functioning.
3. **Bad Deployment Rollback:** Trigger the GitHub Actions CI/CD rollback workflow (`.github/workflows/rollback.yml`) with the targeted good commit hash.
4. **Data Sync Issue:** Force a cache invalidation for the offline packager and prompt users to re-download offline bundles if necessary.

## Offline Mode Fallback Guide
The app is designed to function smoothly without an internet connection using Service Workers (`sw.js`) and IndexedDB/Cache API.

1. **Service Worker Loading:** If the user cannot connect, `sw.js` immediately intercepts requests and serves cached core assets, maps, and JSON data.
2. **Offline Package Extraction:** If the network goes down, users who pre-downloaded the offline package will have all map tiles, imagery, and JSON files ready.
3. **Fallback UI:** If data isn't available in the cache, the app gracefully degrades, displaying placeholder cards while allowing continued map usage and gesture-based navigation without errors.
