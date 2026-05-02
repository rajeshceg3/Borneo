# Borneo App Operational Runbooks

This document provides operational guidelines, incident response steps, recovery procedures, and an offline mode fallback guide for the Borneo App.

## 1. Incident Response Steps

When an incident occurs (e.g., app downtime, API failure, high error rates):

1. **Acknowledge and Assess**:
   - Identify the scope and impact of the issue.
   - Check monitoring dashboards (e.g., Grafana, Vercel analytics) for error rates and response times.

2. **Communicate**:
   - Notify the development team and stakeholders.
   - Update external status pages if user-facing features are heavily impacted.

3. **Investigate**:
   - Check recent deployments and commits (`.github/workflows/ci.yml`).
   - Review backend logs (via Winston) for unhandled exceptions or API timeouts.
   - Identify if the issue is isolated to the frontend (e.g., UI bug, Service Worker failure) or backend (e.g., offline-pack generation failure).

4. **Mitigate**:
   - If a recent deployment caused the issue, trigger the Rollback workflow (`.github/workflows/rollback.yml`).
   - If the backend API is down, ensure the frontend gracefully degrades to Offline Mode.
   - Apply hotfixes if a rollback is not feasible.

5. **Resolve and Monitor**:
   - Deploy the fix to the `develop` branch for staging validation, then promote to `main`.
   - Monitor the system to ensure stability.

6. **Post-Mortem**:
   - Document the root cause, timeline, and lessons learned.
   - Create action items to prevent recurrence.

## 2. Recovery Procedures

### 2.1 Backend API Failure
- The frontend is designed to automatically fall back to cached data (via Service Worker and `localStorage`).
- **Action**: Investigate backend server logs. Restart the PM2 process if the node process crashed.

### 2.2 Offline Pack Generation Failure
- If `GET /offline-pack/download` fails, users won't be able to download updates for true offline usage.
- **Action**: Check server disk space and memory usage. The `archiver` package requires sufficient resources to bundle map tiles and JSON data.

### 2.3 Frontend Deployment Failure
- **Action**: Review Vercel build logs. Ensure the `npm run build --prefix frontend` command succeeded.
- Re-run the CI/CD pipeline.

## 3. Offline Mode Fallback Guide

The Borneo app is designed for users who may have zero cell signal while deep in the rainforest.

### How it works:
- **Service Worker (`sw.js`)**: Caches static assets, OpenStreetMap tiles, and previously fetched API responses (`/attractions`, `/wildlife`, `/trails`).
- **Offline Pack**: Users can proactively download a `.zip` bundle via the `/offline-pack/download` endpoint before they lose signal.

### Fallback Behavior:
- When the app detects it is offline (or when API requests fail), it automatically retrieves data from the Service Worker cache or `localStorage`.
- The UI will continue to function seamlessly, allowing users to view the map, attraction cards, and wildlife information.
- **Limitation**: Real-time features (if added in the future) will be disabled, but core navigation and content reading will remain fully operational.

### Testing Offline Mode:
1. Open the app in a browser (e.g., Chrome).
2. Open DevTools -> Network tab.
3. Check "Offline" to simulate no internet connection.
4. Refresh the page. The app should load and function using cached assets.
