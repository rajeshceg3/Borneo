# Operational Runbooks

## Incident Response Steps

1.  **Acknowledge and Assess:**
    *   Acknowledge the alert (e.g., via Slack, Email, or Grafana).
    *   Assess the severity and impact of the incident (e.g., is the API completely down? Are map tiles failing to load?).
2.  **Investigate:**
    *   Check Grafana dashboards for anomalies in response times, error rates, or traffic spikes.
    *   Review backend logs (via PM2 logs, or Cloud Logging if deployed).
    *   Check the `/metrics` endpoint to ensure the backend is still responding.
3.  **Mitigate:**
    *   If a recent deployment caused the issue, trigger an instant rollback via the CI/CD pipeline (GitHub Actions).
    *   If the backend is overwhelmed, consider scaling up the service on the hosting provider (Render).
    *   If the database/datastore is unresponsive, investigate the underlying storage layer.
4.  **Resolve:**
    *   Implement a fix (if the issue was code-related).
    *   Deploy the fix and verify that the service is restored.
5.  **Post-Mortem:**
    *   Document the root cause of the incident.
    *   Identify preventative measures to avoid recurrence.
    *   Update these runbooks and alerting rules if necessary.

## Recovery Procedures

*   **Backend API Failure:**
    1.  Check the server status and logs.
    2.  Restart the application (`npm start` or via process manager like PM2).
    3.  Verify the service by curling the `/` or `/attractions` endpoint.
*   **Frontend Deployment Failure:**
    1.  Check the Vercel deployment logs.
    2.  If a build failed, resolve the build error and re-trigger the deployment.
    3.  If the deployed version is broken, use Vercel's rollback feature to revert to the previous successful deployment.

## Offline Mode Fallback Guide

The application is designed with a robust offline mode. If the primary backend API is unavailable or the user is in an area with no internet connectivity, the application should degrade gracefully.

1.  **Service Worker Activation:** The application relies on a Service Worker (`sw.js`) to cache static assets, OpenStreetMap tiles, and backend API responses. Ensure the Service Worker is registered and active.
2.  **Cached Data:** When the application starts, it will attempt to fetch data from the backend. If the request fails (e.g., due to network error), the Service Worker will intercept the request and serve the previously cached response.
3.  **Offline Pack Download:** Users are encouraged to download the "Offline Pack" (a `.zip` file containing JSON data, images, and map tiles) before venturing into areas with poor connectivity. This pack can be downloaded via the `/offline-pack/download` endpoint.
4.  **Fallback Data:** In the event that neither the network nor the cache is available, the application relies on hardcoded fallback data (e.g., in `frontend/src/api.js`) to ensure basic functionality.
5.  **Testing Offline Mode:** Developers should regularly test the offline capabilities by simulating an offline environment in the browser's developer tools or by running the application without a backend server.
