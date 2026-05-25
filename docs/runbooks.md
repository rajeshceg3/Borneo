# Operational Runbooks

## Incident Response Steps

1. **Acknowledge:** The on-call engineer acknowledges the alert.
2. **Triage:** Assess the severity of the incident. Check logs, metrics, and recent deployments.
3. **Communicate:** Notify stakeholders and update the status page if customer-facing.
4. **Mitigate:** Apply a hotfix, rollback, or failover to restore service.
5. **Resolve:** Confirm the issue is fully resolved and monitor for recurrence.
6. **Post-Mortem:** Conduct a blameless post-mortem to identify the root cause and prevent future occurrences.

## Recovery Procedures

### Rollback via CI/CD

If a recent deployment caused the incident, initiate a rollback:
1. Go to the GitHub Actions tab.
2. Select the **Rollback Pipeline** workflow.
3. Click **Run workflow**.
4. Enter the `target_commit` hash of the last known good state.
5. Verify the rollback is successful and monitor the system.

### Database Recovery

(Instructions for database recovery go here)

## Offline Mode Fallback Guide

The application utilizes a Service Worker to provide offline capabilities.

If the backend API is unreachable or the user loses network connectivity:
1. The Service Worker will intercept network requests.
2. It will serve cached static assets, OpenStreetMap tiles, and fallback backend API responses.
3. The app remains functional in offline mode, allowing users to explore pre-cached map areas and data.

**Testing Offline Mode:**
1. Open the application in a browser.
2. Navigate around the map and open some cards to cache data.
3. Open DevTools -> Network tab and select "Offline".
4. Reload the page and verify the application still loads and cached features are accessible.
