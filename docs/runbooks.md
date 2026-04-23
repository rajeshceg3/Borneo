# Operational Runbooks

## Overview
This runbook outlines the operational procedures for the Borneo Rainforest Travel Experience App. It covers incident response, recovery procedures, and handling of offline mode scenarios.

## 1. Incident Response Steps

### 1.1 Alerts and Detection
*   **Performance Degradation:** Monitored via Performance API tracking on the frontend and Winston logging on the backend.
*   **API Failures:** Alerted when backend endpoints return 5xx errors or response times exceed 2000ms.
*   **Downtime:** Uptime checks on both the frontend Vercel deployment and the backend Render service.

### 1.2 Initial Assessment
1.  **Verify Impact:** Check Grafana dashboards/logs to determine if the issue is isolated (frontend, backend, database) or systemic.
2.  **Communicate:** Notify stakeholders and update the status page.
3.  **Identify the Root Cause:** Use logging and tracing (Winston logs) to pinpoint the failing component.

### 1.3 Mitigation Strategies
*   **Backend Failure:** If the API goes down, ensure the frontend gracefully falls back to the Service Worker cache.
*   **Map Tile Outage:** Ensure offline tiles are pre-cached and verify the offline map initialization.
*   **High Latency:** Review tile loading and dependency bundling. Consider scaling backend resources.

## 2. Recovery Procedures

### 2.1 Backend Recovery
1.  **Restart Service:** If the Render service crashes, initiate a restart via the Render dashboard or CLI.
2.  **Rollback Deployment:** If a recent deployment caused the incident, use the CI/CD pipeline to rollback to the previous stable release.
3.  **Data Consistency:** Since data is primarily JSON-based (for initial phase), ensure the latest JSON files are intact in the `backend/data` directory.

### 2.2 Frontend Recovery
1.  **Clear Cache:** If a bad build is cached, trigger a cache invalidation on the CDN/Vercel.
2.  **Rebuild:** Trigger a manual rebuild via GitHub Actions (`CI/CD Pipeline`).
3.  **Service Worker Reset:** If the Service Worker is misbehaving, advise users to clear their browser cache, or deploy an updated `sw.js` that bypasses the broken cache.

## 3. Offline Mode Fallback Guide

The application is designed to handle "zero signal" environments natively.

### 3.1 Pre-Trip Preparation
*   Advise users to launch the app while connected to a stable network to cache assets.
*   Alternatively, provide a direct link to download the offline package (`GET /offline-pack/download`).

### 3.2 Service Worker Caching Strategy
*   **Static Assets:** HTML, CSS, JS, and custom icons are cached on install.
*   **API Data:** Responses from `/attractions`, `/wildlife`, and `/trails` are cached on the first successful request.
*   **Map Tiles:** Map tiles (e.g., OpenStreetMap) are cached as they are loaded. The Service Worker intercepts tile requests and serves them from the cache if the network is unavailable.

### 3.3 Troubleshooting Offline Issues
1.  **"Map Not Loading Offline"**: Ensure the user has panned/zoomed through the required areas while online to trigger the tile cache. Verify the Service Worker is active (`navigator.serviceWorker.ready`).
2.  **"Missing Wildlife Data"**: Confirm that the API requests were successfully made and cached before going offline.
3.  **Fallback to Local Data:** If the Service Worker cache is empty, the application falls back to `localStorage` or hardcoded static data within the frontend logic.
