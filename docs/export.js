function exportMapPNG() {
    try {
        const canvas = map.getCanvas();
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'map-export.png';
        link.click();
    } catch (err) {
        console.error('Export failed', err);
    }
}

function exportSourceGeoJSON(sourceId, filename) {
    const source = map.getSource(sourceId);
    if (source && source._data) {
        const data = source._data;
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    } else {
        console.error('Source not found or not a GeoJSON source:', sourceId);
    }
}

async function exportSourceDXF(sourceId, filename) {
    const source = map.getSource(sourceId);
    if (!source) {
        console.error('Source not found:', sourceId);
        return;
    }

    let geojson;

    if (typeof source._data === 'string') {
        // source._data is a URL, fetch the GeoJSON
        try {
            const resp = await fetch(source._data);
            geojson = await resp.json();
        } catch (err) {
            alert('Failed to fetch GeoJSON for source: ' + sourceId);
            console.error('Failed to fetch GeoJSON:', err);
            return;
        }
    } else {
        geojson = source._data || source.data;
    }

    if (!geojson || !Array.isArray(geojson.features)) {
        alert('No GeoJSON features found for source: ' + sourceId);
        console.error('No data found for source', sourceId);
        return;
    }

    generateDXF(geojson, filename);
}

// Helper function to generate and download DXF
function generateDXF(geojson, filename) {
    let dxfContent = "0\nSECTION\n2\nENTITIES\n";

    geojson.features.forEach(feature => {
        const { type, coordinates } = feature.geometry;

        if (type === 'Point') {
            const [x, y] = project(coordinates[0], coordinates[1]);
            dxfContent += `0\nPOINT\n8\n0\n10\n${x}\n20\n${y}\n30\n0\n`;
        } else if (type === 'LineString') {
            dxfContent += "0\nPOLYLINE\n8\n0\n66\n1\n70\n0\n";
            coordinates.forEach(coord => {
                const [x, y] = project(coord[0], coord[1]);
                dxfContent += `0\nVERTEX\n8\n0\n10\n${x}\n20\n${y}\n30\n0\n`;
            });
            dxfContent += "0\nSEQEND\n";
        } else if (type === 'Polygon') {
            dxfContent += "0\nLWPOLYLINE\n8\n0\n90\n" + coordinates[0].length + "\n70\n1\n";
            coordinates[0].forEach(coord => {
                const [x, y] = project(coord[0], coord[1]);
                dxfContent += `10\n${x}\n20\n${y}\n`;
            });
            dxfContent += "0\n";
        }
    });

    dxfContent += "0\nENDSEC\n0\nEOF\n";

    const blob = new Blob([dxfContent], { type: 'application/dxf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

// --- Place your export panel code here ---
document.getElementById('exportMapBtn').addEventListener('click', () => {
  const panel = document.getElementById('exportPanel');
  panel.classList.toggle('hidden');
  populateLayerCheckboxes();
});

function populateLayerCheckboxes() {
  const container = document.getElementById('layerCheckboxes');
  container.innerHTML = '';

  Object.entries(window.layerCategories).forEach(([category, layerIds]) => {
    // Create category dropdown
    const details = document.createElement('details');
    details.open = false; // Start open, or set to false if you want collapsed

    const summary = document.createElement('summary');
    summary.textContent = category;
    details.appendChild(summary);

    layerIds.forEach(layerId => {
      const layer = map.getLayer(layerId);
      if (!layer) return;
      if (!['fill', 'line', 'circle', 'symbol'].includes(layer.type)) return;

      const visibility = map.getLayoutProperty(layerId, 'visibility') !== 'none';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = layerId;
      checkbox.checked = visibility;

      const label = document.createElement('label');
      label.textContent = window.layerNames[layerId] || layerId;
      label.style.marginLeft = "8px";

      const wrapper = document.createElement('div');
      wrapper.style.marginBottom = "4px";
      wrapper.appendChild(checkbox);
      wrapper.appendChild(label);

      details.appendChild(wrapper);
    });

    container.appendChild(details);
  });
}

document.getElementById('exportPNG').addEventListener('click', () => {
  const canvas = map.getCanvas();
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'map.png';
  link.click();
});

document.getElementById('exportLayers').addEventListener('click', () => {
  const checked = Array.from(document.querySelectorAll('#layerCheckboxes input:checked'))
    .map(cb => cb.value);

  checked.forEach(layerId => {
    const features = map.queryRenderedFeatures({ layers: [layerId] });
    const geojson = {
      type: 'FeatureCollection',
      features: features
    };
    
    const blob = new Blob([JSON.stringify(geojson)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${layerId}.geojson`;
    link.click();
  });
});

document.getElementById('exportDXF').addEventListener('click', () => {
  const checked = Array.from(document.querySelectorAll('#layerCheckboxes input:checked'))
    .map(cb => cb.value);

  if (checked.length === 0) {
    alert('Please select at least one layer to export as DXF.');
    return;
  }

  checked.forEach(layerId => {
    const layer = map.getLayer(layerId);
    if (!layer) return;
    const sourceId = layer.source;
    exportSourceDXF(sourceId, `${layerId}.dxf`);
  });
});

document.getElementById('exportMapBtn').disabled = false; // or true if you want to disable initially

window.layerCategories = {
  "Heritage & Designation": [
    "article-4-direction",
    "conservation-areas",
    "heritage-parks-fill",
    "listed-fill",
    "smonuments-fill",
    "whs-core",
    "whs-buffer"
  ],
  "Land Use & Planning": [
    "agricultural-land",
    "built-up-areas",
    "landuse-fill",
    "residential-areas",
    "local-plan-boundaries",
    "streetlighting-buffer"
  ],
  "Natural Environment": [
    "ancient-woodland",
    "aonb-fill",
    "grass-area",
    "local-nature-reserves",
    "national-nature-reserves",
    "ntow-trees",
    "ward-canopy",
    "tree-preservation-zones",
    "woodland"
  ],
  "Social Infrastructure": [
    "pois-amenity",
    "pois-base",
    "cemetery-outline",
    "educational-establishments",
    "hospital-outline",
    "pois-shop",
    "school-outline",
    "stadium-outline",
    "pois-tourism"
  ],
  "Environmental Features": [
    "flood-risk",
    "boreholes",
    "hydrogelogy",
    "contour-lines"
  ],
  "Transport and Accessibility": [
    "prow-footpath",
    "public-transport-nodes",
    "roads"
  ]
};

window.layerNames = {
  "article-4-direction": "Article 4 Direction Areas",
  "conservation-areas": "Conservation Areas",
  "heritage-parks-fill": "Heritage Parks and Gardens",
  "listed-fill": "Listed Buildings",
  "smonuments-fill": "Scheduled Monuments",
  "whs-core": "World Heritage Site (Core)",
  "whs-buffer": "World Heritage Site (Buffer)",
  "agricultural-land": "Agricultural Land",
  "built-up-areas": "Built Up Areas",
  "landuse-fill": "General Land Use",
  "residential-areas": "Residential Areas",
  "local-plan-boundaries": "Local Plan Boundaries",
  "streetlighting-buffer": "Streetlighting Buffer",
  "ancient-woodland": "Ancient Woodland",
  "aonb-fill": "Area of Outstanding Natural Beauty",
  "grass-area": "Grass Area",
  "local-nature-reserves": "Local Nature Reserves",
  "national-nature-reserves": "National Nature Reserves",
  "ntow-trees": "NTOW Trees",
  "ward-canopy": "Tree Canopy Cover",
  "tree-preservation-zones": "Tree Preservation Zones",
  "woodland": "Woodland",
  "pois-amenity": "Amenity POIs",
  "pois-base": "Base Map POIs",
  "cemetery-outline": "Cemeteries",
  "educational-establishments": "Educational Establishments",
  "hospital-outline": "Hospitals",
  "pois-shop": "Shop POIs",
  "school-outline": "Schools",
  "stadium-outline": "Stadiums",
  "pois-tourism": "Tourism POIs",
  "flood-risk": "Flood Risk Areas",
  "boreholes": "Borehole Scans",
  "hydrogelogy": "Hydrogeology Features",
  "contour-lines": "Contour Lines",
  "prow-footpath": "PROW (Footpaths)",
  "public-transport-nodes": "Public Transport Access",
  "roads": "Roads"
};

document.getElementById('exportPanel').classList.add('hidden');

function project(lon, lat) {
    const x = lon * 20037508.34 / 180;
    let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
    y = y * 20037508.34 / 180;
    return [x, y];
}

