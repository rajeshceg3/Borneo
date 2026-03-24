import './style.css'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { attractions } from './data/attractions'

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

const map = initializeMap()
renderAttractionMarkers(map)
