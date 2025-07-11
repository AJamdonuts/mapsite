const map = new maplibregl.Map({
  container: 'map',
  style: 'https://api.maptiler.com/maps/streets/style.json?key=sLTnVyFpuI1axO89l1hV',
  center: [1.0830, 51.2797],
  zoom: 13,
});

map.on('load', () => {
  // --- SOURCES ---
  map.addSource('listed-buildings', {
    type: 'geojson',
    data: 'datasets/NH_Listed_Building_polygons.geojson',
  });

  map.addSource('osm-trees', {
    type: 'geojson',
    data: 'datasets/osm_trees.geojson',
  });

  map.addSource('building_height', {
    type: 'geojson',
    data: 'datasets/building_height.geojson',
  });

  map.addSource('tree-clusters', {
    type: 'geojson',
    data: 'datasets/osm_trees.geojson',
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  map.addSource('landuse', {
    type: 'geojson',
    data: 'datasets/landuse_osm.geojson',
  });


  map.addSource('pois', {
  type: 'geojson',
  data: 'datasets/pois_osm.geojson',
});


  // --- LAYERS ---

  // Listed buildings fill
  map.addLayer({
    id: 'listed-fill',
    type: 'fill',
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
      'fill-extrusion-height': [
        'coalesce',
        ['get', 'height'],
        ['*', ['to-number', ['get', 'building:levels']], 3],
        10,
      ],
      'fill-extrusion-base': 0,
    },
  });

  // Tree points
  map.addLayer({
    id: 'osm-tree-points',
    type: 'circle',
    source: 'osm-trees',
    filter: ['==', '$type', 'Point'],
    paint: {
      'circle-radius': 3,
      'circle-color': '#228B22',
      'circle-opacity': 0.7,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#004d00',
    },
  });

  // Tree polygons
  map.addLayer({
    id: 'osm-tree-polygons',
    type: 'fill',
    source: 'osm-trees',
    filter: ['==', '$type', 'Polygon'],
    paint: {
      'fill-color': '#a3c293',
      'fill-opacity': 0.3,
    },
  });

  // Tree clusters circle
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'tree-clusters',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#a3c293',
        10,
        '#66aa66',
        25,
        '#228B22',
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        12,
        10,
        16,
        25,
        22,
      ],
      'circle-stroke-width': 1,
      'circle-stroke-color': '#004d00',
    },
  });

  // Cluster count text
  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'tree-clusters',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count'],
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': 12,
    },
    paint: {
      'text-color': '#ffffff',
    },
  });

  // Unclustered tree points in clusters source
  map.addLayer({
    id: 'unclustered-trees',
    type: 'circle',
    source: 'tree-clusters',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius': 5,
      'circle-color': '#228B22',
      'circle-opacity': 0.7,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#000000',
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

  map.addLayer({
    id: 'landuse-fill',
    type: 'fill',
    source: 'landuse',
    paint: {
      'fill-color': [
        'match',
        ['get', 'landuse'],
        ...Object.entries(landUseColors).flat(),
        '#cccccc',
      ],
      'fill-opacity': 0.3,
    },
  });

  // Land use outline
  map.addLayer({
    id: 'landuse-outline',
    type: 'line',
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

  for (const category of ['amenity', 'tourism', 'shop']) {
    map.addLayer({
      id: `pois-${category}`,
      type: 'circle',
      source: 'pois',
      filter: ['has', category],  // show features that have this tag
      paint: {
        'circle-radius': 6,
        'circle-color': poiColors[category],
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff',
      },
    });
  }

  // --- POPUPS & INTERACTION ---

  // Land use popup
  const landUsePopup = new maplibregl.Popup({
    closeButton: true,
    closeOnClick: true,
  });

  map.on('click', 'landuse-fill', (e) => {
    const props = e.features[0].properties;
    const landuseType = props.landuse || 'Unknown';
    const description = props.description || 'No description available';

    landUsePopup
      .setLngLat(e.lngLat)
      .setHTML(`<strong>Land Use:</strong> ${landuseType}<br>${description}`)
      .addTo(map);
  });

  map.on('mouseenter', 'landuse-fill', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'landuse-fill', () => {
    map.getCanvas().style.cursor = '';
    landUsePopup.remove();
  });

  // Buildings popup + cursor
  const buildingPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });

  map.on('mousemove', 'buildings-3d', (e) => {
    map.getCanvas().style.cursor = 'pointer';
    const feature = e.features[0];
    const props = feature.properties;
    const name = props.Name || 'Unnamed Building';

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


  document.getElementById('toggleLanduse').addEventListener('change', (e) => {
  const visibility = e.target.checked ? 'visible' : 'none';
  ['landuse-fill', 'landuse-outline'].forEach(layerId => {
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', visibility);
    }
  });
});

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


  // Tree points cursor change only (no popup here)
  map.on('mouseenter', 'osm-tree-points', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'osm-tree-points', () => {
    map.getCanvas().style.cursor = '';
  });

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
    body: prowQuery,
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
    body: roadsQuery,
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
        layout: { 'line-join': 'round', 'line-cap': 'round' },
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

  // --- CLUSTER ZOOM ON CLICK ---

  map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
    if (!features.length) return;

    const clusterId = features[0].properties.cluster_id;

    map.getSource('tree-clusters').getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return;
      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom,
      });
    });
  });

  // Change cursor to pointer when hovering clusters
  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
  });

  // --- LAYER VISIBILITY TOGGLES ---

  // Toggle layers when checkboxes change
  document.getElementById('toggleOSMTrees').addEventListener('change', function () {
    const visibility = this.checked ? 'visible' : 'none';

    // Toggle tree points and polygons
    if (map.getLayer('osm-tree-points')) {
      map.setLayoutProperty('osm-tree-points', 'visibility', visibility);
    }
    if (map.getLayer('osm-tree-polygons')) {
      map.setLayoutProperty('osm-tree-polygons', 'visibility', visibility);
    }

    // Toggle cluster layers
    ['clusters', 'cluster-count', 'unclustered-trees'].forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', visibility);
      }
    });
  });


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


}); // end of map.on('load')

// --- TOGGLE BUTTON for collapsing controls ---

document.querySelector('.toggle-button').addEventListener('click', () => {
  document.querySelector('.layer-controls').classList.toggle('collapsed');
});
