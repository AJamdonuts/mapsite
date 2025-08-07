// Land use chart and canopy stats logic

// Use the expanded color palette from toggles.js
window.landUseColors = {
  residential:        '#f4a261',  // warm orange (used in OSM and Mapbox)
  commercial:        '#e34a33',  // muted red-orange
  industrial:        '#b30000',  // dark red (machinery/industry)
  farmland:          '#fdd49e',  // warm beige/yellow
  park:              '#a1d99b',  // soft green (used in OSM and Mapbox)
  retail:            '#fc9272',  // soft coral (distinguishable from commercial)
  landfill:          '#756bb1',  // purple (uncommon use)
  grass:             '#c7e9c0',  // light green
  meadow:            '#74c476',  // richer green
  recreation_ground: '#41ab5d',  // medium green (more vibrant for sport fields)
  railway:           '#9e9ac8',  // gray-violet (infrastructure)
  allotments:        '#fdae6b',  // orange (growing/agriculture)
  construction:      '#fdd0a2',  // pale orange (under construction)
  orchard:           '#c6dbef',  // light blue (cultivation)
  military:          '#cb181d',   // deep red (warning/secure)
  Unknown:           '#cccccc',
  Other:             '#999999'
};

function setupCharts(map) {
  // Move the updateLandUseChart function inside setupCharts so it has access to map
  function updateLandUseChart() {
    // Always reset the container to ensure the canvas exists
    if (!document.getElementById('landuse-chart')) {
        document.getElementById('landuse-chart-container').innerHTML =
        '<canvas id="landuse-chart" width="300" height="300"></canvas>';
    }

    const features = map.queryRenderedFeatures(
        [[0, 0], [map.getCanvas().width, map.getCanvas().height]],
        { layers: ['landuse-fill'] }
    );

    if (!features.length) {
        // Instead of replacing the whole container, just hide the chart and show a message
        document.getElementById('landuse-chart').style.display = 'none';
        if (!document.getElementById('landuse-chart-message')) {
        const msg = document.createElement('div');
        msg.id = 'landuse-chart-message';
        msg.textContent = 'No land use data in view.';
        document.getElementById('landuse-chart-container').appendChild(msg);
        }
        return;
    } else {
        // Remove the message and show the chart
        const msg = document.getElementById('landuse-chart-message');
        if (msg) msg.remove();
        document.getElementById('landuse-chart').style.display = '';
    }

    const areaByType = {};

    const groupLandUseType = (type) => {
        if (!type) return 'Unknown';
        const t = type.toLowerCase();
        
        // Direct matches for the expanded color palette
        if (t.includes('residential')) return 'residential';
        if (t.includes('commercial')) return 'commercial';
        if (t.includes('industrial')) return 'industrial';
        if (t.includes('farmland') || t.includes('farm')) return 'farmland';
        if (t.includes('park')) return 'park';
        if (t.includes('retail')) return 'retail';
        if (t.includes('landfill')) return 'landfill';
        if (t.includes('grass')) return 'grass';
        if (t.includes('meadow')) return 'meadow';
        if (t.includes('recreation') || t.includes('recreation_ground')) return 'recreation_ground';
        if (t.includes('railway')) return 'railway';
        if (t.includes('allotments') || t.includes('allotment')) return 'allotments';
        if (t.includes('construction')) return 'construction';
        if (t.includes('orchard')) return 'orchard';
        if (t.includes('military')) return 'military';
        
        // If no match found, return the original type (it might be exactly one of our types)
        return window.landUseColors[type] ? type : 'Unknown';
    };

    features.forEach(f => {
        const type = groupLandUseType(f.properties.landuse);
        const area = turf.area(f);
        areaByType[type] = (areaByType[type] || 0) + area;
    });

    const totalArea = Object.values(areaByType).reduce((a, b) => a + b, 0);
    const threshold = 0.02; // 2%
    const grouped = {};
    let otherArea = 0;

    for (const [type, area] of Object.entries(areaByType)) {
    if (area / totalArea < threshold) {
        otherArea += area;
    } else {
        grouped[type] = area;
    }
    }
    if (otherArea > 0) grouped['Other'] = otherArea;

    const labels = Object.keys(grouped);
    const data = labels.map(l => grouped[l]);
    const backgroundColors = labels.map(l => window.landUseColors[l] || '#999');

    const ctx = document.getElementById('landuse-chart')?.getContext('2d');
    if (!ctx) {
        console.warn('Chart canvas not found.');
        return;
    }

    if (window.landUseChart) {
        window.landUseChart.data.labels = labels;
        window.landUseChart.data.datasets[0].data = data;
        window.landUseChart.data.datasets[0].backgroundColor = backgroundColors;
        window.landUseChart.update();
    } else {
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
  }

  // Make updateLandUseChart available globally
  window.updateLandUseChart = updateLandUseChart;
  
  // Set up the chart update events
  map.on('moveend', updateLandUseChart);
  map.on('load', updateLandUseChart);
}

window.setupCharts = setupCharts; // Export function for use in main.js