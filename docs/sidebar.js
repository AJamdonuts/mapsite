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

// Register the moveend event ONCE, after map load
map.on('moveend', updateLandUseChart);
map.on('moveend', updateCanopyInView);

}
window.setupSidebar = setupSidebar; // Export function for use in main.js