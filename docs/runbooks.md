# Operational Runbooks

This document contains procedures for incident response, recovery, and an offline mode fallback guide.

## Incident Response Steps

1.  **Acknowledge and Assess:** Recognize the alert or issue report. Determine the severity and impact on the application.
2.  **Investigate:** Check monitoring dashboards (e.g., Grafana, Vercel logs, backend service logs). Identify the failing component (e.g., frontend, backend API, map tiles).
3.  **Communicate:** Notify stakeholders and update the status page if applicable.
4.  **Mitigate:** Apply immediate fixes to stop the impact (e.g., restart services, revert a deployment, scale up resources).
5.  **Resolve:** Implement a permanent fix for the root cause.
6.  **Post-Mortem:** Document the incident, root cause, and steps taken to prevent future occurrences.

## Recovery Procedures

*   **Service Restart:** If the backend service crashes, restart it using the designated process manager (e.g., `pm2 restart app`).
*   **Database/Cache Restoration:** If data is corrupted or lost, restore from the latest snapshot or backup.
*   **Deployment Rollback:** In case of a bad release, use the automated CI/CD rollback workflow (`.github/workflows/rollback.yml`) to revert to the previous stable state. Provide the stable commit SHA as input.

## Offline Mode Fallback Guide

The application is designed to function smoothly even when users are deep in the rainforest without internet connectivity.

1.  **Preparation (Online):** Before heading offline, users should ensure they have opened the app while connected to the internet. The Service Worker will automatically cache static assets, map tiles, and essential data.
2.  **Offline Packager:** Users can optionally download an offline package (`/offline-pack/download`) containing bulk data, tiles, and images for extended offline use.
3.  **Automatic Fallback:** When the device loses connection, the Service Worker intercepts network requests and serves the cached content seamlessly.
4.  **Limitations:** Real-time updates or dynamic data not previously cached will be unavailable. Users will see cached versions of attractions, wildlife, and trails.
5.  **Restoring Connection:** Once the device reconnects, the Service Worker will synchronize and fetch any new or updated data in the background.
