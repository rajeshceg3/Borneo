# Operational Runbooks

## Incident Response Steps

1.  **Acknowledge:** The on-call engineer acknowledges the page/alert.
2.  **Assess:** Determine the severity of the incident (e.g., SEV1 - App down, SEV2 - Feature degraded, SEV3 - Minor issue).
3.  **Communicate:** Notify stakeholders via the designated communication channels (e.g., #incident-response Slack channel).
4.  **Investigate:** Use monitoring dashboards, logs, and tools to identify the root cause.
5.  **Mitigate/Resolve:** Apply a fix, workaround, or initiate a rollback to restore service.
6.  **Post-Incident:** Conduct a post-mortem to analyze the root cause, timeline, and implement preventative measures.

## Recovery Procedures

*   **Database Failure:** Promote a read replica to master or restore from the latest snapshot.
*   **Application Deployment Failure:** Initiate an immediate rollback using the CI/CD Rollback Workflow.
*   **Third-party Service Outage:** Enable fallback mechanisms or circuit breakers to gracefully handle the outage.

## Offline Mode Fallback Guide

If the application experiences complete network isolation or backend API failure:

1.  **Trigger:** The application will automatically detect network failure (e.g., via Service Worker `fetch` failures).
2.  **Action:** The Service Worker will intercept requests and serve cached content (static assets, OpenStreetMap tiles, and fallback backend API responses).
3.  **User Experience:** The user will remain in the application, and a banner or indicator will notify them that they are operating in Offline Mode.
4.  **Recovery:** Once network connectivity is restored, the application will automatically resume normal operations and sync data if necessary.
