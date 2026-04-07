import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { measurePerformance } from './performanceTracker';

describe('Performance Tracker', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('measures performance correctly when window.performance is available', () => {
    // Mock performance.now to return a specific value
    const originalPerformance = global.performance;
    global.performance = {
      now: vi.fn(() => 1500)
    };

    const startTime = 1000;
    const duration = measurePerformance('Test Task', startTime);

    expect(duration).toBe(500);
    expect(console.log).toHaveBeenCalledWith('[Performance Track] Test Task: 500.00 ms');

    // Restore
    global.performance = originalPerformance;
  });

  it('returns undefined when window.performance is unavailable', () => {
    const originalPerformance = global.performance;
    global.performance = undefined;

    const duration = measurePerformance('Test Task', 1000);

    expect(duration).toBeUndefined();
    expect(console.log).not.toHaveBeenCalled();

    // Restore
    global.performance = originalPerformance;
  });
});
