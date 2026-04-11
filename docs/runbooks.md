# Borneo Rainforest Travel Experience App - Operational Runbooks

## 1. Incident Response Steps

1.  **Identify the Issue:** Check monitoring dashboards (Grafana) and alert notifications to understand the scope and impact of the incident.
2.  **Triage & Severity Assessment:** Determine if it's a critical failure (e.g., app unusable, API downtime) or a minor issue (e.g., degraded performance).
3.  **Investigate:** Use logs (Winston via backend), traces, and metrics to find the root cause.
4.  **Mitigate:** Apply a temporary fix or workaround to restore service if possible (e.g., scale up instances, restart services).
5.  **Resolve:** Implement a permanent fix and deploy it through the CI/CD pipeline.
6.  **Post-Incident Review:** Document the incident, root cause, resolution, and action items to prevent recurrence.

## 2. Recovery Procedures

*   **Database Failure:** Restore the latest working JSON data snapshot from version control or backup.
*   **Service Downtime:** Utilize the "Enable instant rollback via CI/CD" feature to revert to the last stable build.
*   **API Outage:** The frontend is designed to handle API failures gracefully by utilizing cached data and fallback mechanisms. Monitor the frontend for proper fallback execution.

## 3. Offline Mode Fallback Guide

1.  **Pre-trip Preparation:** Users should ensure they have accessed the app while connected to the internet to cache essential data (map tiles, JSON data, images) via the Service Worker.
2.  **Downloading the Offline Pack:** Users can proactively download the offline package (`GET /offline-pack/download`) before venturing into areas with zero signal.
3.  **Using the App Offline:** The Service Worker (`sw.js`) will intercept network requests and serve cached content, allowing users to navigate the map, view attractions, and access wildlife information without an active internet connection. Ensure users are aware that real-time features (if any are added in the future) will not be available.