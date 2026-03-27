import './style.css'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { gsap } from 'gsap'
import { attractions } from './data/attractions'
import { bindGestureNavigation } from './gestureEngine'
import { fetchAttractions, fetchWildlife } from './api'

export const createAttractionIcon = () => L.divIcon({
  className: 'attraction-marker-icon',
  html: '<span class="pulse-dot" aria-hidden="true"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9]
})

export const createWildlifeIcon = () => L.divIcon({
  className: 'wildlife-marker-icon',
  html: '<span class="wildlife-dot" aria-hidden="true"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
})

export const applyNightMode = () => {
  if (typeof document === 'undefined' || !document.body || !document.body.classList) return

  const currentHour = new Date().getHours()
  const isNight = currentHour >= 19 || currentHour < 6

  if (isNight) {
    document.body.classList.add('night-mode')

    // Add firefly ambient animations
    for (let i = 0; i < 30; i++) {
      const firefly = document.createElement('div')
      firefly.className = 'firefly'
      firefly.style.left = `${Math.random() * 100}vw`
      firefly.style.top = `${Math.random() * 100}vh`
      firefly.style.animationDelay = `${Math.random() * 5}s`
      document.body.appendChild(firefly)
    }
  } else {
    document.body.classList.remove('night-mode')
    if (document.querySelectorAll) {
      document.querySelectorAll('.firefly').forEach((el) => el.remove())
    }
  }
}

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

  applyNightMode()

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

const getWildlifeCardTemplate = (animal) => {
  const factsMarkup = animal.facts?.length
    ? `<ul class="wildlife-card__facts">${animal.facts.map(fact => `<li>${fact}</li>`).join('')}</ul>`
    : ''

  return `
    <article class="attraction-card__content wildlife-card__content" aria-live="polite">
      <header class="attraction-card__header">
        <p class="attraction-card__type">${animal.species}</p>
        <h2 class="attraction-card__title">${animal.name}</h2>
      </header>
      <p class="wildlife-card__detail"><strong>Habitat:</strong> ${animal.habitat}</p>
      <p class="wildlife-card__detail"><strong>Best Time:</strong> ${animal.best_time}</p>
      ${factsMarkup}
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

  const open = (data, type = 'attraction') => {
    container.innerHTML = type === 'wildlife' ? getWildlifeCardTemplate(data) : getCardTemplate(data)
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
      cardController.open(location, 'attraction')
    })

    return marker
  })
}

export const renderWildlifeMarkers = (
  map,
  wildlifeData = [],
  cardController = createAttractionCardController()
) => {
  const icon = createWildlifeIcon()

  // For demo, distribute them relative to a center point or around attractions
  // In a real scenario, wildlife coordinates should be in the backend data
  // Since we don't have them in the backend data (only habitat etc), we will generate dummy ones
  const baseLat = 4.5
  const baseLng = 114

  return wildlifeData.map((animal, i) => {
    // Generate dummy coordinates for testing if not present
    const coordinates = animal.coordinates || [baseLat + (Math.random() * 2 - 1), baseLng + (Math.random() * 2 - 1)]

    const marker = L.marker(coordinates, {
      icon,
      title: animal.name,
      riseOnHover: true
    }).addTo(map)

    marker.on('click', () => {
      marker.bindPopup(`<strong>${animal.name}</strong>`).openPopup()
      cardController.open(animal, 'wildlife')
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
    const [fetchedAttractions, fetchedWildlife] = await Promise.all([
      fetchAttractions(),
      fetchWildlife()
    ])

    const markers = renderAttractionMarkers(map, fetchedAttractions, cardController)
    bindMapGestures(map, markers, fetchedAttractions, cardController)

    let wildlifeMarkers = []
    let wildlifeVisible = false
    const wildlifeToggleBtn = document.getElementById('wildlife-toggle')

    if (wildlifeToggleBtn) {
      wildlifeToggleBtn.addEventListener('click', () => {
        wildlifeVisible = !wildlifeVisible
        wildlifeToggleBtn.setAttribute('aria-pressed', wildlifeVisible.toString())
        wildlifeToggleBtn.classList.toggle('active', wildlifeVisible)

        if (wildlifeVisible) {
          wildlifeMarkers = renderWildlifeMarkers(map, fetchedWildlife, cardController)
        } else {
          wildlifeMarkers.forEach(marker => map.removeLayer(marker))
          wildlifeMarkers = []
        }
      })
    }
  }
}

init()
