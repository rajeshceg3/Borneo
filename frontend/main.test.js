import { beforeEach, describe, expect, it, vi } from 'vitest'

const markerOn = vi.fn()
const markerBindPopup = vi.fn(() => ({ openPopup: vi.fn() }))
const markerAddTo = vi.fn(() => ({ on: markerOn, bindPopup: markerBindPopup }))

const markerFactory = vi.fn(() => ({ addTo: markerAddTo }))
const tileLayerAddTo = vi.fn()
const tileLayerFactory = vi.fn(() => ({ addTo: tileLayerAddTo }))
const mapFactory = vi.fn(() => ({
  id: 'map-instance',
  setView: vi.fn(),
  getZoom: vi.fn(() => 6),
  closePopup: vi.fn()
}))
const divIconFactory = vi.fn(() => ({ id: 'icon-instance' }))

vi.mock('leaflet', () => ({
  default: {
    map: mapFactory,
    marker: markerFactory,
    tileLayer: tileLayerFactory,
    divIcon: divIconFactory
  }
}))

describe('Frontend map and marker setup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes map with calm interaction settings', async () => {
    const { initializeMap } = await import('./src/main.js')

    initializeMap('map')

    expect(mapFactory).toHaveBeenCalledWith(
      'map',
      expect.objectContaining({
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: true,
        doubleClickZoom: false
      })
    )
  })

  it('renders dynamic markers and attaches click listeners', async () => {
    const { renderAttractionMarkers } = await import('./src/main.js')

    const map = mapFactory()
    const locations = [
      { name: 'Danum Valley', coordinates: [4.9, 117.8] },
      { name: 'Kinabatangan River', coordinates: [5.5, 118.3] }
    ]

    const markers = renderAttractionMarkers(map, locations)

    expect(divIconFactory).toHaveBeenCalledTimes(1)
    expect(markerFactory).toHaveBeenCalledTimes(2)
    expect(markerOn).toHaveBeenCalledWith('click', expect.any(Function))
    expect(markers.length).toBe(2)
  })

  it('binds swipe gestures to marker navigation and map close', async () => {
    const { bindMapGestures } = await import('./src/main.js')

    const map = mapFactory()
    const markerOne = { bindPopup: vi.fn(() => ({ openPopup: vi.fn() })) }
    const markerTwo = { bindPopup: vi.fn(() => ({ openPopup: vi.fn() })) }

    const listeners = {}
    const element = {
      addEventListener: vi.fn((name, handler) => {
        listeners[name] = handler
      }),
      removeEventListener: vi.fn()
    }

    bindMapGestures(
      map,
      [markerOne, markerTwo],
      [
        { name: 'Danum Valley', coordinates: [4.9, 117.8] },
        { name: 'Kinabatangan River', coordinates: [5.5, 118.3] }
      ],
      element
    )

    listeners.touchstart({ touches: [{ clientX: 100, clientY: 100 }] })
    listeners.touchend({ changedTouches: [{ clientX: 20, clientY: 110 }] })

    expect(map.setView).toHaveBeenCalledWith([5.5, 118.3], 6, { animate: true })
    expect(markerTwo.bindPopup).toHaveBeenCalled()

    listeners.touchstart({ touches: [{ clientX: 80, clientY: 80 }] })
    listeners.touchend({ changedTouches: [{ clientX: 82, clientY: 170 }] })

    expect(map.closePopup).toHaveBeenCalledTimes(1)
  })
})
