# Operational Runbooks

## Incident Response Steps

1. **Acknowledge:** The on-call engineer should acknowledge the alert within 15 minutes.
2. **Assess Impact:** Determine the severity (e.g., SEV-1 for full outage, SEV-2 for partial degradation).
3. **Communicate:** Notify stakeholders via the `#incidents` Slack channel. For SEV-1, update the public status page.
4. **Investigate:** Check logs, metrics (Grafana), and recent deployments to identify the root cause.
5. **Mitigate/Resolve:** Apply a fix, rollback the recent deployment, or activate fallback mechanisms.
6. **Post-Mortem:** Within 48 hours of resolution, write an incident report documenting root cause, impact, and prevention steps.

## Recovery Procedures

### Database Failure

1. Check if the database instance is reachable.
2. If unreachable, trigger a failover to the replica instance.
3. If failover fails, restore from the latest snapshot (taken within the last 24h).

### API Downtime

1. Ensure the CDN (e.g., Cloudflare) is serving cached assets.
2. If the backend is down, investigate server health and logs.
3. If necessary, scale up the backend instances or reboot unhealthy nodes.

### Deployment Rollback

1. Execute the GitHub Actions "Rollback Deployment" workflow to revert to the last stable build.
2. Verify system stability post-rollback.

## Offline Mode Fallback Guide

The Borneo Rainforest Travel App is designed to function smoothly even when users lose internet connectivity. This is achieved via a Service Worker and pre-cached assets.

### How it Works

*   **Service Worker:** Intercepts network requests and serves cached responses if offline.
*   **Asset Caching:** Images, map tiles, and critical JSON data are cached locally.

### Fallback Data (JSON Bundle)

*   If the live API is unreachable, the app relies on the bundled JSON datastore.
*   The `/offline-pack` API endpoint provides a zipped bundle for users to download before their trip.

### Troubleshooting Offline Mode

*   **User Issue:** "App is blank when offline."
    *   **Action:** Ensure the user previously loaded the app while online to install the Service Worker and cache the initial payload. Ask them to verify if they downloaded the offline pack.
*   **User Issue:** "Map tiles are missing."
    *   **Action:** Verify if the user visited the specific map areas while online or if the downloaded offline pack contains the required zoom levels.
