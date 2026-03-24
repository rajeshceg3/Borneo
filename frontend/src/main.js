import './style.css'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { attractions } from './data/attractions'
import { bindGestureNavigation } from './gestureEngine'

export const createAttractionIcon = () => L.divIcon({
  className: 'attraction-marker-icon',
  html: '<span class="pulse-dot" aria-hidden="true"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9]
})

export const initializeMap = (containerId = 'map') => {
  const map = L.map(containerId, {
    center: [4.5, 114],
    zoom: 6,
    zoomControl: false,
    scrollWheelZoom: false,
    dragging: true,
    doubleClickZoom: false
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

  return map
}

export const renderAttractionMarkers = (map, locationData = attractions) => {
  const icon = createAttractionIcon()

  return locationData.map((location) => {
    const marker = L.marker(location.coordinates, {
      icon,
      title: location.name,
      riseOnHover: true
    }).addTo(map)

    marker.on('click', () => {
      marker.bindPopup(`<strong>${location.name}</strong>`).openPopup()
    })

    return marker
  })
}

export const bindMapGestures = (map, markers, locationData = attractions, element = document.body) => {
  if (!markers.length || !locationData.length) {
    return () => {}
  }

  let activeIndex = 0

  const focusMarker = (index) => {
    const normalizedIndex = (index + markers.length) % markers.length
    const location = locationData[normalizedIndex]
    const marker = markers[normalizedIndex]

    map.setView(location.coordinates, map.getZoom(), { animate: true })
    marker.bindPopup(`<strong>${location.name}</strong>`).openPopup()
    activeIndex = normalizedIndex
  }

  return bindGestureNavigation(element, {
    swipeLeft: () => focusMarker(activeIndex + 1),
    swipeRight: () => focusMarker(activeIndex - 1),
    swipeDown: () => map.closePopup()
  })
}

const mapElement = typeof document !== 'undefined' ? document.getElementById('map') : null

if (mapElement) {
  const map = initializeMap()
  const markers = renderAttractionMarkers(map)
  bindMapGestures(map, markers)
}
