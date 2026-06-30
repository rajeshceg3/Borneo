# Operational Runbooks

## Incident Response Steps
1. Identify the incident and assess the impact.
2. Alert the on-call engineers.
3. Establish a communication channel for the incident.
4. Investigate the root cause (check logs, metrics).
5. Implement a fix or mitigation.
6. Verify the fix has resolved the incident.
7. Conduct a post-mortem to prevent future occurrences.

## Recovery Procedures
- If the frontend fails, verify Vercel deployment logs and trigger a redeploy or rollback to the previous stable build.
- If the backend fails, verify server health and PM2 logs, then restart the service or perform a rollback using the rollback CI/CD workflow.
- Ensure database/datastore backups are available and restore if necessary.

## Offline Mode Fallback Guide
- The application uses a Service Worker to cache map tiles, JSON data, and images.
- If connectivity is lost, the Service Worker intercepts network requests and serves the cached content.
- Ensure the user has visited the app at least once with connectivity to prime the cache, or has downloaded the offline package via the provided API.
- If users report offline mode not working, verify that the Service Worker is correctly registered and the offline package has been successfully downloaded.