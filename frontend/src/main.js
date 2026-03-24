import './style.css'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Initialize the map
const map = L.map('map', {
  center: [4.5, 114],
  zoom: 6,
  zoomControl: false,
  scrollWheelZoom: false,
  dragging: true,
  doubleClickZoom: false
})

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
