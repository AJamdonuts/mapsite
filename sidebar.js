import * as turf from '@turf/turf';
import Chart from 'chart.js/auto'; // If using npm/yarn and bundler

// Optional: define colors for land use types
const landUseColors = {
  residential: '#88aa66',
  commercial: '#446688',
  park: '#55aa55',
  industrial: '#aa8844',
  unknown: '#999'
};

export function setupSidebar(map) {
  // --- CANOPY CLICK: Show ward canopy info ---
  map.on('click', 'ward-canopy', (e) => {
    e.preventDefault();

    const props = e.features[0].properties;
    const html = `
      <strong>Ward:</strong> ${props.wardname}<br>
      <strong>Canopy Cover:</strong> ${props.percancov.toFixed(1)}%<br>
      <strong>Survey Year:</strong> ${props.survyear}<br>
      <strong>Standard Error:</strong> ${props.standerr}%<br>
      <div id="landuse-chart-container">
        <canvas id="landuse-chart" width="300" height="200"></canvas>
      </div>
    `;
    document.getElementById('sidebar-content').innerHTML = html;

    updateLandUseChart(map);
  });

  // --- Default sidebar message if no features clicked ---
  map.on('click', (e) => {
    if (e.defaultPrevented) return;

    const features = map.queryRenderedFeatures(e.point, {
      layers: ['listed-fill', 'ward-canopy', 'ntow-trees', 'buildings-3d']
    });

    if (features.length === 0) {
      document.getElementById('sidebar-content').innerHTML =
        `<p>Select a feature on the map to view details.</p>`;
    }
  });

  // --- On moveend: update summary canopy + land use chart ---
  map.on('moveend', () => {
    updateCanopyInView(map);
    updateLandUseChart(map);
  });
}

// --- Show weighted average canopy in view ---
function updateCanopyInView(map) {
  const features = map.queryRenderedFeatures({ layers: ['ward-canopy'] });

  if (!features.length) {
    document.getElementById('sidebar-content').innerHTML =
      'No canopy data in view.';
    return;
  }

  let totalArea = 0;
  let weightedSum = 0;

  features.forEach(f => {
    const canopyPerc = parseFloat(f.properties.percancov);
    const area = turf.area(f);

    totalArea += area;
    weightedSum += canopyPerc * area;
  });

  const averageCanopy = weightedSum / totalArea;

  document.getElementById('sidebar-content').innerHTML = `
    <strong>Total Canopy Cover in View:</strong><br>
    Weighted Average: ${averageCanopy.toFixed(2)}%<br>
    <div id="landuse-chart-container">
      <canvas id="landuse-chart" width="300" height="200"></canvas>
    </div>
  `;
}

// --- Land Use Chart ---
function updateLandUseChart(map) {
  const features = map.queryRenderedFeatures({ layers: ['landuse-fill'] });

  if (!features.length) {
    const container = document.getElementById('landuse-chart-container');
    if (container) container.innerHTML = 'No land use data in view.';
    return;
  }

  const areaByType = {};

  features.forEach(f => {
    const type = f.properties.landuse?.toLowerCase() || 'unknown';
    const area = turf.area(f);
    areaByType[type] = (areaByType[type] || 0) + area;
  });

  const labels = Object.keys(areaByType);
  const data = labels.map(l => areaByType[l]);
  const backgroundColors = labels.map(l => landUseColors[l] || '#999');

  const canvas = document.getElementById('landuse-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  if (window.landUseChart) {
    window.landUseChart.destroy();
  }
  window.landUseChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: 'Land Use Area (m²)',
        data,
        backgroundColor: backgroundColors
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Land Use Area in View' }
      }
    }
  });
}
