import osmtogeojson from 'osmtogeojson';

export async function loadOverpassData(map) {
  const query = `
    [out:json];
    (
      way["highway"](bbox);
      relation["route"="foot"](bbox);
    );
    out body;
    >;
    out skel qt;
  `.replace(/bbox/g, '53.7,-1.7,53.9,-1.3');

  const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
  const json = await response.json();
  const geojson = osmtogeojson(json);

  map.addSource('osm-paths', {
    type: 'geojson',
    data: geojson
  });

  map.addLayer({
    id: 'osm-paths',
    type: 'line',
    source: 'osm-paths',
    paint: {
      'line-color': '#ff6600',
      'line-width': 2
    }
  });
}

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
  body: `data=${encodeURIComponent(prowQuery)}`,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
})
  .then(res => res.json())
  .then(data => {
    const geojson = osmToGeoJSON(data);
    if (!map.getSource('prow')) {
      map.addSource('prow', { type: 'geojson', data: geojson });
    } else {
      map.getSource('prow').setData(geojson);
    }

    if (!map.getLayer('prow-lines')) {
      map.addLayer({
        id: 'prow-lines',
        type: 'line',
        source: 'prow',
        layout: { 'visibility': 'none', 'line-join': 'round', 'line-cap': 'round' },
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
    }
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
  body: `data=${encodeURIComponent(roadsQuery)}`,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
})
  .then(res => res.json())
  .then(data => {
    const geojson = osmToGeoJSON(data);
    if (!map.getSource('roads')) {
      map.addSource('roads', { type: 'geojson', data: geojson });
    } else {
      map.getSource('roads').setData(geojson);
    }

    if (!map.getLayer('road-lines')) {
      map.addLayer({
        id: 'road-lines',
        type: 'line',
        source: 'roads',
        layout: { 'visibility': 'none', 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#6c757d',
          'line-width': 1,
          'line-opacity': 0.7,
        },
      });
    }
  })
  .catch(err => console.error('Error fetching roads data:', err));



