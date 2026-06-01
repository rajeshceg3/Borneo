# Operational Runbooks

This document outlines the standard operational procedures for maintaining, recovering, and troubleshooting the Borneo Rainforest Travel Experience App.

## Incident response steps

1. **Acknowledge:** The on-call engineer must acknowledge the alert within 15 minutes.
2. **Assess:** Determine the severity and impact of the incident (e.g., API downtime, map tile loading failures).
3. **Communicate:** Update the status page and inform stakeholders if the incident affects user experience.
4. **Investigate:** Check monitoring dashboards (Grafana), application logs (Winston), and Vercel/Render metrics to identify the root cause.
5. **Resolve:** Apply the necessary fix or initiate a rollback (see Recovery procedures).
6. **Post-Mortem:** Conduct a post-incident review to prevent recurrence.

## Recovery procedures

1. **API Failures:** If the backend service goes down, check the Render/AWS deployment logs. Restart the service if necessary. If a recent deployment caused the failure, use the CI/CD rollback workflow to revert to the previous stable state.
2. **Frontend Deployment Issues:** If a Vercel deployment introduces a critical bug, use the Vercel dashboard to instantly rollback to a previous deployment.
3. **CI/CD Rollback Workflow:**
   - Navigate to GitHub Actions.
   - Select the `Rollback Deployment` workflow.
   - Provide the target commit SHA to rollback to.
   - Execute the workflow to revert the tree state and push a new rollback commit.
4. **Data Corruption:** In case of data corruption in the JSON datastore, restore from the last known good backup.

## Offline mode fallback guide

The application is designed to function seamlessly offline, particularly in remote rainforest areas with poor connectivity.

1. **Service Worker Fallback:** If the user is completely offline, the Service Worker (`sw.js`) intercepts network requests and serves cached static assets, map tiles, and JSON data.
2. **Offline Package Downloader:** Users should be encouraged to download the offline package before their trip. The `GET /offline-pack/download` endpoint provides a compressed bundle of all necessary resources.
3. **Troubleshooting Offline Mode:**
   - If map tiles fail to load offline, ensure the offline package was downloaded and extracted correctly, or that the Service Worker has successfully cached the `openstreetmap` tiles.
   - If wildlife/attraction data is missing, verify the frontend is correctly configured to fall back to `localStorage` or the Service Worker cache when API requests fail.
   - Clear the browser cache and unregister/reregister the Service Worker if persistent caching issues occur.
