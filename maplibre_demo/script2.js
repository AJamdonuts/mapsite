// Constants & Configurations
const LAYER_IDS = {
  LISTED_BUILDINGS: 'listed-buildings',
  BUILDINGS_3D: 'buildings-3d',
  OSM_TREES: 'osm-trees',
  TREE_CLUSTERS: 'tree-clusters',
  LANDUSE: 'landuse',
  POIS: 'pois',
  PROW: 'prow',
  ROADS: 'roads',
};

const LANDUSE_COLORS = {
  residential: '#f4a261',
  commercial: '#2a9d8f',
  industrial: '#e76f51',
  forest: '#264653',
  farmland: '#e9c46a',
  grass: '#a8dadc',
  park: '#81b29a',
  quarry: '#6c757d',
};

const POI_COLORS = {
  amenity: '#e41a1c',
  tourism: '#377eb8',
  shop: '#4daf4a',
};

const MAP_STYLE_URL = 'https://api.maptiler.com/maps/streets/style.json?key=sLTnVyFpuI1axO89l1hV';
const CENTER_COORDS = [1.0830, 51.2797];
const ZOOM_LEVEL = 13;

// Utility debounce
function debounce(func, wait = 100) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Adding map sources
function addSources(map) {
  map.addSource(LAYER_IDS.LISTED_BUILDINGS, {
    type: 'geojson',
    data: 'datasets/NH_Listed_Building_polygons.geojson',
  });

  map.addSource(LAYER_IDS.OSM_TREES, {
    type: 'geojson',
    data: 'datasets/osm_trees.geojson',
  });

  map.addSource('building_height', {
    type: 'geojson',
    data: 'datasets/building_height.geojson',
  });

  map.addSource(LAYER_IDS.TREE_CLUSTERS, {
    type: 'geojson',
    data: 'datasets/osm_trees.geojson',
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  map.addSource(LAYER_IDS.LANDUSE, {
    type: 'geojson',
    data: 'datasets/landuse_osm.geojson',
  });

  map.addSource(LAYER_IDS.POIS, {
    type: 'geojson',
    data: 'datasets/pois_osm.geojson',
  });
}

// Adding map layers
function addLayers(map) {
  // Listed buildings fill layer
  map.addLayer({
    id: 'listed-fill',
    type: 'fill',
    source: LAYER_IDS.LISTED_BUILDINGS,
    paint: {
      'fill-color': '#1f77b4',
      'fill-opacity': 0.5,
    },
  });

  // 3D buildings layer with extrusion
  map.addLayer({
    id: LAYER_IDS.BUILDINGS_3D,
    type: 'fill-extrusion',
    source: 'building_height',
    paint: {
      'fill-extrusion-color': '#1f77b4',
      'fill-extrusion-opacity': 0.7,
      'fill-extrusion-height': [
        'coalesce',
        ['get', 'height'],
        ['*', ['to-number', ['get', 'building:levels']], 3],
        10,
      ],
      'fill-extrusion-base': 0,
    },
  });

  // Landuse fill and outline layers
  map.addLayer({
    id: 'landuse-fill',
    type: 'fill',
    source: LAYER_IDS.LANDUSE,
    paint: {
      'fill-color': [
        'match',
        ['get', 'landuse'],
        'residential', LANDUSE_COLORS.residential,
        'commercial', LANDUSE_COLORS.commercial,
        'industrial', LANDUSE_COLORS.industrial,
        'forest', LANDUSE_COLORS.forest,
        'farmland', LANDUSE_COLORS.farmland,
        'grass', LANDUSE_COLORS.grass,
        'park', LANDUSE_COLORS.park,
        'quarry', LANDUSE_COLORS.quarry,
        '#000000',
      ],
      'fill-opacity': 0.5,
    },
  });

  map.addLayer({
    id: 'landuse-outline',
    type: 'line',
    source: LAYER_IDS.LANDUSE,
    paint: {
      'line-color': '#666',
      'line-width': 1,
      'line-opacity': 0.8,
    },
  });

  // POI layers for each category with circle style
  for (const category of Object.keys(POI_COLORS)) {
    map.addLayer({
      id: `pois-${category}`,
      type: 'circle',
      source: LAYER_IDS.POIS,
      filter: ['has', category],
      paint: {
        'circle-radius': 6,
        'circle-color': POI_COLORS[category],
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff',
      },
    });
  }

  // OSM Trees Layer
  map.addLayer({
    id: LAYER_IDS.OSM_TREES,
    type: 'circle',
    source: LAYER_IDS.OSM_TREES,
    paint: {
      'circle-radius': 4,
      'circle-color': '#228B22',
      'circle-opacity': 0.7,
    },
  });

  // Tree clusters layer (circle + cluster count)
  map.addLayer({
    id: LAYER_IDS.TREE_CLUSTERS,
    type: 'circle',
    source: LAYER_IDS.TREE_CLUSTERS,
    filter: ['has', 'point_count'],
    paint: {
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        15,
        100,
        20,
        750,
        25,
      ],
      'circle-color': '#006400',
      'circle-opacity': 0.6,
    },
  });

  map.addLayer({
    id: `${LAYER_IDS.TREE_CLUSTERS}-count`,
    type: 'symbol',
    source: LAYER_IDS.TREE_CLUSTERS,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['Arial Unicode MS Bold'],
      'text-size': 12,
    },
    paint: {
      'text-color': '#fff',
    },
  });
}

// Setup popups for various layers
function setupPopups(map) {
  // Landuse popup
  const landUsePopup = new maplibregl.Popup({ closeButton: true, closeOnClick: true });

  map.on('click', 'landuse-fill', (e) => {
    const props = e.features[0].properties;
    landUsePopup
      .setLngLat(e.lngLat)
      .setHTML(`<strong>Land Use:</strong> ${props.landuse || 'Unknown'}<br>${props.description || ''}`)
      .addTo(map);
  });

  map.on('mouseenter', 'landuse-fill', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'landuse-fill', () => {
    map.getCanvas().style.cursor = '';
    landUsePopup.remove();
  });

  // POI popups for all poi layers
  for (const category of Object.keys(POI_COLORS)) {
    const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: true });

    map.on('click', `pois-${category}`, (e) => {
      const props = e.features[0].properties;
      popup
        .setLngLat(e.lngLat)
        .setHTML(`<strong>${category.charAt(0).toUpperCase() + category.slice(1)}:</strong> ${props.name || 'Unknown'}`)
        .addTo(map);
    });

    map.on('mouseenter', `pois-${category}`, () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', `pois-${category}`, () => {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });
  }

  // Listed buildings popup example
  const listedPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: true });

  map.on('click', 'listed-fill', (e) => {
    const props = e.features[0].properties;
    listedPopup
      .setLngLat(e.lngLat)
      .setHTML(`<strong>Listed Building:</strong> ${props.name || 'Unnamed'}`)
      .addTo(map);
  });

  map.on('mouseenter', 'listed-fill', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'listed-fill', () => {
    map.getCanvas().style.cursor = '';
    listedPopup.remove();
  });
}

// Setup toggle controls to show/hide layers
function setupToggleHandlers(map) {
  // Helper to toggle multiple layers visibility
  function toggleLayers(layers, visible) {
    layers.forEach(id => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
      }
    });
  }

  // Debounced event handler to improve performance
  const debouncedToggle = debounce((layerGroup, checked) => {
    toggleLayers(layerGroup, checked);
  }, 150);

  // Example toggles - adapt IDs to your actual HTML checkboxes
  document.getElementById('toggleLanduse').addEventListener('change', (e) => {
    debouncedToggle(['landuse-fill', 'landuse-outline'], e.target.checked);
  });

  document.getElementById('toggleListed').addEventListener('change', (e) => {
    debouncedToggle(['listed-fill'], e.target.checked);
  });

  document.getElementById('toggle3DBuildings').addEventListener('change', (e) => {
    debouncedToggle([LAYER_IDS.BUILDINGS_3D], e.target.checked);
  });

  document.getElementById('togglePOI').addEventListener('change', (e) => {
    const visible = e.target.checked;
    for (const category of Object.keys(POI_COLORS)) {
      debouncedToggle([`pois-${category}`], visible);
    }
  });

  document.getElementById('toggleTrees').addEventListener('change', (e) => {
    debouncedToggle([LAYER_IDS.OSM_TREES, LAYER_IDS.TREE_CLUSTERS, `${LAYER_IDS.TREE_CLUSTERS}-count`], e.target.checked);
  });
}

// Fetch and add Overpass data dynamically for PROW and roads
async function fetchAndAddOverpassData(map) {
  async function fetchOverpass(query) {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    if (!response.ok) throw new Error(`Overpass fetch error: ${response.statusText}`);
    return response.json();
  }

  function osmToGeoJSON(osmData) {
    // Minimal conversion example - adapt or replace with a library if you want
    const features = [];

    if (!osmData.elements) return { type: 'FeatureCollection', features: [] };

    const nodes = new Map();
    osmData.elements.forEach(el => {
      if (el.type === 'node') nodes.set(el.id, el);
    });

    osmData.elements.forEach(el => {
      if (el.type === 'way' && el.nodes) {
        const coords = el.nodes.map(nodeId => {
          const node = nodes.get(nodeId);
          return node ? [node.lon, node.lat] : null;
        }).filter(c => c !== null);

        if (coords.length) {
          features.push({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
            properties: el.tags || {},
          });
        }
      }
    });

    return { type: 'FeatureCollection', features };
  }

  // PROW query for Canterbury
  const prowQuery = `
    [out:json][timeout:25];
    area["name"="Canterbury"]["boundary"="administrative"]["admin_level"="8"]->.searchArea;
    way["highway"~"footway|path|bridleway"](area.searchArea);
    (._;>;);
    out body;
  `;

  try {
    const prowData = await fetchOverpass(prowQuery);
    const prowGeoJSON = osmToGeoJSON(prowData);

    map.addSource(LAYER_IDS.PROW, { type: 'geojson', data: prowGeoJSON });

    map.addLayer({
      id: 'prow-lines',
      type: 'line',
      source: LAYER_IDS.PROW,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': [
          'match',
          ['get', 'highway'],
          'footway', '#FF6600',
          'path', '#FF9933',
          'cycleway', '#0066FF',
          'bridleway', '#33CC33',
          '#999999',
        ],
        'line-width': 2,
        'line-opacity': 0.8,
      },
    });
  } catch (err) {
    console.error('Failed to fetch PROW data:', err);
  }

  // Roads query for Canterbury
  const roadsQuery = `
    [out:json][timeout:25];
    area["name"="Canterbury"]["boundary"="administrative"]["admin_level"="8"]->.searchArea;
    way["highway"~"primary|secondary|tertiary"](area.searchArea);
    (._;>;);
    out body;
  `;

  try {
    const roadsData = await fetchOverpass(roadsQuery);
    const roadsGeoJSON = osmToGeoJSON(roadsData);

    map.addSource(LAYER_IDS.ROADS, { type: 'geojson', data: roadsGeoJSON });

    map.addLayer({
      id: 'roads-lines',
      type: 'line',
      source: LAYER_IDS.ROADS,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': [
          'match',
          ['get', 'highway'],
          'primary', '#cc0000',
          'secondary', '#ff9933',
          'tertiary', '#ffcc66',
          '#666666',
        ],
        'line-width': 2,
        'line-opacity': 0.8,
      },
    });
  } catch (err) {
    console.error('Failed to fetch roads data:', err);
  }
}

// Main initialization
async function initMap() {
  const map = new maplibregl.Map({
    container: 'map',
    style: MAP_STYLE_URL,
    center: CENTER_COORDS,
    zoom: ZOOM_LEVEL,
  });

  map.on('load', async () => {
    addSources(map);
    addLayers(map);
    setupPopups(map);
    setupToggleHandlers(map);
    await fetchAndAddOverpassData(map);
  });

  // UI toggle button example outside map load
  document.querySelector('.toggle-button').addEventListener('click', () => {
    document.querySelector('.layer-controls').classList.toggle('collapsed');
  });
}

initMap();
