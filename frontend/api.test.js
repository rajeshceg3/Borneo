import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchAttractions, fetchWithCache } from './src/api';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
});

// Mock fetch
global.fetch = vi.fn();

describe('Frontend API interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('fetches data from API and saves to cache', async () => {
    const mockData = { data: [{ id: 1, name: 'Test Attraction' }] };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const result = await fetchWithCache('/test', 'test_key', []);

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/test');
    expect(result).toEqual(mockData.data);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test_key', JSON.stringify(mockData.data));
  });

  it('falls back to cache when API fails', async () => {
    const cachedData = [{ id: 2, name: 'Cached Attraction' }];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(cachedData));

    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchWithCache('/test', 'test_key', []);

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/test');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test_key');
    expect(result).toEqual(cachedData);
  });

  it('falls back to static fallback data when API fails and cache is empty', async () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const fallbackData = [{ id: 3, name: 'Static Attraction' }];
    const result = await fetchWithCache('/test', 'test_key', fallbackData);

    expect(result).toEqual(fallbackData);
  });

  it('fetchAttractions calls fetchWithCache with correct arguments', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [{ id: 1, name: 'Danum' }] })
    });

    await fetchAttractions();

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/attractions');
  });
});
