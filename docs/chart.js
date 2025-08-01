
// Land use chart and canopy stats logic

window.landUseColors = {
  residential: '#fbb03b',
  industrial: '#223b53',
  commercial: '#e55e5e',
  forest: '#228B22',
  farmland: '#a0522d',
  grass: '#7cfc00',
  park: '#76c893',
  quarry: '#6e6e6e',
  Unknown: '#cccccc',
  Other: '#999999'
};
    // --- LAND USE CHART ---
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
        if (t.includes('residential')) return 'residential';
        if (t.includes('industrial')) return 'industrial';
        if (t.includes('commercial')) return 'commercial';
        if (t.includes('forest')) return 'forest';
        if (t.includes('farmland')) return 'farmland';
        if (t.includes('grass')) return 'grass';
        if (t.includes('park')) return 'park';
        if (t.includes('quarry')) return 'quarry';
        return type;
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
    const backgroundColors = labels.map(l => landUseColors[l] || '#999');

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

function setupCharts(map) {
}
window.setupCharts = setupCharts; // Export function for use in main.js
window.updateLandUseChart = updateLandUseChart; // Export function for use in main.js