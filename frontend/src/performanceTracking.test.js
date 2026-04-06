/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trackPerformance, measureAppLoad, measureMapRender } from './performanceTracking.js';

describe('Performance Tracking', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
  });

  it('trackPerformance logs the performance metric to console', () => {
    trackPerformance('Test_Metric', 123);
    expect(console.log).toHaveBeenCalledWith('[Performance Track] Test_Metric: 123ms');
  });

  it('measureAppLoad triggers on window load', () => {
    vi.stubGlobal('performance', { now: () => 456 });

    measureAppLoad();

    // Dispatch the load event
    window.dispatchEvent(new Event('load'));

    // Fast-forward the setTimeout
    vi.runAllTimers();

    expect(console.log).toHaveBeenCalledWith('[Performance Track] App_Load_Time: 456ms');
    vi.unstubAllGlobals();
  });

  it('measureMapRender tracks when the map is ready', () => {
    let readyCallback = null;
    const mockMap = {
      whenReady: (cb) => {
        readyCallback = cb;
      }
    };

    let currentTime = 1000;
    vi.stubGlobal('performance', {
      now: () => {
        const timeToReturn = currentTime;
        currentTime += 50; // Map render takes 50ms
        return timeToReturn;
      }
    });

    measureMapRender(mockMap);

    // Simulate map being ready
    readyCallback();

    expect(console.log).toHaveBeenCalledWith('[Performance Track] Map_Render_Time: 50ms');
    vi.unstubAllGlobals();
  });
});
