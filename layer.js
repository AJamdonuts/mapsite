export function addLayers(map) {

      // LAYERS 

  // Listed buildings fill
  map.addLayer({
    id: 'listed-fill',
    type: 'fill',
    layout: { visibility: 'none' }, // Hidden by default
    source: 'listed-buildings',
    paint: {
      'fill-color': '#1f77b4',
      'fill-opacity': 0.5,
      
    },
  });

  // 3D Buildings
  map.addLayer({
    id: 'buildings-3d',
    type: 'fill-extrusion',
    source: 'building_height',
    paint: {
      'fill-extrusion-color': '#1f77b4',
      'fill-extrusion-opacity': 0.7,
      'fill-extrusion-height': [ // Calculate height based on building levels or height property
        'coalesce',
        ['get', 'height'],
        ['*', ['to-number', ['get', 'building:levels']], 3],
        10,
      ],
      'fill-extrusion-base': 0,
    },
  });

  // Land use fill
  const landUseColors = {
    residential: '#f4a261',
    commercial: '#2a9d8f',
    industrial: '#e76f51',
    forest: '#264653',
    farmland: '#e9c46a',
    grass: '#a8dadc',
    park: '#81b29a',
    quarry: '#6c757d',
  };

  // Fill layer for land use areas
  map.addLayer({
    id: 'landuse-fill',
    type: 'fill',
    layout: { visibility: 'none' },
    source: 'landuse',
    paint: {
      'fill-color': [
        'match',
        ['get', 'landuse'], // Get land use type from feature
        ...Object.entries(landUseColors).flat(),
        '#cccccc', // Default gray if type not listed
      ],
      'fill-opacity': 0.3,
    },
  });

  // Land use outline for boundaries
  map.addLayer({
    id: 'landuse-outline',
    type: 'line',
    layout: { visibility: 'none' },
    source: 'landuse',
    paint: {
      'line-color': [
        'match',
        ['get', 'landuse'],
        ...Object.entries(landUseColors).flat(),
        '#555555'  // fallback color
      ],
      'line-width': 1,
      'line-opacity': 0.8,
    },
  });

  // Points of Interest (POIs) layer
  const poiColors = {
  amenity: '#e41a1c',    // red
  tourism: '#377eb8',    // blue
  shop: '#4daf4a',       // green
  };

  // Create a circle layer for each POI category
  for (const category of ['amenity', 'tourism', 'shop']) {
    map.addLayer({
      id: `pois-${category}`,
      type: 'circle',
      layout: { visibility: 'none' },
      source: 'pois',
      filter: ['all', ['has', category], ['has', 'name']], // Only features with category and name
      paint: {
        'circle-radius': 6,
        'circle-color': poiColors[category],
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff', // White border for visibility
      },
    });
  }

  
  // National Tree Register (NTOW) trees

  map.addLayer({
  id: 'ntow-trees',
  type: 'fill',
  layout: { visibility: 'none' },
  source: 'ntow-trees',
  paint: {
    'fill-color': [
      'match',
      ['get', 'woodland_type'], // Color by tree group type
      'Lone Tree', '#00a884',
      'Group of Trees', '#4ae700',
      'NFI OHC', '#6fa803',
      'Small Woodland', '#0ae6a9',
      /* fallback */ '#cccccc'
    ],
    'fill-opacity': 0.6,
    'fill-outline-color': '#000000'
  }
});

//UK Ward Canopy Cover layer
  map.addLayer({
  id: 'ward-canopy',
  type: 'fill',
  layout: { visibility: 'none' },
  source: 'canopy',
  paint: {
    'fill-color': [
      'interpolate', // Gradient fill based on canopy percentage
      ['linear'],
      ['get', 'percancov'], // Percentage canopy cover
      0, '#f7fcf5',
      10, '#bae4b3',
      20, '#74c476',
      30, '#238b45',
      40, '#00441b'
    ],
    'fill-opacity': 0.4,
    'fill-outline-color': '#000000'
  }
});


  // --- LAYER VISIBILITY TOGGLES ---

  // Toggle layers when checkboxes change

  const toggleIds = [
  { id: 'togglePROW', layer: 'prow-lines' },
  { id: 'toggleRoads', layer: 'road-lines' },
  { id: 'toggleAmenity', layer: 'pois-amenity' },
  { id: 'toggleTourism', layer: 'pois-tourism' },
  { id: 'toggleShop', layer: 'pois-shop' },
  { id: 'toggleNTOW', layer: 'ntow-trees' },
  { id: 'toggleCanopy', layer: 'ward-canopy' },
];

toggleIds.forEach(({ id, layer }) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('change', function (e) {
      const visibility = this.checked ? 'visible' : 'none';
      if (map.getLayer(layer)) map.setLayoutProperty(layer, 'visibility', visibility);
    });
  }
});

  // Add other layers like pois, trees, buildings, etc.
}



