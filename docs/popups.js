// --- POPUPS & INTERACTION ---

function setupPopups(map) {

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

  // Buildings popup - MODIFIED to show in sidebar instead of hover popup
  map.on('click', 'buildings-3d', (e) => {
    const feature = e.features[0];
    const props = feature.properties;
    const name = props.Name || 'Unnamed Building';

    // Visual feedback for click - change cursor temporarily
    map.getCanvas().style.cursor = 'wait';
    setTimeout(() => {
      map.getCanvas().style.cursor = 'pointer';
    }, 200);

    // Calculate height if available, otherwise estimate
    let height = 'Unknown';
    if (props.height) height = `${props.height} m`;
    else if (props['building:levels']) {
      const levels = parseInt(props['building:levels'], 10);
      height = `${levels * 3} m (approx from ${levels} levels)`;
    }

    // Show building height panel in sidebar
    document.getElementById('building-height-panel').style.display = 'block';
    
    // Populate the panel with building height data
    const heightInfo = document.getElementById('building-height-info');
    heightInfo.innerHTML = `
      <table>
        <tr><td><strong>Building Name:</strong></td><td>${name}</td></tr>
        <tr><td><strong>Height:</strong></td><td>${height}</td></tr>
        <tr><td><strong>Building Type:</strong></td><td>${props.building || props['building:type'] || 'N/A'}</td></tr>
        <tr><td><strong>Levels:</strong></td><td>${props['building:levels'] || 'N/A'}</td></tr>
        <tr><td><strong>Material:</strong></td><td>${props['building:material'] || 'N/A'}</td></tr>
        <tr><td><strong>Use:</strong></td><td>${props['building:use'] || 'N/A'}</td></tr>
      </table>
    `;

    // Hide other panels if they're open
    document.getElementById('listed-building-panel').style.display = 'none';
    
    // Clear the main sidebar content or show a message
    document.getElementById('sidebar-content').innerHTML = '<p>Building height information shown below.</p>';
  });

  // Change cursor on hover (optional)
  map.on('mouseenter', 'buildings-3d', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'buildings-3d', () => {
    map.getCanvas().style.cursor = '';
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

// EDUCATIONAL ESTABLISHMENT POPUPS
map.on('click', 'educational-establishments', (e) => {
  const props = e.features[0].properties;

  const statusLookup = {
    '1': 'Open',
    '2': 'Closed',
    '3': 'Proposed'
  };

  const typeLookup = {
    '14': 'Community School',
    '15': 'Voluntary Aided School',
    '16': 'Voluntary Controlled School',
    '17': 'Foundation School'
  };

  const popupHtml = `
    <strong>School Name:</strong> ${props.name || 'Unknown'}<br>
    <strong>Status:</strong> ${statusLookup[props['educational-establishment-status']] || 'N/A'}<br>
    <strong>Type:</strong> ${typeLookup[props['educational-establishment-type']] || 'N/A'}<br>
    <strong>Local Authority:</strong> ${props['local-authority-district'] || 'N/A'}<br>
    <strong>Ward:</strong> ${props.ward || 'N/A'}<br>
    <strong>Entry Date:</strong> ${props['entry-date'] || 'N/A'}<br>
    <strong>Reference No.:</strong> ${props.reference || 'N/A'}
    ${props['website-url'] ? `<br><strong>Website:</strong> <a href="${props['website-url']}" target="_blank">Visit</a>` : ''}
  `;

  new maplibregl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(popupHtml)
    .addTo(map);
});

// Add hover effects for educational establishments
map.on('mouseenter', 'educational-establishments', () => {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'educational-establishments', () => {
  map.getCanvas().style.cursor = '';
});

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
  e.preventDefault(); // Prevent other click handlers from firing
  
  const props = e.features[0].properties;
  const html = `
    <div style="border-left: 4px solid #4CAF50; padding-left: 10px; margin-bottom: 15px;">
      <h3>Ward Canopy Cover</h3>
      <p><strong>Ward:</strong> ${props.wardname}</p>
      <p><strong>Canopy Cover:</strong> ${props.percancov.toFixed(1)}%</p>
      <p><strong>Survey Year:</strong> ${props.survyear}</p>
      <p><strong>Standard Error:</strong> ${props.standerr}%</p>
    </div>`;
  
  // Update the correct element
  document.getElementById('sidebar-content').innerHTML = html;
});

// Heritage popups for Scheduled Monuments and Heritage Parks/Gardens
map.on('click', (e) => {
  const features = map.queryRenderedFeatures(e.point, {
    layers: [
      'smonuments-fill',
      'heritage-parks-fill',
      'whs-core',
      'whs-buffer'
    ]
  });

  if (!features.length) return;

  const popup = new maplibregl.Popup({ closeButton: true }).setLngLat(e.lngLat);

  let html = '';
  features.forEach((feature, i) => {
    const props = feature.properties;
    let name = props.Name || props.name || 'Unnamed';
    let listEntry = props.ListEntry || props.ListEntryNumber || 'Not available';
    let grade = props.Grade || 'Not applicable';
    let url = props.hyperlink || `https://historicengland.org.uk/listing/the-list/list-entry/${listEntry}`;
    let type = '';

    if (feature.layer.id === 'smonuments-fill') {
      type = 'Scheduled Monument';
    } else if (feature.layer.id === 'heritage-parks-fill') {
      type = 'Heritage Park/Garden';
    } else if (feature.layer.id === 'whs-core') {
      type = 'World Heritage Site (Core Area)';
      // Optionally override color or add extra info
    } else if (feature.layer.id === 'whs-buffer') {
      type = 'World Heritage Site (Buffer Zone)';
    }

    const zoomButtonId = `zoom-${feature.layer.id}-${feature.id}`;

    html += `
      <div style="margin-bottom:10px;">
        <strong>${name}</strong><br>
        <strong>Heritage Category:</strong> ${type}<br>
        <strong>Grade:</strong> ${grade}<br>
        <strong>List Entry:</strong> ${listEntry}<br>
        <a href="${url}" target="_blank">View list entry</a><br>
        <button id="${zoomButtonId}">Zoom to Feature</button>
      </div>
    `;
    if (i < features.length - 1) {
      html += '<hr>';
    }
  });

  popup.setHTML(html).addTo(map);

  setTimeout(() => {
    for (const feature of features) {
      const zoomButtonId = `zoom-${feature.layer.id}-${feature.id}`;
      const btn = document.getElementById(zoomButtonId);
      if (btn) {
        btn.onclick = () => {
          const geometry = feature.geometry;
          if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
            const bbox = turf.bbox(feature);
            map.fitBounds(bbox, { padding: 50, duration: 1000 });
          } else {
            map.flyTo({ center: e.lngLat, zoom: 17 });
          }
        };
      }
    }
  }, 100);
});

// Add close button functionality for building height panel
document.getElementById('height-close-btn').addEventListener('click', () => {
  document.getElementById('building-height-panel').style.display = 'none';
  document.getElementById('sidebar-content').innerHTML = '<p>Select a feature on the map to view details.</p>';
});

// Flood Risk popup
map.on('click', 'flood-risk', (e) => {
    const props = e.features[0].properties;
    const popupContent = `
        <strong>Flood Risk Zone</strong><br>
        Risk Level: ${props['flood-risk-level']}<br>
        Type: ${props['flood-risk-type']}<br>
        Reference: ${props['reference']}
    `;

    new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(popupContent)
        .addTo(map);
});

map.on('mouseenter', 'flood-risk', () => {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'flood-risk', () => {
    map.getCanvas().style.cursor = '';
});

// BOREHOLES POPUP
map.on('click', 'boreholes', (e) => {
  map.getCanvas().style.cursor = 'wait';
  setTimeout(() => {
    map.getCanvas().style.cursor = 'pointer';
  }, 200);

  const properties = e.features[0].properties;
  const coordinates = e.features[0].geometry.coordinates.slice();

  const html = `
    <strong>${properties.NAME || 'Unnamed Borehole'}</strong><br>
    Reference: ${properties.REFERENCE || 'N/A'}<br>
    Year Known: ${properties.YEAR_KNOWN || 'N/A'}<br>
    Length: ${properties.LENGTH ? properties.LENGTH + ' meters' : 'N/A'}<br>
    Precision: ${properties.PRECISION || 'N/A'}<br>
    ${properties.SCAN_URL ? `<a href="${properties.SCAN_URL}" target="_blank">Scan Link</a>` : ''}
  `;

  new maplibregl.Popup()
    .setLngLat(coordinates)
    .setHTML(html)
    .addTo(map);
});

// Contour Points hover popup
const contourPointPopup = new maplibregl.Popup({
  closeButton: false,
  closeOnClick: false
});

map.on('mouseenter', 'contour-points', (e) => {
  const elev = e.features[0].properties.PROP_VALUE;
  contourPointPopup
    .setLngLat(e.lngLat)
    .setHTML(`<strong>Elevation:</strong> ${elev} m`)
    .addTo(map);
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'contour-points', () => {
  contourPointPopup.remove();
  map.getCanvas().style.cursor = '';
});
}
window.setupPopups = setupPopups; // Export function for use in main.js