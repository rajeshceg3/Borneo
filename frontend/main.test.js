import { describe, it, expect, vi } from 'vitest'

const markerOn = vi.fn()
const markerBindPopup = vi.fn(() => ({ openPopup: vi.fn() }))
const markerAddTo = vi.fn(() => ({ on: markerOn, bindPopup: markerBindPopup }))

const markerFactory = vi.fn(() => ({ addTo: markerAddTo }))
const tileLayerAddTo = vi.fn()
const tileLayerFactory = vi.fn(() => ({ addTo: tileLayerAddTo }))
const mapFactory = vi.fn(() => ({ id: 'map-instance' }))
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
    vi.clearAllMocks()

    const map = { id: 'map-instance' }
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
})
