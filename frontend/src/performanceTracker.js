export const measurePerformance = (label, startTime) => {
  if (typeof performance === 'undefined') return;
  const duration = performance.now() - startTime;
  console.log(`[Performance Track] ${label}: ${duration.toFixed(2)} ms`);
  return duration;
};
