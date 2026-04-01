import { test, expect } from '@playwright/test';

test.describe('Borneo Rainforest Travel App E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('Open app → load map', async ({ page }) => {
    // Check if the Leaflet map container is visible
    const mapContainer = page.locator('#map');
    await expect(mapContainer).toBeVisible();

    // Check if map is initialized by looking for leaflet-pane
    const leafletPane = page.locator('.leaflet-pane').first();
    // Leaflet panes may not be visible in DOM strictly speaking, so just check it exists
    await expect(leafletPane).toBeAttached();

    // Check if markers are rendered (there should be at least one attraction marker)
    const markers = page.locator('.attraction-marker-icon');
    await expect(markers.first()).toBeVisible();
  });

  test('Tap marker → open card', async ({ page }) => {
    // Ensure map is loaded
    await page.waitForSelector('.leaflet-marker-pane .attraction-marker-icon');

    // Click on the first marker
    const firstMarker = page.locator('.attraction-marker-icon').first();
    await firstMarker.click();

    // The attraction card should open
    const card = page.locator('#attraction-card');
    await expect(card).toBeVisible();
    await expect(card).toHaveClass(/is-open/);

    // Verify card content is populated
    const title = card.locator('.attraction-card__title');
    await expect(title).not.toBeEmpty();
  });

  test('Swipe navigation', async ({ page }) => {
    // Ensure map and markers are loaded
    await page.waitForSelector('.leaflet-marker-pane .attraction-marker-icon');

    // Make sure we have enough markers to swipe between
    const markerCount = await page.locator('.attraction-marker-icon').count();
    expect(markerCount).toBeGreaterThan(1);

    // We can simulate touch swipes by dispatching pointer events
    // Let's create a helper function for swiping
    const swipe = async (direction) => {
      const body = page.locator('body');
      const box = await body.boundingBox();
      const startX = box.width / 2;
      const startY = box.height / 2;

      let endX = startX;
      let endY = startY;

      if (direction === 'left') {
        endX = startX - 200;
      } else if (direction === 'right') {
        endX = startX + 200;
      } else if (direction === 'down') {
        endY = startY + 200;
      }

      // The gesture engine binds to touchstart/touchend, not mouse events.
      // So we need to dispatch TouchEvents.
      await page.evaluate(({ startX, startY, endX, endY }) => {
        const createTouchEvent = (type, x, y) => {
          return new TouchEvent(type, {
            touches: [new Touch({ identifier: Date.now(), target: document.body, clientX: x, clientY: y })],
            changedTouches: [new Touch({ identifier: Date.now(), target: document.body, clientX: x, clientY: y })],
            bubbles: true,
            cancelable: true
          });
        };

        document.body.dispatchEvent(createTouchEvent('touchstart', startX, startY));
        document.body.dispatchEvent(createTouchEvent('touchend', endX, endY));
      }, { startX, startY, endX, endY });
    };

    // Initially, nothing is open
    const card = page.locator('#attraction-card');
    await expect(card).not.toHaveClass(/is-open/);

    // Swipe left to navigate to the first/next marker
    await swipe('left');

    // The card should now open
    await expect(card).toHaveClass(/is-open/);
    const initialTitle = await card.locator('.attraction-card__title').innerText();

    // Swipe left again to navigate to the next marker
    await swipe('left');
    await page.waitForTimeout(500); // give animation time
    const newTitle = await card.locator('.attraction-card__title').innerText();

    // Title should be different (assuming data has different names)
    expect(newTitle).not.toBe(initialTitle);

    // Swipe right to go back
    await swipe('right');
    await page.waitForTimeout(500);
    const backTitle = await card.locator('.attraction-card__title').innerText();
    expect(backTitle).toBe(initialTitle);

    // Swipe down to close
    await swipe('down');
    await expect(card).not.toHaveClass(/is-open/);
  });
});
