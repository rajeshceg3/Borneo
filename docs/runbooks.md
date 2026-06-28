# Operational Runbooks

## Incident response steps

1. Identify the incident and assess impact.
2. Check monitoring dashboards and alerting systems (e.g. Grafana).
3. Notify relevant stakeholders and team members.
4. Investigate root cause using logs (Winston) and server metrics.
5. If necessary, execute rollback procedures via CI/CD.
6. Once mitigated, perform a post-mortem to prevent future occurrences.

## Recovery procedures

1. In case of API failure, ensure fallback cache is engaged.
2. If the frontend is completely down, check the Vercel deployment status.
3. If the backend is down, check AWS/Render status and restart services using PM2 if necessary.
4. Database/data store recovery: If data is corrupted, restore from the latest offline-pack or backup snapshot.
5. Validate full recovery by running E2E and integration tests.

## Offline mode fallback guide

1. App should automatically detect lack of network via `navigator.onLine` and Service Worker.
2. Service Worker (`sw.js`) intercepts network requests and serves cached static assets (HTML/CSS/JS) and OpenStreetMap tiles.
3. Fallback backend API responses for `/attractions`, `/wildlife`, and `/trails` are served from cache or local storage.
4. If offline mode fails to load, prompt the user to download the offline package manually when they next have internet access.
