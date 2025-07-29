/**
 * MapLibre GL JS interactive map for Canterbury.
 * 
 * Features:
 * - Loads multiple GeoJSON sources: listed buildings, building heights, land use, POIs, NTOW trees, canopy cover.
 * - Adds styled layers for each dataset, including 3D buildings, land use, POIs, trees, canopy, PROW, and roads.
 * - Interactive popups for map features (buildings, land use, trees, PROW, roads).
 * - Sidebar displays details for selected features and summary stats (e.g., canopy cover).
 * - Layer visibility toggles via checkboxes and grouped controls.
 * - Dynamic land use chart (pie chart) updates with map view.
 * - Fetches PROW and road data from Overpass API and displays as styled lines.
 * - Accessibility: keyboard navigation for control groups.
 * - Uses Turf.js for area calculations and Chart.js for chart rendering.
 * Listed Buildings from National Historic England NH_Listed_Building_polygons.geojson
 * Building Heights from OSM data datasets/building_height.geojson
 * Land Use from OSM data landuse_osm.geojson
 * Points of Interest (POIs)from OSM data datasets/pois_osm.geojson
 * National Tree Register (NTOW) Trees from the National Tree Register datasets/ntow_trees.json
 * UK Ward Canopy Cover datasets/UK_Ward_Canopy_Cover.geojson
 * Public Rights of Way (PROW) Fetched dynamically from Overpass API (OpenStreetMap) using a custom query.
 * Roads Fetched dynamically from Overpass API (OpenStreetMap) using a custom query.
 */

// Initialize the MapLibre GL JS map
const map = new maplibregl.Map({
  container: 'map', // HTML element ID where the map will be rendered
  style: 'https://api.maptiler.com/maps/streets/style.json?key=sLTnVyFpuI1axO89l1hV',
  center: [1.0830, 51.2797], // Initial map center in [longitude, latitude]
  zoom: 13 // Initial zoom level
}); // <-- Add this line to close the Map constructor

// Wait for the map to finish loading before adding sources and layers
map.on('load', () => {

  // SOURCES 

  // Add GeoJSON source for listed buildings 
  map.addSource('listed-buildings', {
    type: 'geojson',
    data: 'datasets/NH_Listed_Building_points.geojson',
  });

  // Add GeoJSON source for building heights
  map.addSource('building_height', {
    type: 'geojson',
    data: 'datasets/building_height.geojson',
  });

  // Add GeoJSON source for land use
  map.addSource('landuse', {
    type: 'geojson',
    data: 'datasets/landuse_osm.geojson',
  });

  // Add GeoJSON source for Points of Interest (POIs)
  map.addSource('pois', {
  type: 'geojson',
  data: 'datasets/pois_osm.geojson',
  });

  // Add GeoJSON source for National Tree Register (NTOW) trees
  map.addSource('ntow-trees', {
  type: 'geojson',
  data: 'datasets/ntow_trees.json',
});

  // Add GeoJSON source for UK Ward Canopy Cover
  map.addSource('canopy', {
    type: 'geojson',
    data: 'datasets/UK_Ward_Canopy_Cover.geojson'
  });



  // LAYERS 

  map.addLayer({
    id: 'listed-point',
    type: 'circle',
    source: 'listed-buildings',
    layout: {
      visibility: 'visible'
    },
    paint: {
      'circle-radius': 5,
      'circle-color': '#CC5500',        // Orange fill
      'circle-stroke-color': '#5C2E00', // Brown outline
      'circle-stroke-width': 2,
      'circle-opacity': 0.7
    }
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


  // --- POPUPS & INTERACTION ---

  // Land use popup
  const landUsePopup = new maplibregl.Popup({
    closeButton: true,
    closeOnClick: true,
  });
 
  // Show popup on land use area click
  map.on('click', 'landuse-fill', (e) => {
    const props = e.features[0].properties;
    const landuseType = props.landuse || 'Unknown';
    const description = props.description || 'No description available';

    landUsePopup
      .setLngLat(e.lngLat)
      .setHTML(`<strong>Land Use:</strong> ${landuseType}<br>${description}`)
      .addTo(map);
  });

  // Change cursor on land use area hover
  map.on('mouseenter', 'landuse-fill', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Remove popup and reset cursor on mouse leave
  map.on('mouseleave', 'landuse-fill', () => {
    map.getCanvas().style.cursor = '';
    landUsePopup.remove();
  });

  // Buildings popup

  const buildingPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });

  map.on('mousemove', 'buildings-3d', (e) => {
    map.getCanvas().style.cursor = 'pointer';
    const feature = e.features[0];
    const props = feature.properties;
    const name = props.Name || 'Unnamed Building';

    // Calculate height if available, otherwise estimate
    let height = 'Unknown';
    if (props.height) height = `${props.height} m`;
    else if (props['building:levels']) {
      const levels = parseInt(props['building:levels'], 10);
      height = `${levels * 3} m (approx from ${levels} levels)`;
    }

    buildingPopup
      .setLngLat(e.lngLat)
      .setHTML(`<strong>${name}</strong><br>Height: ${height}`)
      .addTo(map);
  });

  map.on('mouseleave', 'buildings-3d', () => {
    map.getCanvas().style.cursor = '';
    buildingPopup.remove();
  });

  // Listed buildings popup
const listedPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });

map.on('click', 'listed-point', (e) => {
  const props = e.features[0].properties;
  const listDate = props.ListDate ? new Date(props.ListDate).toLocaleDateString() : '';
  const amendDate = props.AmendDate ? new Date(props.AmendDate).toLocaleDateString() : '';

  const template = document.getElementById('listed-popup-template');
  const clone = template.content.cloneNode(true);

  const name = props.Name || props.name || 'Listed Building';

  clone.querySelector('.popup-title').textContent = name;
  clone.querySelector('.entry-number').textContent = props.ListEntry || '';
  clone.querySelector('.grade').textContent = props.grade || props.Grade || 'Unknown Grade';
  clone.querySelector('.list-date').textContent = listDate;
  clone.querySelector('.amend-date').textContent = amendDate;
  clone.querySelector('.capture-scale').textContent = props.CaptureScale || '';
  clone.querySelector('.hyperlink').innerHTML = `<a href="${props.hyperlink || '#'}" target="_blank">Open</a>`;

  const container = document.createElement('div');
  container.appendChild(clone);

  listedPopup.setLngLat(e.lngLat).setDOMContent(container).addTo(map);
  const popupEl = listedPopup.getElement();
  popupEl.classList.remove('popup-panel');
  popupEl.style.display = '';

// Add a close button to the popup (on map)
if (!popupEl.querySelector('#popup-close-btn')) {
  const closeBtn = document.createElement('button');
  closeBtn.id = 'popup-close-btn';
  closeBtn.textContent = 'X';
  closeBtn.classList.add('popup-close-btn');
  closeBtn.onclick = () => {
    listedPopup.remove();
    map.setFilter('listed-highlight', ['==', 'id', '']);
  };
  // Insert at the top of the popup
  popupEl.querySelector('.popup-title')?.parentNode.insertBefore(closeBtn, popupEl.querySelector('.popup-title'));
}

  map.setFilter('listed-highlight', ['==', 'id', e.features[0].id]);

  setTimeout(() => {
    const btn = popupEl.querySelector('#move-popup-btn');
    const toggleBtn = popupEl.querySelector('#toggle-table-btn');
    const tableEl = popupEl.querySelector('#popup-table');

    if (toggleBtn && tableEl) {
      toggleBtn.onclick = () => {
        tableEl.classList.toggle('hidden');
        toggleBtn.textContent = tableEl.classList.contains('hidden') ? '▼' : '▲';
      };
    }

    if (btn) {
      btn.onclick = () => {
        listedPopup.remove(); // Remove from map

        const sidebar = document.getElementById('sidebar-content');
        if (sidebar) {
          sidebar.innerHTML = '';

          const sidebarContent = container.cloneNode(true);

          // Remove the dropdown button and always show the table
          const toggleBtn = sidebarContent.querySelector('#toggle-table-btn');
          if (toggleBtn) toggleBtn.remove();

          const tableEl = sidebarContent.querySelector('#popup-table');
          if (tableEl) tableEl.classList.remove('hidden');

          // Change the move button to "Move popup to map"
          const moveBtn = sidebarContent.querySelector('#move-popup-btn');
          if (moveBtn) {
            moveBtn.textContent = 'Move popup to map';
            moveBtn.onclick = () => {
              sidebar.innerHTML = '';
              listedPopup.setDOMContent(container).addTo(map);
            };
          }

          // Remove any existing close button first to avoid duplicates
          const oldCloseBtn = sidebarContent.querySelector('#popup-close-btn');
          if (oldCloseBtn) oldCloseBtn.remove();

          // Add a close button INSIDE the header of the info panel
          const closeBtn = document.createElement('button');
          closeBtn.id = 'popup-close-btn';
          closeBtn.textContent = 'X';
          closeBtn.classList.add('popup-close-btn');
          closeBtn.onclick = () => {
            sidebar.innerHTML = '<p>Select a feature on the map to view details.</p>';
            map.setFilter('listed-highlight', ['==', 'id', '']);
          };
          const header = sidebarContent.querySelector('.popup-header');
          if (header) {
            header.appendChild(closeBtn);
          }

          sidebar.appendChild(sidebarContent);
        }
      };
    }
  }, 50);

});

  



// Remove highlight when clicking elsewhere
map.on('click', (e) => {
  const features = map.queryRenderedFeatures(e.point, { layers: ['listed-point'] });
  if (!features.length) {
    map.setFilter('listed-highlight', ['==', 'id', '']);
    listedPopup.remove(); // also close popup on outside click
  }
});

map.on('mouseenter', 'listed-point', () => {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'listed-point', () => {
  map.getCanvas().style.cursor = '';
});


// LAND USE TOGGLE (checkbox)
  document.getElementById('toggleLanduse').addEventListener('change', (e) => {
  const visibility = e.target.checked ? 'visible' : 'none';
  ['landuse-fill', 'landuse-outline'].forEach(layerId => {
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', visibility);
    }
  });
});


// POI POPUPS FOR AMENITY, TOURISM, SHOP
const poiPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: true });

for (const category of ['amenity', 'tourism', 'shop']) {
  map.on('click', `pois-${category}`, (e) => {
    const props = e.features[0].properties;
    const name = props.name || 'Unnamed';
    const cat = category.charAt(0).toUpperCase() + category.slice(1);

    poiPopup
      .setLngLat(e.lngLat)
      .setHTML(`<strong>${name}</strong><br>Category: ${cat}`)
      .addTo(map);
  });

  map.on('mouseenter', `pois-${category}`, () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', `pois-${category}`, () => {
    map.getCanvas().style.cursor = '';
    poiPopup.remove();
  });
}

  // TREE DATA (NTOW) POPUPS

  map.on('click', 'ntow-trees', (e) => {
    const feature = e.features[0];
    const props = feature.properties;

    const popupContent = `
      <strong>TOW ID:</strong> ${props.tow_id || 'N/A'}<br>
      <strong>Woodland Type:</strong> ${props.woodland_type || 'N/A'}<br>
      <strong>Survey Year:</strong> ${props.lidar_survey_year || 'N/A'}<br>
      <strong>Mean Height:</strong> ${props.meanht ? props.meanht.toFixed(1) + ' m' : 'N/A'}<br>
      <strong>Height Range:</strong> ${props.minht && props.maxht ? 
        `${props.minht.toFixed(1)} – ${props.maxht.toFixed(1)} m` : 'N/A'}<br>
      <strong>Area:</strong> ${props.tow_area_m ? 
        props.tow_area_m.toLocaleString() + ' m²' : 'N/A'}
    `;

    new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(popupContent)
      .addTo(map);
  });

  map.on('mouseenter', 'ntow-trees', () => {
  map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'ntow-trees', () => {
    map.getCanvas().style.cursor = '';
  });

// CANOPY COVER POPUP TO SIDEBAR

  map.on('click', 'ward-canopy', (e) => {
  const props = e.features[0].properties;
  const html = `
    <strong>Ward:</strong> ${props.wardname}<br>
    <strong>Canopy Cover:</strong> ${props.percancov.toFixed(1)}%<br>
    <strong>Survey Year:</strong> ${props.survyear}<br>
    <strong>Standard Error:</strong> ${props.standerr}%`;
    document.getElementById('sidebar-content').innerHTML = html;

  });


// --- CANOPY COVER SIDEBAR LOGIC ---

// Show ward canopy info in sidebar on click
map.on('click', 'ward-canopy', (e) => {
  // Prevent other click events from firing
  e.preventDefault();

  const props = e.features[0].properties;
  const html = `
    <strong>Ward:</strong> ${props.wardname}<br>
    <strong>Canopy Cover:</strong> ${props.percancov.toFixed(1)}%<br>
    <strong>Survey Year:</strong> ${props.survyear}<br>
    <strong>Standard Error:</strong> ${props.standerr}%`;
  document.getElementById('sidebar-content').innerHTML = html;
});

// General fallback: show message if no feature is clicked
map.on('click', (e) => {
  if (e.defaultPrevented) return; // Skip if feature click already handled

  const features = map.queryRenderedFeatures(e.point, {
    layers: ['listed-fill', 'ward-canopy', 'ntow-trees', 'buildings-3d']
  });

  if (features.length === 0) {
    document.getElementById('sidebar-content').innerHTML = `<p>Select a feature on the map to view details.</p>`;
  }
});

// Highlight layer for listed buildings
map.addLayer({
  id: 'listed-highlight',
  type: 'line',
  source: 'listed-buildings',
  layout: {},
  paint: {
    'line-color': '#FFD700', // gold/yellow highlight
    'line-width': 4,
    'line-opacity': 1
  },
  filter: ['==', 'id', ''] // No feature selected by default
});


// Update sidebar with weighted average canopy cover in view
function updateCanopyInView() {
  const features = map.queryRenderedFeatures({ layers: ['ward-canopy'] });

  if (!features.length) {
    document.getElementById('sidebar-content').innerHTML = 'No canopy data in view.';
    return;
  }

  let totalArea = 0;
  let weightedSum = 0;

  features.forEach(f => {
    const props = f.properties;
    const canopyPerc = parseFloat(props.percancov);
    const area = turf.area(f); // area in square meters using Turf.js

    totalArea += area;
    weightedSum += canopyPerc * area;
  });

  const averageCanopy = weightedSum / totalArea;

  document.getElementById('sidebar-content').innerHTML = `
    <strong>Total Canopy Cover in View:</strong><br>
    Weighted Average: ${averageCanopy.toFixed(2)}%
  `;
}


// --- LAND USE CHART ---
function updateLandUseChart() {
  // Always reset the container to ensure the canvas exists
  if (!document.getElementById('landuse-chart')) {
    document.getElementById('landuse-chart-container').innerHTML =
      '<canvas id="landuse-chart" width="300" height="300"></canvas>';
  }

  const features = map.queryRenderedFeatures(
    [[0, 0], [map.getCanvas().width, map.getCanvas().height]],
    { layers: ['landuse-fill'] }
  );

  if (!features.length) {
    // Instead of replacing the whole container, just hide the chart and show a message
    document.getElementById('landuse-chart').style.display = 'none';
    if (!document.getElementById('landuse-chart-message')) {
      const msg = document.createElement('div');
      msg.id = 'landuse-chart-message';
      msg.textContent = 'No land use data in view.';
      document.getElementById('landuse-chart-container').appendChild(msg);
    }
    return;
  } else {
    // Remove the message and show the chart
    const msg = document.getElementById('landuse-chart-message');
    if (msg) msg.remove();
    document.getElementById('landuse-chart').style.display = '';
  }

  const areaByType = {};

  const groupLandUseType = (type) => {
    if (!type) return 'Unknown';
    const t = type.toLowerCase();
    if (t.includes('residential')) return 'residential';
    if (t.includes('industrial')) return 'industrial';
    if (t.includes('commercial')) return 'commercial';
    if (t.includes('forest')) return 'forest';
    if (t.includes('farmland')) return 'farmland';
    if (t.includes('grass')) return 'grass';
    if (t.includes('park')) return 'park';
    if (t.includes('quarry')) return 'quarry';
    return type;
  };

  features.forEach(f => {
    const type = groupLandUseType(f.properties.landuse);
    const area = turf.area(f);
    areaByType[type] = (areaByType[type] || 0) + area;
  });

  const totalArea = Object.values(areaByType).reduce((a, b) => a + b, 0);
const threshold = 0.02; // 2%
const grouped = {};
let otherArea = 0;

for (const [type, area] of Object.entries(areaByType)) {
  if (area / totalArea < threshold) {
    otherArea += area;
  } else {
    grouped[type] = area;
  }
}
if (otherArea > 0) grouped['Other'] = otherArea;

const labels = Object.keys(grouped);
const data = labels.map(l => grouped[l]);
const backgroundColors = labels.map(l => landUseColors[l] || '#999');

  const ctx = document.getElementById('landuse-chart')?.getContext('2d');
  if (!ctx) {
    console.warn('Chart canvas not found.');
    return;
  }

  if (window.landUseChart) {
    window.landUseChart.data.labels = labels;
    window.landUseChart.data.datasets[0].data = data;
    window.landUseChart.data.datasets[0].backgroundColor = backgroundColors;
    window.landUseChart.update();
  } else {
    window.landUseChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Land Use Area (m²)',
          data,
          backgroundColor: backgroundColors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Land Use Area in View' }
        }
      }
    });
  }
}

// Register the moveend event ONCE, after map load
map.on('moveend', updateLandUseChart);
map.on('moveend', updateCanopyInView);




  // --- OVERPASS API PROW and Roads ---

  // Utility: convert OSM data to GeoJSON
  function osmToGeoJSON(osmData) {
    const nodes = new Map();
    const features = [];

    osmData.elements.forEach(el => {
      if (el.type === 'node') nodes.set(el.id, [el.lon, el.lat]);
    });

    osmData.elements.forEach(el => {
      if (el.type === 'way') {
        const coords = el.nodes.map(id => nodes.get(id)).filter(Boolean);
        if (coords.length) {
          features.push({
            type: 'Feature',
            id: el.id,
            properties: el.tags || {},
            geometry: { type: 'LineString', coordinates: coords },
          });
        }
      }
    });

    return { type: 'FeatureCollection', features };
  }

  // PROW Query and Layer
  const prowQuery = `
    [out:json][timeout:25];
    area["name"="Canterbury"]["boundary"="administrative"]["admin_level"="8"]->.searchArea;
    way["highway"~"footway|path|bridleway"](area.searchArea);
    (._;>;);
    out body;
  `;

  fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: 'data=' + encodeURIComponent(prowQuery),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
    .then(res => res.json())
    .then(data => {
      const geojson = osmToGeoJSON(data);
      map.addSource('prow', { type: 'geojson', data: geojson });

      map.addLayer({
        id: 'prow-lines',
        type: 'line',
        source: 'prow',
        layout: { 'visibility': 'none' , 'line-join': 'round', 'line-cap': 'round' },
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
          'line-width': 1,
          'line-opacity': 0.8,
        },
      });
    })
    .catch(err => console.error('Error fetching PROW data:', err));

  // Roads Query and Layer
  const roadsQuery = `
    [out:json][timeout:25];
    area["name"="Canterbury"]["boundary"="administrative"]["admin_level"="8"]->.searchArea;
    (
      way["highway"]["highway"!~"footway|path|cycleway|bridleway"](area.searchArea);
    );
    (._;>;);
    out body;
  `;

  fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: 'data=' + encodeURIComponent(roadsQuery),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
    .then(res => res.json())
    .then(data => {
      const geojson = osmToGeoJSON(data);
      map.addSource('roads', { type: 'geojson', data: geojson });

      map.addLayer({
        id: 'road-lines',
        type: 'line',
        source: 'roads',
        layout: { 'visibility': 'none' , 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#6c757d',
          'line-width': 1,
          'line-opacity': 0.7,
        },
      });
    })
    .catch(err => console.error('Error fetching roads data:', err));





  // --- POPUPS for PROW and Roads ---

  const prowPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });

  map.on('mouseenter', 'prow-lines', (e) => {
    map.getCanvas().style.cursor = 'pointer';

    const f = e.features[0];
    const highway = f.properties.highway || 'footpath';
    prowPopup
      .setLngLat(e.lngLat)
      .setHTML(`<strong>PROW:</strong> ${highway}`)
      .addTo(map);
  });

  map.on('mouseleave', 'prow-lines', () => {
    map.getCanvas().style.cursor = '';
    prowPopup.remove();
  });

  const roadPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });

  map.on('mouseenter', 'road-lines', (e) => {
    map.getCanvas().style.cursor = 'pointer';

    const f = e.features[0];
    const highway = f.properties.highway || 'road';
    roadPopup
      .setLngLat(e.lngLat)
      .setHTML(`<strong>Road:</strong> ${highway}`)
      .addTo(map);
  });

  map.on('mouseleave', 'road-lines', () => {
    map.getCanvas().style.cursor = '';
    roadPopup.remove();
  });

 




  // --- LAYER VISIBILITY TOGGLES ---

  // Toggle layers when checkboxes change

  document.getElementById('togglePROW').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('prow-lines')) map.setLayoutProperty('prow-lines', 'visibility', visibility);
  });

  document.getElementById('toggleRoads').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('road-lines')) map.setLayoutProperty('road-lines', 'visibility', visibility);
  });

  document.getElementById('toggleAmenity').addEventListener('change', function () {
  const visibility = this.checked ? 'visible' : 'none';
  if (map.getLayer('pois-amenity')) map.setLayoutProperty('pois-amenity', 'visibility', visibility);
  });

  document.getElementById('toggleTourism').addEventListener('change', function () {
  const visibility = this.checked ? 'visible' : 'none';
  if (map.getLayer('pois-tourism')) map.setLayoutProperty('pois-tourism', 'visibility', visibility);
  });

  document.getElementById('toggleShop').addEventListener('change', function () {
  const visibility = this.checked ? 'visible' : 'none';
  if (map.getLayer('pois-shop')) map.setLayoutProperty('pois-shop', 'visibility', visibility);
  });

  document.getElementById('toggleCanopy').addEventListener('change', (e) => {
  const visibility = e.target.checked ? 'visible' : 'none';
  if (map.getLayer('ward-canopy')) {
    map.setLayoutProperty('ward-canopy', 'visibility', visibility);
  }
});

document.getElementById('toggleNTOW').addEventListener('change', (e) => {
  const visibility = e.target.checked ? 'visible' : 'none';

  // Toggle NTOW map layer visibility
  if (map.getLayer('ntow-trees')) {
    map.setLayoutProperty('ntow-trees', 'visibility', visibility);
  }

  // Show/hide legend in sidebar
  const legend = document.getElementById('ntow-legend');
  legend.style.display = visibility === 'visible' ? 'block' : 'none';
});

document.getElementById('toggleBasePOIs').addEventListener('change', function(e) {
  const visibility = e.target.checked ? 'visible' : 'none';

  const basePoiLayers = [
    'poi_z10',
    'poi_z11',
    'poi_z12',
    'poi_z13',
    'poi_z14',
    'poi_z15',
    'poi_z16'
  ];

  basePoiLayers.forEach(layerId => {
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', visibility);
    }
  });
});

document.getElementById('toggleListed').addEventListener('change', (e) => {
  const visibility = e.target.checked ? 'visible' : 'none';
  if (map.getLayer('listed-fill')) {
    map.setLayoutProperty('listed-fill', 'visibility', visibility);
    map.setLayoutProperty('listed-highlight', 'visibility', visibility); // Show highlight layer too
  }
});



// --- TOGGLE BUTTON for collapsing controls ---

document.querySelector('.toggle-button').addEventListener('click', () => {
  document.querySelector('.layer-controls').classList.toggle('collapsed');
});
document.querySelectorAll('.group-header').forEach(header => {
  header.addEventListener('click', () => {
    const content = header.nextElementSibling;
    const isCollapsed = content.classList.toggle('collapsed');
    header.classList.toggle('expanded', !isCollapsed);
  });

  header.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      header.click();
    }
  });
}); 

});

