# Operational Runbooks

This document contains operational procedures for maintaining and recovering the Borneo Rainforest Travel Experience App.

## Incident response steps

1. **Acknowledge the Incident:** Respond to monitoring alerts or user reports immediately.
2. **Identify the Scope:** Determine if the issue affects the frontend, backend, database, or network.
3. **Communicate:** Notify the team and stakeholders about the ongoing incident and expected resolution time.
4. **Investigate:** Check application logs (Winston in backend), infrastructure metrics, and CDN status.
5. **Mitigate:** Apply temporary fixes or workarounds if a full resolution requires time (e.g., scaling up resources, blocking malicious traffic).
6. **Resolve:** Implement the permanent fix and deploy via CI/CD.

## Recovery procedures

1. **Service Restart:** If a service hangs, restart it using the infrastructure provider's console or PM2 for local instances.
2. **Rollback Deployment:** If a new deployment causes critical issues, trigger the CI/CD Rollback Workflow (`.github/workflows/rollback.yml`) with the target stable commit hash.
3. **Data Restoration:** In case of data corruption, restore the latest working snapshot of the backend data.
4. **Post-Mortem:** After recovery, conduct a post-mortem to identify the root cause and implement preventative measures.

## Offline mode fallback guide

1. **Pre-caching Verification:** Ensure that the Service Worker is correctly installed and caching static assets and map tiles during initial load.
2. **Offline Package Download:** Direct users to download the offline bundle via the `GET /offline-pack/download` endpoint while they have internet access.
3. **Data Access Without Network:** If the backend is unreachable, the app should automatically switch to using cached data (attractions, wildlife, trails).
4. **UI Indicators:** Verify that the app displays clear indicators when operating in offline mode.
5. **Sync Recovery:** Once the network connection is restored, the app should seamlessly switch back to live API requests and refresh stale data if necessary.
