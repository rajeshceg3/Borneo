export const trackPerformance = (metricName, value) => {
  // Use a minimal interaction tracking format for mock telemetry
  if (typeof window !== 'undefined' && typeof window.console !== 'undefined') {
    console.log(`[Performance Track] ${metricName}: ${value}ms`);
  }
};

export const measureAppLoad = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    window.addEventListener('load', () => {
      // Delay slightly to ensure rendering is complete
      setTimeout(() => {
        const loadTime = window.performance.now();
        trackPerformance('App_Load_Time', Math.round(loadTime));
      }, 0);
    });
  }
};

export const measureMapRender = (mapInstance) => {
  if (!mapInstance) return;
  const start = performance.now();
  mapInstance.whenReady(() => {
    const end = performance.now();
    trackPerformance('Map_Render_Time', Math.round(end - start));
  });
};
