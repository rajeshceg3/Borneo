# Operational Runbooks

## Incident Response Steps

1. **Acknowledge**: Respond to the alert (e.g., via PagerDuty or Slack) within 5 minutes.
2. **Investigate**: Check application logs, performance dashboards, and error tracking tools to determine the root cause.
3. **Mitigate**: If a recent deployment caused the issue, trigger the instant rollback via the CI/CD pipeline (see Recovery Procedures).
4. **Communicate**: Update the status page and inform stakeholders of the current status and estimated time to resolution.
5. **Resolve**: Deploy a permanent fix once the root cause is identified and tested.
6. **Post-Mortem**: Document the incident, root cause, and steps taken to prevent future occurrences.

## Recovery Procedures

### Instant Rollback via CI/CD

If a deployment introduces a critical bug or performance degradation, trigger an instant rollback:

1. Navigate to the GitHub Actions tab.
2. Select the "Rollback" workflow.
3. Provide the target commit hash you wish to roll back to.
4. Run the workflow to revert the tree state and push a new commit.

## Offline Mode Fallback Guide

The application is designed to function entirely offline using a Service Worker and precached assets. If the backend API goes down:

1. The frontend Service Worker intercepts API requests and serves locally cached responses.
2. The user experience remains uninterrupted for previously visited locations.
3. Ensure the `/offline-pack/download` endpoint is monitored, as it provides the full asset bundle for users venturing into no-signal areas.