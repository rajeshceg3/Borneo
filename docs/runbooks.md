# Operational Runbooks

## Incident response steps
1. Acknowledge the alert.
2. Investigate the root cause (check logs in `winston`).
3. Communicate status to stakeholders.
4. Mitigate the issue (e.g., restart PM2, rollback deployment).
5. Document the incident and perform a post-mortem.

## Recovery procedures
1. Verify database integrity.
2. Restore from backup if necessary.
3. Validate API endpoints are functioning.
4. Confirm frontend map is rendering properly.
5. Monitor for any recurrent issues.

## Offline mode fallback guide
1. Verify Service Worker (`sw.js`) is correctly caching OpenStreetMap tiles.
2. Ensure JSON datastore fallback files are pre-cached.
3. Check if the offline packager endpoint (`/offline-pack/download`) generates a valid zip bundle.
4. If issues occur, prompt users to download the latest offline bundle when next connected to the internet.