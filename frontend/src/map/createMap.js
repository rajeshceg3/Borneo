import L from 'leaflet';

export const createMap = ({ mapElementId, center, zoom }) => {
  const map = L.map(mapElementId, {
    zoomControl: false,
    scrollWheelZoom: false,
    dragging: true,
    doubleClickZoom: false,
  }).setView(center, zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  return map;
};

export const addAttractionMarkers = ({ map, data, onMarkerClick }) => {
  data.forEach((attraction) => {
    const marker = L.circleMarker(attraction.coordinates, {
      radius: 8,
      color: '#3AA76D',
      fillColor: '#0F3D2E',
      fillOpacity: 0.95,
      weight: 2,
    }).addTo(map);

    marker.on('click', () => onMarkerClick(attraction));
    marker.bindTooltip(attraction.name, {
      direction: 'top',
      opacity: 0.9,
      className: 'attraction-tooltip',
    });
  });
};
