const DEFAULT_THRESHOLD = 50;
const MAX_VERTICAL_DRIFT = 40;

export const detectSwipeDirection = (
  start,
  end,
  threshold = DEFAULT_THRESHOLD,
  maxVerticalDrift = MAX_VERTICAL_DRIFT
) => {
  if (!start || !end) {
    return null;
  }

  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;

  if (Math.abs(deltaX) < threshold && deltaY > threshold) {
    return 'swipeDown';
  }

  if (Math.abs(deltaY) > maxVerticalDrift && Math.abs(deltaX) < Math.abs(deltaY)) {
    return null;
  }

  if (Math.abs(deltaX) < threshold) {
    return null;
  }

  return deltaX < 0 ? 'swipeLeft' : 'swipeRight';
};

export const bindGestureNavigation = (element, handlers = {}) => {
  if (!element || typeof element.addEventListener !== 'function') {
    return () => {};
  }

  let touchStart = null;

  const onTouchStart = (event) => {
    const firstTouch = event.touches?.[0];
    if (!firstTouch) {
      return;
    }

    touchStart = { x: firstTouch.clientX, y: firstTouch.clientY };
  };

  const onTouchEnd = (event) => {
    const lastTouch = event.changedTouches?.[0];
    if (!touchStart || !lastTouch) {
      touchStart = null;
      return;
    }

    const touchEnd = { x: lastTouch.clientX, y: lastTouch.clientY };
    const direction = detectSwipeDirection(touchStart, touchEnd);

    if (direction && typeof handlers[direction] === 'function') {
      handlers[direction]();
    }

    touchStart = null;
  };

  element.addEventListener('touchstart', onTouchStart, { passive: true });
  element.addEventListener('touchend', onTouchEnd, { passive: true });

  return () => {
    element.removeEventListener('touchstart', onTouchStart);
    element.removeEventListener('touchend', onTouchEnd);
  };
};
