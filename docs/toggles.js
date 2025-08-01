function setupToggles(map) {
  
    // All checkbox event listeners for toggling layers
    // --- LAYER VISIBILITY TOGGLES ---

  function updateHistoricLegendVisibility() {
      const listed = document.getElementById('toggleListed').checked;
      const smonuments = document.getElementById('toggleSMonuments').checked;
      const parks = document.getElementById('toggleHeritageParks').checked;
      const whs = document.getElementById('toggleWorldHeritage').checked;

      const showLegend = listed || smonuments || parks || whs;
      document.getElementById('historic-legend').style.display = showLegend ? 'block' : 'none';
  }


    // Toggle layers when checkboxes change

    document.getElementById('togglePROW').addEventListener('change', (e) => {
      const visibility = e.target.checked ? 'visible' : 'none';
      if (map.getLayer('prow-lines')) map.setLayoutProperty('prow-lines', 'visibility', visibility);
    });

    document.getElementById('toggleRoads').addEventListener('change', (e) => {
      const visibility = e.target.checked ? 'visible' : 'none';
      if (map.getLayer('road-lines')) map.setLayoutProperty('road-lines', 'visibility', visibility);
    });

    document.getElementById('toggleAmenity').addEventListener('change', function () {
    const visibility = this.checked ? 'visible' : 'none';
    if (map.getLayer('pois-amenity')) map.setLayoutProperty('pois-amenity', 'visibility', visibility);
    });

    document.getElementById('toggleTourism').addEventListener('change', function () {
    const visibility = this.checked ? 'visible' : 'none';
    if (map.getLayer('pois-tourism')) map.setLayoutProperty('pois-tourism', 'visibility', visibility);
    });

    document.getElementById('toggleShop').addEventListener('change', function () {
    const visibility = this.checked ? 'visible' : 'none';
    if (map.getLayer('pois-shop')) map.setLayoutProperty('pois-shop', 'visibility', visibility);
    });

    document.getElementById('toggleCanopy').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('ward-canopy')) {
      map.setLayoutProperty('ward-canopy', 'visibility', visibility);
    }
  });

    document.getElementById('toggleWoodland').addEventListener('change', function (e) {
    const visible = e.target.checked;

    if (visible) {
      map.setPaintProperty('landcover_wood', 'fill-color', originalLandcoverStyles.wood['fill-color']);
    } else {
      map.setPaintProperty('landcover_wood', 'fill-color', '#aaaaaa');
    }
  });


    document.getElementById('toggleGrassArea').addEventListener('change', function (e) {
    const visible = e.target.checked;

    if (visible) {
      map.setPaintProperty('landcover_grass', 'fill-color', originalLandcoverStyles.grass['fill-color']);
    } else {
      map.setPaintProperty('landcover_grass', 'fill-color', '#cccccc');
    }
  });



  document.getElementById('toggleNTOW').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';

    // Toggle NTOW map layer visibility
    if (map.getLayer('ntow-trees')) {
      map.setLayoutProperty('ntow-trees', 'visibility', visibility);
    }

    // Show/hide legend in sidebar
    const legend = document.getElementById('ntow-legend');
    legend.style.display = visibility === 'visible' ? 'block' : 'none';
  });

  document.getElementById('toggleBasePOIs').addEventListener('change', function(e) {
    const visibility = e.target.checked ? 'visible' : 'none';

    const basePoiLayers = [
      'poi_z10',
      'poi_z11',
      'poi_z12',
      'poi_z13',
      'poi_z14',
      'poi_z15',
      'poi_z16'
    ];

    basePoiLayers.forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', visibility);
      }
    });
  });

  // Toggle listed buildings layer
  document.getElementById('toggleListed').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('listed-point')) {
      map.setLayoutProperty('listed-point', 'visibility', visibility);
      map.setLayoutProperty('listed-highlight', 'visibility', visibility); // Show highlight layer too
    }
    updateHistoricLegendVisibility();
  });

  // Toggle scheduled monuments layer
  document.getElementById('toggleSMonuments').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('smonuments-fill')) {
      map.setLayoutProperty('smonuments-fill', 'visibility', visibility);
    }
    if (map.getLayer('smonuments-outline')) {
      map.setLayoutProperty('smonuments-outline', 'visibility', visibility);
    }
    updateHistoricLegendVisibility();
  });

  // Toggle heritage parks layer
  document.getElementById('toggleHeritageParks').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('heritage-parks-fill')) {
      map.setLayoutProperty('heritage-parks-fill', 'visibility', visibility);
    }
    if (map.getLayer('heritage-parks-outline')) {
      map.setLayoutProperty('heritage-parks-outline', 'visibility', visibility);
    }
    updateHistoricLegendVisibility();
  });

  // Toggle World Heritage Sites layer
  document.getElementById('toggleWorldHeritage').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('whs-core')) {
      map.setLayoutProperty('whs-core', 'visibility', visibility);
    }
    if (map.getLayer('whs-buffer')) {
      map.setLayoutProperty('whs-buffer', 'visibility', visibility);
    }
    updateHistoricLegendVisibility();
  });
  



  document.getElementById('toggleLanduse').addEventListener('change', (e) => {
    const visible = e.target.checked;
    const visibility = visible ? 'visible' : 'none';

    // Toggle visibility of the general landuse layers
    ['landuse-fill', 'landuse-outline'].forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', visibility);
      }
    });

    // Toggle colors of specific landuse types
    map.setPaintProperty('landuse_cemetery', 'fill-color', visible ? originalLanduseStyles.cemetery['fill-color'] : '#bbbbbb');
    map.setPaintProperty('landuse_hospital', 'fill-color', visible ? originalLanduseStyles.hospital['fill-color'] : '#bbbbbb');
    map.setPaintProperty('landuse_school',   'fill-color', visible ? originalLanduseStyles.school['fill-color']   : '#bbbbbb');
    map.setPaintProperty('landuse_stadium',  'fill-color', visible ? originalLanduseStyles.stadium['fill-color']  : '#bbbbbb');
  });

  // --- TOGGLE BUTTON for collapsing controls ---
  const btn = document.querySelector('.toggle-button');
  const controls = document.querySelector('.layer-controls');
  if (btn && controls) {
    btn.addEventListener('click', () => {
      controls.classList.toggle('collapsed');
    });
  }

  // --- GROUP HEADER COLLAPSE ---
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
}
window.setupToggles = setupToggles;