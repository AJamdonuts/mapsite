function fetchOverpassData(map) {
  // Overpass API fetch and conversion logic

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

}
window.fetchOverpassData = fetchOverpassData; // Export function for use in main.js