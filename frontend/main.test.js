import { beforeEach, describe, expect, it, vi } from 'vitest';

const markerOn = vi.fn();
const markerBindPopup = vi.fn(() => ({ openPopup: vi.fn() }));
const markerAddTo = vi.fn(() => ({ on: markerOn, bindPopup: markerBindPopup }));

const markerFactory = vi.fn(() => ({ addTo: markerAddTo }));
const tileLayerAddTo = vi.fn();
const tileLayerFactory = vi.fn(() => ({ addTo: tileLayerAddTo }));
const mapFactory = vi.fn(() => ({
  id: 'map-instance',
  setView: vi.fn(),
  getZoom: vi.fn(() => 6),
  closePopup: vi.fn()
}));
const divIconFactory = vi.fn(() => ({ id: 'icon-instance' }));

vi.mock('leaflet', () => ({
  default: {
    map: mapFactory,
    marker: markerFactory,
    tileLayer: tileLayerFactory,
    divIcon: divIconFactory
  }
}));

const gsapFromTo = vi.fn();
const gsapTo = vi.fn((_, options) => options?.onComplete?.());

vi.mock('gsap', () => ({
  gsap: {
    fromTo: gsapFromTo,
    to: gsapTo
  }
}));

const createMockElement = () => ({
  id: '',
  className: '',
  innerHTML: '',
  style: {},
  attributes: {},
  classList: {
    classes: new Set(),
    add(value) {
      this.classes.add(value);
    },
    remove(value) {
      this.classes.delete(value);
    },
    contains(value) {
      return this.classes.has(value);
    }
  },
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
});

describe('Frontend map and marker setup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.document = {
      createElement: vi.fn(() => createMockElement()),
      getElementById: vi.fn(() => null),
      body: {}
    };
  });

  it('applies night mode based on system time', async () => {
    const { applyNightMode } = await import('./src/main.js');

    const originalDate = global.Date;
    const mockDate = class extends Date {
      constructor() {
        super();
      }
      getHours() {
        return 21; // 9 PM
      }
    };
    global.Date = mockDate;

    const appended = [];
    global.document.body = createMockElement();
    global.document.body.appendChild = vi.fn((el) => appended.push(el));
    global.document.querySelectorAll = vi.fn(() => []);

    applyNightMode();

    expect(global.document.body.classList.contains('night-mode')).toBe(true);
    expect(appended.length).toBe(30);
    expect(appended[0].className).toBe('firefly');

    // Test Day Mode
    const mockDayDate = class extends Date {
      constructor() {
        super();
      }
      getHours() {
        return 12; // 12 PM
      }
    };
    global.Date = mockDayDate;

    applyNightMode();
    expect(global.document.body.classList.contains('night-mode')).toBe(false);

    global.Date = originalDate;
  });

  it('initializes map with calm interaction settings', async () => {
    const { initializeMap } = await import('./src/main.js');

    initializeMap('map');

    expect(mapFactory).toHaveBeenCalledWith(
      'map',
      expect.objectContaining({
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: true,
        doubleClickZoom: false
      })
    );
  });

  it('renders dynamic markers and attaches click listeners', async () => {
    const { renderAttractionMarkers } = await import('./src/main.js');

    const map = mapFactory();
    const locations = [
      { name: 'Danum Valley', coordinates: [4.9, 117.8] },
      { name: 'Kinabatangan River', coordinates: [5.5, 118.3] }
    ];
    const cardController = { open: vi.fn() };

    const markers = renderAttractionMarkers(map, locations, cardController);

    expect(divIconFactory).toHaveBeenCalledTimes(1);
    expect(markerFactory).toHaveBeenCalledTimes(2);
    expect(markerOn).toHaveBeenCalledWith('click', expect.any(Function));
    expect(markers.length).toBe(2);
  });

  it('renders wildlife markers and opens wildlife cards', async () => {
    const { renderWildlifeMarkers } = await import('./src/main.js');

    const map = mapFactory();
    const animals = [
      { name: 'Bornean Orangutan', species: 'Pongo pygmaeus', habitat: 'Lowland', best_time: 'Morning', facts: ['Fact 1'] }
    ];
    const cardController = { open: vi.fn() };

    const markers = renderWildlifeMarkers(map, animals, cardController);

    expect(markerFactory).toHaveBeenCalledTimes(1);
    expect(markers.length).toBe(1);

    // Simulate click
    const clickHandler = markerOn.mock.calls.find(call => call[0] === 'click')[1];
    clickHandler();

    expect(cardController.open).toHaveBeenCalledWith(animals[0], 'wildlife');
  });

  it('builds fullscreen cards with lazy-loaded images', async () => {
    const { createAttractionCardController } = await import('./src/main.js');

    const appended = [];
    const root = {
      querySelector: vi.fn(() => null),
      appendChild: vi.fn((element) => appended.push(element))
    };

    const controller = createAttractionCardController(root);
    controller.open({
      name: 'Danum Valley',
      type: 'forest',
      description: 'Ancient canopy.',
      images: ['https://example.com/danum.jpg']
    });

    expect(appended[0].classList.contains('is-open')).toBe(true);
    expect(appended[0].innerHTML).toContain('loading="lazy"');
    expect(gsapFromTo).toHaveBeenCalledTimes(1);
  });

  it('binds swipe gestures to marker navigation and card close', async () => {
    const { bindMapGestures } = await import('./src/main.js');

    const map = mapFactory();
    const markerOne = { bindPopup: vi.fn(() => ({ openPopup: vi.fn() })) };
    const markerTwo = { bindPopup: vi.fn(() => ({ openPopup: vi.fn() })) };

    const listeners = {};
    const element = {
      addEventListener: vi.fn((name, handler) => {
        listeners[name] = handler;
      }),
      removeEventListener: vi.fn()
    };

    const cardController = { open: vi.fn(), close: vi.fn() };

    bindMapGestures(
      map,
      [markerOne, markerTwo],
      [
        { name: 'Danum Valley', coordinates: [4.9, 117.8] },
        { name: 'Kinabatangan River', coordinates: [5.5, 118.3] }
      ],
      cardController,
      element
    );

    listeners.touchstart({ touches: [{ clientX: 100, clientY: 100 }] });
    listeners.touchend({ changedTouches: [{ clientX: 20, clientY: 110 }] });

    expect(map.setView).toHaveBeenCalledWith([5.5, 118.3], 6, { animate: true });
    expect(markerTwo.bindPopup).toHaveBeenCalled();
    expect(cardController.open).toHaveBeenCalled();

    listeners.touchstart({ touches: [{ clientX: 80, clientY: 80 }] });
    listeners.touchend({ changedTouches: [{ clientX: 82, clientY: 170 }] });

    expect(map.closePopup).toHaveBeenCalledTimes(1);
    expect(cardController.close).toHaveBeenCalledTimes(1);
  });
});
