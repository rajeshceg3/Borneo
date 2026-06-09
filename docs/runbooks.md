# Operational Runbooks

This document contains operational procedures for the Borneo Rainforest Travel Experience App.

## Incident response steps

1. Identify the incident severity.
2. Alert the on-call engineer and relevant stakeholders.
3. Establish an incident response team and communication channels.
4. Investigate the root cause.
5. Apply temporary fixes or rollbacks if necessary.
6. Verify service restoration.
7. Post-mortem and long-term fix implementation.

## Recovery procedures

1. In case of API failure, ensure fallback static data is correctly cached.
2. In case of database or file system corruption, restore from the latest automated backup.
3. To recover from a bad deployment, use the instant CI/CD rollback pipeline.
4. If frontend assets are corrupted, invalidate CDN caches and redeploy.

## Offline mode fallback guide

When users are in areas with poor or no connectivity:
1. Ensure the Service Worker (`sw.js`) is correctly caching app shell and necessary API responses.
2. The user should have the option to download the offline package beforehand.
3. If an offline package is missing, the app should fall back to any previously cached attractions and trails data seamlessly.
4. Validate that the UI gracefully indicates offline status without disrupting the primary gesture-based navigation experience.
