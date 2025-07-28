import * as turf from '@turf/turf';

export function setupInteractions(map) {
  // --- POPUPS & INTERACTION ---

  // Land use popup
  const landUsePopup = new maplibregl.Popup({
    closeButton: true,
    closeOnClick: true,
  });

  // Show popup on land use area click
  map.on('click', 'landuse-fill', (e) => {
    if (!e.features || !e.features.length) return;

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
      if (isNaN(canopyPerc)) return; // or handle gracefully
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

  map.on('moveend', () => {
    updateCanopyInView();
    // updateLandUseChart(); // Uncomment if you have this function
  });

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

  // Add other click/hover events here...
}

