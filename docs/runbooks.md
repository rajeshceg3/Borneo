# Operational Runbooks

## Incident Response Steps

1. **Acknowledge:** The on-call engineer acknowledges the incident via the alerting system (e.g., PagerDuty, Slack).
2. **Assess:** Determine the severity and impact of the incident. Check system metrics, logs, and user reports.
3. **Communicate:** Update internal status pages and notify relevant stakeholders. If user-facing, update the public status page.
4. **Investigate:** Isolate the root cause. This may involve querying logs, examining recent deployments, or checking infrastructure health.
5. **Mitigate:** Apply a temporary fix or workaround to restore service as quickly as possible. This might involve rolling back a release, scaling up resources, or disabling a problematic feature.
6. **Resolve:** Implement a permanent fix. Deploy the fix through the standard CI/CD pipeline.
7. **Post-Mortem:** Conduct a blameless post-mortem review to understand why the incident occurred and how to prevent it in the future. Document findings and action items.

## Recovery Procedures

* **Database Failure:** If the backend datastore fails, restore from the latest automated backup. Ensure the application can gracefully handle the temporary unavailability.
* **API Downtime:** If the backend API goes down, the frontend should automatically fallback to the cached offline package (if available) or display a user-friendly error message. Investigate the API service logs to identify and resolve the issue.
* **CDN Issues:** If the CDN serving static assets or map tiles experiences issues, check the CDN provider's status page. If necessary, bypass the CDN and serve assets directly from the origin server (temporarily).
* **Rollback Strategy:** Maintain previous builds in the CI/CD pipeline to enable instant rollback if a new deployment introduces critical bugs.

## Offline Mode Fallback Guide

The Borneo app is designed to function even when users have poor or no internet connectivity (e.g., in the rainforest).

1. **Mechanism:** The frontend uses a Service Worker (`sw.js`) to cache static assets, map tiles, and backend API responses.
2. **Offline Package:** The backend provides an endpoint (`/offline-pack/download`) to generate a compressed zip package containing essential data (JSON, images, tiles) for offline use.
3. **Frontend Behavior:**
    * When online, the app fetches data from the API and caches it.
    * When offline, the Service Worker intercepts network requests and serves the cached responses.
    * If data is missing from the cache, the app displays a graceful fallback message or UI, indicating that the feature requires an internet connection.
4. **Troubleshooting Offline Issues:**
    * Ensure the Service Worker is registered and active in the user's browser.
    * Check the browser's Cache Storage to verify that assets and data are being cached correctly.
    * If the offline package is not downloading or extracting properly, investigate the backend `/offline-pack/download` endpoint logs.
