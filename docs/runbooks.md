# Operational Runbooks

## Incident Response Steps

1. **Detection:** Acknowledge the alert (e.g., from Grafana/PagerDuty).
2. **Triage:** Assess the severity of the incident.
    * **SEV1:** Complete outage. Immediate attention required.
    * **SEV2:** Degraded performance or partial outage. High priority.
    * **SEV3:** Minor issue, localized impact. Normal priority.
3. **Mitigation:** Implement immediate fix to restore service (e.g., restart service, rollback deployment).
4. **Investigation:** Identify the root cause. Review logs (Winston) and metrics.
5. **Resolution:** Implement a permanent fix and verify it.
6. **Post-Mortem:** Document the incident, root cause, and action items to prevent recurrence.

## Recovery Procedures

### Database/Data Store Failure
* **Action:** Restore from the latest available backup. For the current JSON-based datastore, ensure the backup JSON files are loaded correctly.
* **Verification:** Verify data integrity and application functionality post-restore.

### Application Deployment Failure
* **Action:** Trigger the automated CI/CD rollback pipeline.
* **Verification:** Ensure the application reverts to the previous stable state and all health checks pass.

### Region/Server Outage
* **Action:** Failover to a secondary region/server if configured. Otherwise, provision new infrastructure and deploy the application.
* **Verification:** Update DNS records and verify traffic routing.

## Offline Mode Fallback Guide

* **Description:** The application features a robust offline mode supported by a Service Worker (`sw.js`).
* **Procedure:**
    1. If the backend API or internet connection is unavailable, the application will automatically fall back to serving cached assets and data.
    2. Ensure the offline packager endpoint (`/offline-pack/download`) is regularly tested to ensure up-to-date data is bundled.
    3. Instruct users to download the offline package prior to entering areas with limited connectivity.
* **Limitations:** Dynamic features or real-time updates will be unavailable until connectivity is restored.
