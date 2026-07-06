# Operational Runbooks

## Incident response steps

1. **Detection:** Monitor alerts in Grafana and via configured alerting channels (e.g., Slack, Email) for API failures, downtime, or performance degradation.
2. **Triage:** Assess the severity of the incident.
    - Sev 1: Complete outage.
    - Sev 2: Partial outage or severe performance degradation.
    - Sev 3: Minor issue.
3. **Communication:** Inform stakeholders about the ongoing issue on status pages or internal channels.
4. **Investigation:**
    - Check server logs (Winston logs).
    - Identify recent deployments or configuration changes.
5. **Mitigation:**
    - Rollback to a previous known good deployment if a recent release caused the issue.
    - Switch to fallback systems if necessary.
6. **Post-Mortem:** Write a post-mortem report outlining the root cause and steps to prevent future occurrences.

## Recovery procedures

1. **Database Failure:**
    - (Currently JSON based, so restore from source control if corrupted).
2. **Backend Outage:**
    - If the backend goes down, the frontend Service Worker should continue to serve cached content and fallback responses.
    - Restart backend services (e.g., via PM2 or hosting provider's panel).
3. **Rollback Release:**
    - Use the CI/CD Rollback workflow in GitHub Actions to instantly revert to a previous working commit.
    - Monitor the successful deployment of the rollback commit.

## Offline mode fallback guide

When the network is slow or unavailable, the application relies on the following offline mode mechanisms:
- **Service Worker (`frontend/public/sw.js`):** Intercepts network requests and serves cached assets, including HTML, CSS, JS, and OpenStreetMap tiles.
- **Data Fallbacks:** If the backend API cannot be reached, the frontend falls back to pre-cached JSON responses for attractions, wildlife, and trails.
- **Offline Packager:** Users can download an offline package containing map tiles, images, and JSON data via the `/offline-pack` endpoint before traveling to areas with poor connectivity.
- **Verification:** Ensure that the Service Worker is successfully registered in the user's browser for offline capabilities to function properly.
