/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Frontend Initialization', () => {
  beforeEach(() => {
    vi.resetModules()
    document.body.innerHTML = `
      <div id="map"></div>
    `
  })

  it('should initialize leaflet map on the map container', async () => {
    // Import the main.js file
    await import('./src/main.js')

    const mapContainer = document.getElementById('map')
    expect(mapContainer).not.toBeNull()

    // Check if leaflet adds its class to the container
    expect(mapContainer.classList.contains('leaflet-container')).toBe(true)
  })
})
