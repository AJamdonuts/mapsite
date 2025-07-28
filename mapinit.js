
// Initialize the MapLibre GL JS map

export function initMap() {
const map = new maplibregl.Map({
  container: 'map', // HTML element ID where the map will be rendered
  style: 'https://api.maptiler.com/maps/streets/style.json?key=sLTnVyFpuI1axO89l1hV',
  center: [1.0830, 51.2797], // Initial map center in [longitude, latitude]
  zoom: 13, // Initial zoom level
});

  return map;
}
