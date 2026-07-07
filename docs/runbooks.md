# Operational Runbooks

## Incident Response Steps
1. **Identify the Incident**: Monitor alerts from Grafana and check user reports.
2. **Classify**: Determine severity (Critical, High, Medium, Low).
3. **Communicate**: Notify stakeholders via appropriate channels.
4. **Investigate**: Analyze logs (Winston) and system metrics.
5. **Mitigate/Resolve**: Apply hotfixes, scale resources, or initiate rollback.
6. **Post-Mortem**: Document root cause and preventative measures.

## Recovery Procedures
1. **API Failure**: Check backend logs, restart PM2 service, ensure database/cache connectivity.
2. **Frontend Unavailability**: Verify Vercel deployment status, clear CDN cache if necessary.
3. **Data Loss**: Restore from latest automated backup.

## Offline Mode Fallback Guide
1. Ensure the Service Worker (`sw.js`) is correctly registered and caching static assets.
2. Verify that `/offline-pack/download` correctly generates the ZIP with JSON, images, and tiles.
3. If users report missing data offline, instruct them to connect to Wi-Fi and allow the app to synchronize locally.
