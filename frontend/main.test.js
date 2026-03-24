import { describe, expect, test } from 'vitest';
import { attractions } from './src/data/attractions';

describe('attractions data', () => {
  test('has key seeded locations', () => {
    expect(attractions.length).toBeGreaterThanOrEqual(5);
    expect(attractions.some((item) => item.name === 'Danum Valley')).toBe(true);
  });

  test('contains coordinates for mapping', () => {
    for (const attraction of attractions) {
      expect(Array.isArray(attraction.coordinates)).toBe(true);
      expect(attraction.coordinates).toHaveLength(2);
    }
  });
});
