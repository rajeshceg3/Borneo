import { attractions as fallbackAttractions } from './data/attractions';

const API_BASE_URL = 'http://localhost:3000'; // Assume backend runs on 3000 in dev

export const fetchWithCache = async (endpoint, cacheKey, fallbackData) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const json = await response.json();
    const data = json.data;

    // Save to cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }

    return data;
  } catch (error) {
    console.warn(`Failed to fetch ${endpoint}, falling back to cache or static data`, error);

    // Try cache
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Failed to read from localStorage', e);
    }

    // Fall back to static data
    return fallbackData;
  }
};

export const fetchAttractions = () => fetchWithCache('/attractions', 'borneo_attractions', fallbackAttractions);

export const fetchWildlife = () => fetchWithCache('/wildlife', 'borneo_wildlife', []);

export const fetchTrails = () => fetchWithCache('/trails', 'borneo_trails', []);
