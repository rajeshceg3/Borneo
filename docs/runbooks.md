# Operational Runbooks

## Incident Response Steps
1. **Identify the Incident**: Monitor alerts (e.g., via Grafana, Cloudflare) or user reports to detect anomalies such as API failures, downtime, or performance degradation.
2. **Acknowledge and Triage**: Confirm the severity of the issue and assign an incident lead. Establish a communication channel for the response team.
3. **Investigate**:
   - Check backend API status and logs (Winston logs on AWS/Render).
   - Check frontend hosting status (Vercel/Netlify status page).
   - Verify infrastructure health, CDN hit rates, and database queries.
4. **Mitigate/Resolve**:
   - Apply a hotfix if the root cause is a simple bug.
   - Scale infrastructure if there's a load issue.
   - If a recent deployment caused the issue, trigger a rollback via CI/CD.
5. **Monitor Post-Resolution**: Keep monitoring the service to ensure stability after mitigation.
6. **Post-Mortem**: Document the root cause, timeline, and preventive measures.

## Recovery Procedures
- **Instant Rollback via CI/CD**: In GitHub Actions, trigger the rollback workflow or revert the latest commit on `main` and allow the CI/CD pipeline to deploy the previous stable build.
- **Database Restoration**: If data corruption occurs, restore from the latest automated snapshot.
- **Infrastructure Recreation**: If primary hosting fails entirely, deploy the infrastructure via Infrastructure as Code (e.g., Terraform) in a secondary region.

## Offline Mode Fallback Guide
The application is designed to function smoothly without internet connectivity. If the backend goes down or the user is in a zero-signal area:
1. **Service Worker Interception**: The `sw.js` Service Worker will intercept network requests.
2. **Cache Retrieval**: For static assets and map tiles, the Service Worker will serve them from the local cache.
3. **Fallback Data**: For API requests (e.g., `/attractions`, `/wildlife`), the application will fallback to locally stored data or pre-packaged JSON data downloaded via the `/offline-pack/download` endpoint.
4. **User Communication**: The UI should gracefully inform the user that they are in "Offline Mode" but core functionalities like viewing maps and basic attraction data are still accessible.
