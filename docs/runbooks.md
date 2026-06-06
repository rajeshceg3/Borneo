# Operational Runbooks

## Incident Response Steps

1. **Acknowledge:** The on-call engineer acknowledges the incident alert.
2. **Investigate:** Check Grafana dashboards, backend logs (Winston), and Vercel/Render deployments.
3. **Mitigate:** If a recent deployment caused the issue, trigger the instant rollback via the CI/CD pipeline using `.github/workflows/rollback.yml`.
4. **Communicate:** Update the status page and inform stakeholders.
5. **Resolve:** Deploy a fix and monitor.
6. **Post-Mortem:** Conduct a post-incident review to prevent recurrence.

## Recovery Procedures

1. **Database Failure:** Restore from the latest snapshot. Ensure the initial JSON datastore is accessible.
2. **Backend Unavailability:** If Render/AWS goes down, verify caching and fallback strategies are active on the frontend (Service Worker).
3. **CDN Outage:** If Cloudflare fails, ensure Vercel is serving static assets correctly with proper cache headers.

## Offline Mode Fallback Guide

1. The frontend utilizes a Service Worker (`frontend/public/sw.js`) to implement offline mode and tile caching.
2. If network requests fail, the app will serve cached backend API responses and OSM tiles.
3. Users should be notified visually that the app is operating in offline mode.
4. Ensure the `/offline-pack` endpoint allows users to pre-download critical assets before going offline.
