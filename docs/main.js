

console.log("main.js is loaded");


const map = new maplibregl.Map({
  container: 'map',
  style: 'https://api.maptiler.com/maps/streets/style.json?key=sLTnVyFpuI1axO89l1hV',
  center: [1.0830, 51.2797],
  zoom: 13
});

map.on('load', () => {
  addSources(map);
  addLayers(map);
  setupPopups(map);
  setupSidebar(map);
  setupToggles(map);
  setupCharts(map);
  fetchOverpassData(map);
});

