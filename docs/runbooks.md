# Operational Runbooks

This document outlines standard operating procedures for maintaining the Borneo Rainforest Travel Experience App.

## 1. Incident Response Steps

When an incident (e.g., API downtime, deployment failure) occurs:

1. **Acknowledge and Assess:**
   - Review recent logs in the backend (via Winston logging output or your hosting provider's dashboard).
   - Check performance and uptime metrics in Grafana (once configured).
   - Identify the scope of the impact: Is it affecting all users or specific features? Is it frontend or backend related?

2. **Mitigate:**
   - **Frontend:** If the frontend build fails, trigger an instant rollback to the last successful commit in Vercel/Netlify.
   - **Backend:** If the backend API fails, restart the service in AWS/Render. If the failure persists due to a bad release, rollback the backend deployment to the previous stable version.
   - **Offline mode:** Ensure the frontend is still serving cached content if the backend goes down.

3. **Resolve:**
   - Debug the root cause of the issue (e.g., failed API endpoint, missing data).
   - Implement and test a fix locally.
   - Push the fix through the CI/CD pipeline to staging, validate it, and promote it to production.

4. **Review:**
   - Document the incident, root cause, and the resolution process.
   - Update this runbook if needed.

## 2. Recovery Procedures

### 2.1 Backend Database/Data Recovery
Currently, data is served from static JSON files. If data becomes corrupted:
1. Revert to the last known good state of the JSON data files in source control.
2. Redeploy the backend service to serve the corrected data.

### 2.2 System Rollback Strategy
- Use GitHub Actions CI/CD to maintain previous builds.
- If a production deployment introduces critical bugs, use your hosting platform's built-in "rollback" feature to immediately point traffic back to the previous deployment.

## 3. Offline Mode Fallback Guide

The application is designed to function smoothly even when the user loses network connectivity.

### How it works:
- **Service Worker (`sw.js`):** Intercepts network requests and serves cached assets (HTML, CSS, JS, images, map tiles) when offline.
- **Offline Packager:** Users can proactively download an offline bundle (`/offline-pack/download`) before heading into the rainforest.
- **Fallback Data:** If an API request fails and no cache exists, the app falls back to bundled static JSON data.

### Troubleshooting Offline Mode:
1. **Assets not loading offline:** Verify that the Service Worker is correctly installed and activated via browser dev tools. Ensure the required assets were added to the cache during the installation phase.
2. **Missing map tiles:** Map tiles are dynamically cached. Ensure the user interacted with the map while online to cache tiles, or that they downloaded the offline package containing tiles.
3. **Data not refreshing:** Ensure the Service Worker caching strategy handles updates correctly (e.g., stale-while-revalidate for data endpoints if applicable, or explicit cache invalidation).