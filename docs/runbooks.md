# Operational Runbooks

This document outlines the operational procedures for managing the Borneo Rainforest Travel App.

## 1. Incident Response Steps

When an incident occurs (e.g., API downtime, performance degradation, or deployment failure), follow these steps to restore service:

### Step 1.1: Acknowledge and Assess
- Acknowledge the alert (via email, Slack, or monitoring dashboard).
- Determine the scope and severity of the incident.
- Check the Vercel dashboard for frontend deployment status.
- Check the backend hosting dashboard (e.g., AWS, Render) for backend service health.

### Step 1.2: Investigate the Root Cause
- Check logs:
  - Backend logs are available via Winston logger outputs. Check `error.log` and `combined.log` (or your centralized log aggregator).
  - Check the Vercel logs for frontend issues.
- Check metrics:
  - Review Grafana dashboards for performance anomalies (e.g., slow response times, spike in error rates).
- Check network:
  - Use `curl` or Postman to manually test API endpoints (`/attractions`, `/wildlife`, `/trails`, `/offline-pack`).

### Step 1.3: Mitigate
- If a recent deployment caused the issue, trigger a rollback (see Section 2: Recovery Procedures).
- If the backend is unreachable but data is static, rely on the frontend's Service Worker and local cache fallback (users should still be able to access the app offline or use cached data).
- Restart affected services if a transient error is suspected.

### Step 1.4: Resolve and Verify
- Once the fix is implemented, verify that all systems are operational.
- Test both the frontend UI and the backend APIs.
- Run E2E tests to ensure critical paths work.

### Step 1.5: Post-Mortem
- Document what happened, why it happened, and what steps were taken to fix it.
- Identify action items to prevent a recurrence.

---

## 2. Recovery Procedures

### 2.1 Rollback Deployment (GitHub Actions)
If a bad code change reaches the main branch, a rollback workflow is available.

1. Go to the "Actions" tab in the GitHub repository.
2. Select the **Rollback Workflow**.
3. Click "Run workflow".
4. Enter the **commit hash** of the last known good state.
5. The workflow will use `git read-tree` to revert the repository state to that commit and push a new revert commit. This preserves git history while fixing the codebase.

### 2.2 Re-deploying Backend/Frontend
If the infrastructure state is inconsistent, you may need to manually trigger a re-deploy.
- **Frontend:** Trigger a redeploy from the Vercel dashboard.
- **Backend:** Restart the service or trigger a redeploy from the hosting provider.

### 2.3 Clearing Cache
If users are receiving stale or corrupted data:
- Instruct users to clear their browser cache, or
- Push a small update to `frontend/public/sw.js` (e.g., changing the cache version name) to force all clients to fetch fresh assets.

---

## 3. Offline Mode Fallback Guide

The Borneo app is designed to work in environments with poor or zero connectivity. The offline mode relies on a Service Worker and an Offline Packager.

### 3.1 How it Works
- The frontend Service Worker (`sw.js`) intercepts network requests.
- It caches static assets, OpenStreetMap tiles, and backend API responses in the browser's Cache Storage.
- When the network is unavailable, the Service Worker serves the cached data.

### 3.2 Troubleshooting Offline Mode
- **Map Tiles Not Loading Offline:** Ensure the user has visited the map areas while online so tiles are cached, or that they have successfully downloaded the offline package via the backend `/offline-pack/download` endpoint.
- **Service Worker Not Installing:** Check the browser console for Service Worker registration errors. Ensure the app is served over HTTPS (or `localhost` for development), as Service Workers require a secure context.
- **Stale Data Showing:** If the app is stuck showing old data, the Service Worker cache might need an update. Update the `CACHE_NAME` in `sw.js` and deploy to invalidate the old cache for all users.

### 3.3 Verifying the Offline Packager
- The backend serves a pre-bundled `.zip` containing JSON data, images, and map tiles at `/offline-pack/download`.
- To verify it's working:
  ```bash
  curl -O http://<API_URL>/offline-pack/download
  unzip download
  ```
  Ensure all necessary assets (JSON files, image folders) are present and uncorrupted in the extracted archive.