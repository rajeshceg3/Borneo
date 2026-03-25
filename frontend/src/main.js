import './style.css'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { gsap } from 'gsap'
import { attractions } from './data/attractions'
import { bindGestureNavigation } from './gestureEngine'
import { fetchAttractions } from './api'

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

const getCardTemplate = (location) => {
  const imageMarkup = location.images?.length
    ? `<img class="attraction-card__image" src="${location.images[0]}" alt="${location.name}" loading="lazy" decoding="async">`
    : ''

  return `
    <article class="attraction-card__content" aria-live="polite">
      <header class="attraction-card__header">
        <p class="attraction-card__type">${location.type}</p>
        <h2 class="attraction-card__title">${location.name}</h2>
      </header>
      ${imageMarkup}
      <p class="attraction-card__description">${location.description ?? ''}</p>
    </article>
  `
}

export const createAttractionCardController = (root = document.body, animationLibrary = gsap) => {
  const container = root.querySelector('#attraction-card') ?? document.createElement('section')

  if (!container.id) {
    container.id = 'attraction-card'
    container.className = 'attraction-card'
    container.setAttribute('aria-hidden', 'true')
    root.appendChild(container)
  }

  const open = (location) => {
    container.innerHTML = getCardTemplate(location)
    container.classList.add('is-open')
    container.setAttribute('aria-hidden', 'false')

    animationLibrary.fromTo(
      container,
      { opacity: 0, yPercent: 100 },
      { opacity: 1, yPercent: 0, duration: 0.3, ease: 'power2.out' }
    )
  }

  const close = () => {
    if (!container.classList.contains('is-open')) {
      return
    }

    animationLibrary.to(container, {
      opacity: 0,
      yPercent: 100,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        container.classList.remove('is-open')
        container.setAttribute('aria-hidden', 'true')
        container.innerHTML = ''
      }
    })
  }

  return { open, close, element: container }
}

export const renderAttractionMarkers = (
  map,
  locationData = attractions,
  cardController = createAttractionCardController()
) => {
  const icon = createAttractionIcon()

  return locationData.map((location) => {
    const marker = L.marker(location.coordinates, {
      icon,
      title: location.name,
      riseOnHover: true
    }).addTo(map)

    marker.on('click', () => {
      marker.bindPopup(`<strong>${location.name}</strong>`).openPopup()
      cardController.open(location)
    })

    return marker
  })
}

export const bindMapGestures = (
  map,
  markers,
  locationData = attractions,
  cardController,
  element = document.body
) => {
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
    cardController?.open(location)
    activeIndex = normalizedIndex
  }

  return bindGestureNavigation(element, {
    swipeLeft: () => focusMarker(activeIndex + 1),
    swipeRight: () => focusMarker(activeIndex - 1),
    swipeDown: () => {
      map.closePopup()
      cardController?.close()
    }
  })
}

const mapElement = typeof document !== 'undefined' ? document.getElementById('map') : null

const init = async () => {
  if (mapElement) {
    const map = initializeMap()
    const cardController = createAttractionCardController()

    // Fetch data from API with fallback
    const fetchedAttractions = await fetchAttractions()

    const markers = renderAttractionMarkers(map, fetchedAttractions, cardController)
    bindMapGestures(map, markers, fetchedAttractions, cardController)
  }
}

init()
