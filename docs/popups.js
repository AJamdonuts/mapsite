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
  document.getElementById('canopy-info').innerHTML = html;
});

// Heritage popups for Scheduled Monuments and Heritage Parks/Gardens
map.on('click', (e) => {
  const features = map.queryRenderedFeatures(e.point, {
    layers: ['smonuments-fill', 'heritage-parks-fill']
  });

  if (!features.length) return;

  const popup = new maplibregl.Popup({ closeButton: true }).setLngLat(e.lngLat);

  let html = '';
  features.forEach((feature, i) => {
    const props = feature.properties;
    const name = props.Name || props.name || 'Unnamed';
    const listEntry = props.ListEntry || props.ListEntryNumber || 'Not available';
    const grade = props.Grade || 'Not applicable';
    const url = props.hyperlink || `https://historicengland.org.uk/listing/the-list/list-entry/${listEntry}`;
    const type = feature.layer.id === 'smonuments-fill' ? 'Scheduled Monument' : 'Heritage Park/Garden';
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
    // Only add <hr> if this is NOT the last feature
    if (i < features.length - 1) {
      html += '<hr>';
    }
  });

  popup.setHTML(html).addTo(map);

  // Wait for popup to be added, then bind zoom buttons
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
}
window.setupPopups = setupPopups; // Export function for use in main.js