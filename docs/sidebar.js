function setupSidebar(map) {
  // Functions for updating sidebar sections, close buttons, etc.

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


// Handle clicks on Article 4 Directions and Conservation Areas
map.on('click', (e) => {
  if (e.defaultPrevented) return;

  // Query for both Article 4 and Conservation Areas at the click point
  const article4Features = map.queryRenderedFeatures(e.point, {
    layers: ['article-4-direction']
  });
  
  const conservationFeatures = map.queryRenderedFeatures(e.point, {
    layers: ['conservation-areas']
  });
  
  const otherFeatures = map.queryRenderedFeatures(e.point, {
    layers: ['listed-fill', 'ward-canopy', 'ntow-trees', 'buildings-3d']
  });

  // If we have Article 4 or Conservation data, handle them
  if (article4Features.length > 0 || conservationFeatures.length > 0) {
    e.preventDefault();
    
    let html = '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">';
    
    // Title based on what's present
    if (article4Features.length > 0 && conservationFeatures.length > 0) {
      html += '<h3>Article 4 Direction & Conservation Area</h3>';
    } else if (article4Features.length > 0) {
      html += '<h3>Article 4 Direction Area</h3>';
    } else {
      html += '<h3>Conservation Area</h3>';
    }
    
    html += '<button id="clear-combined-selection" class="sidebar-close-btn">✕</button>';
    html += '</div>';
    
    // Handle Article 4 data
    if (article4Features.length > 0) {
      const article4Props = article4Features[0].properties;
      
      // Highlight Article 4 area
      map.setFilter('article-4-highlight', ['==', 'fid', article4Props.fid]);
      
      html += '<div style="border-left: 4px solid #FF4500; padding-left: 10px; margin-bottom: 15px;">';
      html += '<h4 style="margin: 0 0 8px 0; color: #FF4500;">Article 4 Direction</h4>';
      
      // Display Article 4 fields
      if (article4Props.name && article4Props.name.trim() !== '' && article4Props.name !== 'null') {
        html += `<p><strong>Name:</strong> ${article4Props.name}</p>`;
      }
      if (article4Props.description && article4Props.description.trim() !== '' && article4Props.description !== 'null') {
        html += `<p><strong>Description:</strong> ${article4Props.description}</p>`;
      }
      if (article4Props.notes && article4Props.notes.trim() !== '' && article4Props.notes !== 'null') {
        html += `<p><strong>Notes:</strong> ${article4Props.notes}</p>`;
      }
      if (article4Props.reference && article4Props.reference.trim() !== '' && article4Props.reference !== 'null') {
        html += `<p><strong>Reference:</strong> ${article4Props.reference}</p>`;
      }
      if (article4Props['start-date'] && article4Props['start-date'].trim() !== '' && article4Props['start-date'] !== 'null') {
        html += `<p><strong>Start Date:</strong> ${article4Props['start-date']}</p>`;
      }
      
      if (article4Props.reference && article4Props.reference.trim() !== '' && article4Props.reference !== 'null') {
        html += `<p><a href="https://www.gov.uk/guidance/when-is-permission-required" target="_blank">More info about Article 4 Directions →</a></p>`;
      }
      
      html += '</div>';
    }
    
    // Handle Conservation Area data
    if (conservationFeatures.length > 0) {
      const conservationProps = conservationFeatures[0].properties;
      
      // Highlight Conservation area
      map.setFilter('conservation-areas-highlight', ['==', 'fid', conservationProps.fid]);
      
      html += '<div style="border-left: 4px solid #1565c0; padding-left: 10px; margin-bottom: 15px;">';
      html += '<h4 style="margin: 0 0 8px 0; color: #1565c0;">Conservation Area</h4>';
      
      // Display Conservation Area fields
      if (conservationProps.name && conservationProps.name.trim() !== '') {
        html += `<p><strong>Name:</strong> ${conservationProps.name}</p>`;
      }
      if (conservationProps.designation_date && conservationProps.designation_date.trim() !== '') {
        html += `<p><strong>Designation Date:</strong> ${conservationProps.designation_date}</p>`;
      }
      if (conservationProps.description && conservationProps.description.trim() !== '') {
        html += `<p><strong>Description:</strong> ${conservationProps.description}</p>`;
      }
      
      html += `<p><a href="https://historicengland.org.uk/advice/hpg/has/conservation-areas/" target="_blank">More about Conservation Areas →</a></p>`;
      
      html += '</div>';
    }
    
    document.getElementById('sidebar-content').innerHTML = html;
    
    // Add click handler for the clear button
    document.getElementById('clear-combined-selection').addEventListener('click', () => {
      map.setFilter('article-4-highlight', ['==', 'fid', 0]);
      map.setFilter('conservation-areas-highlight', ['==', 'fid', 0]);
      document.getElementById('sidebar-content').innerHTML = `<p>Select a feature on the map to view details.</p>`;
    });
    
    return; // Exit early since we handled the click
  }
  
  // Handle other features (ward canopy, etc.)
  if (otherFeatures.length > 0) {
    const feature = otherFeatures[0];
    
    if (feature.source === 'ward-canopy') {
      e.preventDefault();
      const props = feature.properties;
      const html = `
        <strong>Ward:</strong> ${props.wardname}<br>
        <strong>Canopy Cover:</strong> ${props.percancov.toFixed(1)}%<br>
        <strong>Survey Year:</strong> ${props.survyear}<br>
        <strong>Standard Error:</strong> ${props.standerr}%`;
      document.getElementById('sidebar-content').innerHTML = html;
      return;
    }
  }
  
  // If no features found, clear everything
  if (article4Features.length === 0 && conservationFeatures.length === 0 && otherFeatures.length === 0) {
    map.setFilter('article-4-highlight', ['==', 'fid', 0]);
    map.setFilter('conservation-areas-highlight', ['==', 'fid', 0]);
    map.setFilter('listed-highlight', ['==', 'id', '']);
    
    document.getElementById('sidebar-content').innerHTML = `<p>Select a feature on the map to view details.</p>`;
  }
});

// Keep the hover effects
map.on('mouseenter', 'article-4-direction', () => {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'article-4-direction', () => {
  map.getCanvas().style.cursor = '';
});

map.on('mouseenter', 'conservation-areas', () => {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'conservation-areas', () => {
  map.getCanvas().style.cursor = '';
});

// Add the LNR and NNR hover effects here:
map.on('mouseenter', 'local-nature-reserves', () => {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'local-nature-reserves', () => {
  map.getCanvas().style.cursor = '';
});

map.on('mouseenter', 'national-nature-reserves', () => {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'national-nature-reserves', () => {
  map.getCanvas().style.cursor = '';
});

// Modified: Only clear when clicking on empty space, not on zoom/move
map.on('click', (e) => {
  if (e.defaultPrevented) return; // Skip if feature click already handled

  const features = map.queryRenderedFeatures(e.point, {
    layers: ['listed-fill', 'ward-canopy', 'ntow-trees', 'buildings-3d', 'article-4-direction', 'conservation-areas'] // ADD conservation-areas
  });

  if (features.length === 0) {
    // Only clear if clicking on truly empty space (no features)
    map.setFilter('article-4-highlight', ['==', 'fid', 0]);
    map.setFilter('conservation-areas-highlight', ['==', 'fid', 0]); // Change to 0
    map.setFilter('listed-highlight', ['==', 'id', '']);
    
    document.getElementById('sidebar-content').innerHTML = `<p>Select a feature on the map to view details.</p>`;
  }
});

// Modified: Create separate functions for updating content that should refresh
function updateCanopyInView() {
  // Only update if the sidebar is currently showing canopy data
  const sidebarContent = document.getElementById('sidebar-content');
  if (!sidebarContent.innerHTML.includes('Total Canopy Cover in View')) {
    return; // Don't update if showing other content
  }

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

// Add Local Nature Reserves (LNR)
map.on('click', (e) => {
  if (e.defaultPrevented) return;

  const lnrFeatures = map.queryRenderedFeatures(e.point, {
    layers: ['local-nature-reserves']
  });

  const nnrFeatures = map.queryRenderedFeatures(e.point, {
    layers: ['national-nature-reserves']
  });

  if (lnrFeatures.length > 0 || nnrFeatures.length > 0) {
    e.preventDefault();

    let html = `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">`;
    html += `<h3>${lnrFeatures.length > 0 ? 'Local Nature Reserve' : 'National Nature Reserve'}</h3>`;
    html += `<button id="clear-nature-reserve" class="sidebar-close-btn">✕</button></div>`;

    const feature = lnrFeatures[0] || nnrFeatures[0];
    const props = feature.properties;

    html += `<div style="border-left: 4px solid ${lnrFeatures.length > 0 ? '#045a8d' : '#99000d'}; padding-left: 10px; margin-bottom: 15px;">`;

    if (props.name) {
      html += `<p><strong>Site Name:</strong> ${props.name}</p>`;
    }

    if (props['nature-reserve-status']) {
      html += `<p><strong>Status:</strong> ${props['nature-reserve-status']}</p>`;
    }

    if (props['entry-date']) {
      html += `<p><strong>Entry Date:</strong> ${props['entry-date']}</p>`;
    }

    if (props['start-date']) {
      html += `<p><strong>Designation Start Date:</strong> ${props['start-date']}</p>`;
    }

    if (props['end-date']) {
      html += `<p><strong>Designation End Date:</strong> ${props['end-date']}</p>`;
    }

    if (props['reference']) {
      html += `<p><strong>Grid Reference:</strong> ${props['reference']}</p>`;
    }

    html += '</div>';

    document.getElementById('sidebar-content').innerHTML = html;

    document.getElementById('clear-nature-reserve').addEventListener('click', () => {
      document.getElementById('sidebar-content').innerHTML = `<p>Select a feature on the map to view details.</p>`;
    });

    return; 
  }


  // --- NTOW TREES SIDEBAR LOGIC WITH POPUP/SIDEBAR TOGGLE ---
map.on('click', 'ntow-trees', (e) => {
  e.preventDefault();
  
  const props = e.features[0].properties;
  const coordinates = e.lngLat;
  
  // Create popup content with toggle button
  let popupContent = '<div style="font-size: 12px; max-width: 250px;">';
  popupContent += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">';
  popupContent += '<strong style="font-size: 14px;">Tree of Woodland</strong>';
  popupContent += '<button id="switch-to-sidebar" style="background: #2E8B57; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 10px;">View in Sidebar</button>';
  popupContent += '</div>';
  
  if (props.tow_id) {
    popupContent += `<strong>Tree ID:</strong> ${props.tow_id}<br>`;
  }
  if (props.woodland_type) {
    popupContent += `<strong>Type:</strong> ${props.woodland_type}<br>`;
  }
  if (props.meanht) {
    popupContent += `<strong>Mean Height:</strong> ${props.meanht.toFixed(2)}m<br>`;
  }
  if (props.tow_area_m) {
    popupContent += `<strong>Area:</strong> ${props.tow_area_m} m²<br>`;
  }
  if (props.lidar_survey_year) {
    popupContent += `<strong>Survey Year:</strong> ${props.lidar_survey_year}`;
  }
  
  popupContent += '</div>';
  
  // Create and show popup
  const ntowPopup = new mapboxgl.Popup({ closeOnClick: true })
    .setLngLat(coordinates)
    .setHTML(popupContent)
    .addTo(map);
  
  // Add event listener for the toggle button after popup is added
  setTimeout(() => {
    const switchButton = document.getElementById('switch-to-sidebar');
    if (switchButton) {
      switchButton.addEventListener('click', (event) => {
        event.stopPropagation();
        
        // Close popup
        ntowPopup.remove();
        
        // Show in sidebar
        showNTOWInSidebar(props);
      });
    }
  }, 100);
});

// Function to show NTOW tree details in sidebar
function showNTOWInSidebar(props) {
  let html = '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">';
  html += '<h3>Tree of Woodland</h3>';
  html += '<div>';
  html += '<button id="switch-to-popup" style="background: #2E8B57; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 12px; margin-right: 5px;">Popup View</button>';
  html += '<button id="clear-ntow-selection" class="sidebar-close-btn">✕</button>';
  html += '</div>';
  html += '</div>';
  
  html += '<div style="border-left: 4px solid #2E8B57; padding-left: 10px; margin-bottom: 15px;">';
  
  if (props.tow_id) {
    html += `<p><strong>Tree ID:</strong> ${props.tow_id}</p>`;
  }
  if (props.woodland_type) {
    html += `<p><strong>Woodland Type:</strong> ${props.woodland_type}</p>`;
  }
  if (props.meanht || props.minht || props.maxht) {
    html += `<p><strong>Height (m):</strong> 
      Mean: ${props.meanht?.toFixed(2) || 'N/A'}, 
      Min: ${props.minht?.toFixed(2) || 'N/A'}, 
      Max: ${props.maxht?.toFixed(2) || 'N/A'}</p>`;
  }
  if (props.stdvht) {
    html += `<p><strong>Height Variation (Std Dev):</strong> ${props.stdvht.toFixed(2)}</p>`;
  }
  if (props.tow_area_m) {
    html += `<p><strong>Canopy Area:</strong> ${props.tow_area_m} m²</p>`;
  }
  if (props.lidar_survey_year) {
    html += `<p><strong>LiDAR Survey Year:</strong> ${props.lidar_survey_year}</p>`;
  }
  if (props.km1_tile || props.km10_tile) {
    html += `<p><strong>Map Tile:</strong> 1km: ${props.km1_tile}, 10km: ${props.km10_tile}</p>`;
  }
  
  html += '</div>';
  
  document.getElementById('sidebar-content').innerHTML = html;
  
  // Add click handlers for buttons
  document.getElementById('clear-ntow-selection').addEventListener('click', () => {
    document.getElementById('sidebar-content').innerHTML = `<p>Select a feature on the map to view details.</p>`;
  });
  
  document.getElementById('switch-to-popup').addEventListener('click', () => {
    // Clear sidebar
    document.getElementById('sidebar-content').innerHTML = `<p>Select a feature on the map to view details.</p>`;
  });
}

map.on('mouseenter', 'ntow-trees', () => {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'ntow-trees', () => {
  map.getCanvas().style.cursor = '';
});
});




}
