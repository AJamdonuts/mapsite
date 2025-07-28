import { initMap } from './map-init.js';
import { addSources } from './sources.js';
import { addLayers } from './layers.js';
import { setupInteractions } from './interactions.js';
import { setupSidebar } from './sidebar.js';
import { loadOverpassData } from './overpass.js';

const map = initMap();

map.on('load', async () => {
  addSources(map);
  addLayers(map);
  setupInteractions(map);
  setupSidebar(map);
  
  await loadOverpassData(map);
});
