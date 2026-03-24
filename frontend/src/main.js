import 'leaflet/dist/leaflet.css';
import './style.css';
import { attractions } from './data/attractions';
import { createMap, addAttractionMarkers } from './map/createMap';
import { navigationStore } from './store/navigationStore';

document.querySelector('#app').innerHTML = `
  <main class="app-shell">
    <header class="app-header">
      <h1>Borneo Rainforest Explorer</h1>
      <p>Tap markers to explore key locations with no-scroll navigation.</p>
    </header>

    <section class="map-frame">
      <div id="map" aria-label="Map showing key Borneo attractions"></div>
    </section>

    <section class="attraction-card" aria-live="polite">
      <h2 id="attraction-title"></h2>
      <p id="attraction-description"></p>
    </section>
  </main>
`;

const cardTitle = document.querySelector('#attraction-title');
const cardDescription = document.querySelector('#attraction-description');

const renderCard = (attraction) => {
  cardTitle.textContent = attraction.name;
  cardDescription.textContent = attraction.description;
};

const map = createMap({
  mapElementId: 'map',
  center: [4.8, 115.6],
  zoom: 7,
});

addAttractionMarkers({
  map,
  data: attractions,
  onMarkerClick: (attraction) => {
    navigationStore.getState().setSelectedAttraction(attraction.id);
    renderCard(attraction);
  },
});

renderCard(attractions[0]);
