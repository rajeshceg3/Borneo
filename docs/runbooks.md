# Operational Runbooks

This document outlines the operational procedures for managing and troubleshooting the Borneo Rainforest Travel Experience App.

## Incident Response Steps

When an incident (such as an outage, degradation, or major bug) is detected or reported:

1. **Acknowledge:** The on-call engineer acknowledges the alert.
2. **Triage:** Determine the severity (e.g., P1 for total outage, P3 for minor bugs). Assess the impact on user experience.
3. **Investigate:** Check system logs (Winston), performance tracking metrics, and infrastructure dashboards to identify the root cause.
4. **Mitigate/Resolve:** Apply a fix, switch to offline mode, or trigger a rollback if a recent deployment caused the issue.
5. **Communicate:** Notify stakeholders and update the status page.
6. **Post-Mortem:** Once resolved, document the incident, root cause, and preventative measures.

## Recovery Procedures

In the event of a critical failure or bad deployment, follow these recovery procedures:

- **Deployment Rollback:** Use the automated GitHub Actions CI/CD pipeline (`rollback.yml`) to instantly revert to the last known good commit. This restores previous builds safely.
- **Service Restart:** For backend issues, restart the PM2 processes managing the backend service.
- **Data Restoration:** If the primary data source fails, the system will rely on cached tile data and the offline package to serve content.

## Offline Mode Fallback Guide

The application is designed to function smoothly even when connectivity is lost, thanks to Service Worker caching and the offline JSON packager.

- **Triggering Offline Mode:** The app automatically switches to offline mode when a network failure is detected. No user intervention is required.
- **Fallback Content:** The app will serve pre-cached map tiles, attractions data, and wildlife information.
- **Troubleshooting:**
  - If map tiles fail to load offline, verify that the Service Worker is correctly installed and that the user downloaded the offline package via the backend endpoint before losing signal.
  - Check the local storage and cache storage to ensure assets are present.
