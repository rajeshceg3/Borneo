# Operational Runbooks

This document provides operational guidelines for maintaining, troubleshooting, and recovering the Borneo Rainforest Travel Experience App.

## 1. Incident Response Steps

If an incident occurs (e.g., API downtime, frontend deployment failure, database unavailability), follow these steps to manage the response effectively:

1. **Acknowledge & Triage:**
   - Acknowledge the alert.
   - Determine the severity (P1 - Critical, P2 - High, P3 - Medium, P4 - Low).
   - Identify the affected component (Frontend, Backend, CI/CD, Network).

2. **Investigate & Diagnose:**
   - Check application logs (backend Winston logs).
   - Verify server health and resource usage.
   - Review recent deployments and commits.

3. **Mitigate & Recover:**
   - If a recent deployment caused the issue, initiate a rollback (see Section 2).
   - If it's a backend failure, consider restarting the service.
   - If it's an external API failure, rely on fallback/cached data.

4. **Communicate:**
   - Update stakeholders on the status.
   - If user-facing, update the status page or provide a temporary message.

5. **Post-Incident Review (PIR):**
   - Document the timeline of events.
   - Identify the root cause.
   - Create action items to prevent recurrence.

## 2. Recovery Procedures

### Rollback a Deployment
If a production deployment is faulty, trigger the CI/CD Rollback Workflow:
- Navigate to the GitHub Actions tab.
- Select the `Rollback Pipeline` workflow.
- Click `Run workflow`.
- Provide the target commit SHA to rollback to.
- The pipeline will revert the code tree to the target commit and push a new commit to restore the previous state.

### Restart Backend Service
If the backend becomes unresponsive:
- Access the hosting environment (AWS/Render).
- Restart the Node.js application process.
- Verify logs to ensure the server starts correctly (`npm start`).

### Restore Cached Assets
If the CDN or asset hosting fails:
- Purge the Cloudflare cache if necessary.
- Ensure the frontend build process successfully generates static assets.
- Verify Vercel deployment correctly serves the `/assets` directory.

## 3. Offline Mode Fallback Guide

The app is designed to function offline for eco-tourists in remote locations.

### Pre-Caching
- The frontend Service Worker (`sw.js`) automatically caches critical assets (HTML, CSS, JS) and Leaflet map tiles during the initial online session.
- Users can download an offline package via the backend `/offline-pack` endpoint, which includes complete JSON data, images, and map tiles compressed as a zip file.

### Dealing with Failed Offline Access
- **Missing Map Tiles:** If map tiles do not load offline, advise the user to ensure they have opened the app while connected to the internet at least once, or they have manually downloaded the offline package.
- **Outdated Data:** The service worker serves cached backend API responses (`/attractions`, `/wildlife`, `/trails`) when offline. If data is stale, the user must reconnect to the network to refresh the cache.
- **Application Logic:** Ensure the frontend handles fetch failures by gracefully falling back to `localStorage` or service worker cached responses.

### Troubleshooting Service Worker Issues
- If the offline mode is entirely broken, it may be due to a faulty service worker update.
- Instruct users to manually clear site data/cache in their browser settings and reload the app while online to install a fresh service worker.
