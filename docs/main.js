console.log("main.js is loaded");


const map = new maplibregl.Map({
  container: 'map',
  style: 'https://api.maptiler.com/maps/streets/style.json?key=sLTnVyFpuI1axO89l1hV',
  center: [1.0830, 51.2797],
  zoom: 13,
  preserveDrawingBuffer: true // important for exporting
});

map.addControl(new maplibregl.NavigationControl(), 'bottom-left');
map.scrollZoom.enable();

let availableLayers = [];

map.on('load', () => {
  addSources(map);
  addLayers(map);
  setupPopups(map);
  setupSidebar(map);
  setupToggles(map);
  setupCharts(map);
  fetchOverpassData(map);

  setupSearch(map, ['schools-layer', 'monuments-layer']);

  // Dynamically get all layer IDs after layers are added
  availableLayers = window.customLayerIds;
});

