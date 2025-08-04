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

// Remove the individual click handlers and replace with a combined one
// Remove these:
// map.on('click', 'article-4-direction', (e) => { ... });
// map.on('click', 'conservation-areas', (e) => { ... });

// Add this combined click handler instead:
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

// Modified: Only register moveend events for content that should update on movement
// Remove these automatic updates:
// map.on('moveend', updateLandUseChart);
// map.on('moveend', updateCanopyInView);

// Instead, only update these when explicitly requested or when showing that specific content
// You can add a button to manually refresh canopy data if needed:
// <button onclick="updateCanopyInView()">Refresh Canopy Stats</button>

}
