/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchWithCache } from './api';
import { initializeMap, renderAttractionMarkers } from './main';
import L from 'leaflet';

describe('Integration Tests', () => {
  beforeEach(() => {
    // Setup a DOM container for the map
    const mapDiv = document.createElement('div');
    mapDiv.id = 'map';
    document.body.appendChild(mapDiv);

    // Mock fetch
    global.fetch = vi.fn();

    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('Frontend ↔ Backend communication', () => {
    it('fetches data from backend and caches it in localStorage', async () => {
      const mockData = [{ id: 1, name: 'Danum Valley' }];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockData })
      });

      const result = await fetchWithCache('/attractions', 'borneo_attractions', []);

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/attractions');
      expect(result).toEqual(mockData);

      // Verify it was cached
      const cached = localStorage.getItem('borneo_attractions');
      expect(JSON.parse(cached)).toEqual(mockData);
    });

    it('falls back to cache if API fails', async () => {
      const mockCachedData = [{ id: 2, name: 'Kinabatangan River' }];
      localStorage.setItem('borneo_attractions', JSON.stringify(mockCachedData));

      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchWithCache('/attractions', 'borneo_attractions', []);

      expect(result).toEqual(mockCachedData);
    });
  });

  describe('Map rendering with data', () => {
    it('initializes map and renders markers with attraction data', () => {
      const mockData = [
        { id: 1, name: 'Danum Valley', coordinates: [4.98, 117.8] },
        { id: 2, name: 'Bako National Park', coordinates: [1.71, 110.46] }
      ];

      const map = initializeMap('map');
      expect(map).toBeInstanceOf(L.Map);

      const markers = renderAttractionMarkers(map, mockData, { open: vi.fn(), close: vi.fn(), element: document.createElement('div') });

      expect(markers.length).toBe(2);
      expect(markers[0].getLatLng().lat).toBe(4.98);
      expect(markers[0].getLatLng().lng).toBe(117.8);

      expect(markers[1].getLatLng().lat).toBe(1.71);
      expect(markers[1].getLatLng().lng).toBe(110.46);
    });
  });
});
