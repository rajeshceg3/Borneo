# Operational Runbooks

This document outlines the operational procedures for the Borneo Rainforest Travel Experience App, covering incident response, recovery, and offline mode fallbacks.

## 1. Incident Response Steps

When an incident occurs (e.g., API downtime, map rendering failure, CI/CD pipeline failure), follow these steps:

1. **Acknowledge and Triage**:
   - Confirm the incident via monitoring alerts (e.g., Grafana, custom alerting).
   - Determine the severity and scope (e.g., critical path failure vs. non-critical feature).
2. **Investigation**:
   - Check backend logs (Winston) for API errors.
   - Verify frontend performance tracking for sudden degradation.
   - Inspect Vercel/Render deployment logs.
3. **Mitigation**:
   - If a recent deployment caused the issue, initiate a rollback using the GitHub Actions rollback workflow (`.github/workflows/rollback.yml`).
   - If the API is down, ensure the frontend gracefully falls back to offline mode/cached data.
4. **Resolution**:
   - Deploy the fix to the `develop` branch for validation.
   - Promote the fix to `main` and deploy to production.
5. **Post-Mortem**:
   - Document the root cause, timeline, and preventive measures.

## 2. Recovery Procedures

### 2.1 Backend API Failure
- The frontend will automatically rely on Service Worker cached data and `localStorage`.
- Ensure the API deployment environment (e.g., AWS/Render) is restarted or scaled up.
- Verify connectivity to the data store.

### 2.2 Map Tile Rendering Failure
- The app should fallback to pre-cached map tiles via the Offline Packager bundle or Service Worker cache.
- Check the CDN (e.g., Cloudflare) for caching issues or origin server connectivity.

### 2.3 Instant Rollback
- To instantly rollback a deployment without rewriting git history, trigger the `Rollback Deployment` GitHub Action.
- Provide the target commit SHA to revert the tree state to that commit.

## 3. Offline Mode Fallback Guide

The application is designed to function seamlessly offline, which is critical for users in the rainforest with no signal.

- **Pre-Caching**: Before losing connectivity, users should download the offline package via the `GET /offline-pack/download` endpoint.
- **Service Worker**: The app utilizes a Service Worker (`sw.js`) to cache static assets, OpenStreetMap tiles, and fallback backend API responses.
- **Data Access**: When offline, the app accesses attraction, wildlife, and trail data from the pre-cached JSON datastore.
- **Map Interaction**: Leaflet will use the locally cached map tiles, ensuring continuous navigation. Gesture navigation and UI cards remain fully functional offline.
