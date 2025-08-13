function setupToggles(map) {
  
    // All checkbox event listeners for toggling layers

    // --- LAYER VISIBILITY TOGGLES ---

  // Function to update Heritage legend visibility
  function updateHistoricLegendVisibility() {
      const listed = document.getElementById('toggleListed')?.checked || false;
      const smonuments = document.getElementById('toggleSMonuments')?.checked || false;
      const parks = document.getElementById('toggleHeritageParks')?.checked || false;
      const whs = document.getElementById('toggleWorldHeritage')?.checked || false;
      const conservation = document.getElementById('toggleConservationAreas')?.checked || false;
      const article4 = document.getElementById('toggleArticle4')?.checked || false;

      const showLegend = listed || smonuments || parks || whs || conservation || article4;
      document.getElementById('historic-legend').style.display = showLegend ? 'block' : 'none';
  }

  function toggleLandUseType(type, color) {
      map.setPaintProperty(`landuse_${type}`, 'fill-color', color);
  }

  function updateLandUseLayer() {
      // Update fill layer
      if (map.getLayer('landuse-fill')) {
          map.setPaintProperty('landuse-fill', 'fill-color', [
              'case',
              ['in', ['get', 'landuse'], ['literal', window.activeLandUseTypes]],
              [
                  'match',
                  ['get', 'landuse'],
                  ...Object.entries(window.landUseColors || {}).flat(),
                  window.inactiveColor || '#cccccc'
              ],
              window.inactiveColor || '#cccccc'
          ]);
      }

      // Update outline layer with darker colors or just black
      if (map.getLayer('landuse-outline')) {
        map.setPaintProperty('landuse-outline', 'line-color', '#000000'); // Black outline
    }
  }

  function updateGeneralLandUseLegendVisibility() {
      const residential = document.getElementById('toggleResidential')?.checked || false;
      const commercial = document.getElementById('toggleCommercial')?.checked || false;
      const industrial = document.getElementById('toggleIndustrial')?.checked || false;
      const farmland = document.getElementById('toggleFarmland')?.checked || false;
      const park = document.getElementById('togglePark')?.checked || false;

      const showLegend = residential || commercial || industrial || farmland || park;
      const generalLanduseLegend = document.getElementById('general-landuse-legend');
      if (generalLanduseLegend) {
          generalLanduseLegend.style.display = showLegend ? 'block' : 'none';
      }
  }
  

  // Function to update land use legend visibility
  function updateLandUseLegendVisibility() {
      const residential = document.getElementById('toggleResidential')?.checked || false;
      const builtUpAreas = document.getElementById('toggleBuiltUpAreas')?.checked || false;
      const agricultural = document.getElementById('toggleAgricultural')?.checked || false;
      const lpb = document.getElementById('toggleLPB')?.checked || false;

      const showLegend = residential || builtUpAreas || agricultural || lpb;
      document.getElementById('landuse-legend').style.display = showLegend ? 'block' : 'none';
  }
  // Function to update land use legend visibility
  function updateSocialInfrastructureLegendVisibility() {
      const hospitals = document.getElementById('toggleHospitals')?.checked || false;
      const schools = document.getElementById('toggleSchools')?.checked || false;
      const stadiums = document.getElementById('toggleStadiums')?.checked || false;
      const cemeteries = document.getElementById('toggleCemeteries')?.checked || false;
      const educational = document.getElementById('toggleEducational')?.checked || false;
      const amenity = document.getElementById('toggleAmenity')?.checked || false;
      const tourism = document.getElementById('toggleTourism')?.checked || false;
      const shop = document.getElementById('toggleShop')?.checked || false;

      const showLegend = hospitals || schools || stadiums || cemeteries || educational || amenity || tourism || shop;
      document.getElementById('social-infrastructure-legend').style.display = showLegend ? 'block' : 'none';
  }


// Hospitals
  document.getElementById('toggleHospitals').addEventListener('change', function(e) {
      toggleLandUseType('hospital', e.target.checked ? '#f28cb1' : '#cccccc');
      map.setLayoutProperty('hospital-outline', 'visibility', e.target.checked ? 'visible' : 'none');
      updateSocialInfrastructureLegendVisibility(); // Keep this
  });

  // Schools
  document.getElementById('toggleSchools').addEventListener('change', function(e) {
      toggleLandUseType('school', e.target.checked ? '#e6cc00' : '#cccccc');
      map.setLayoutProperty('school-outline', 'visibility', e.target.checked ? 'visible' : 'none');
      updateSocialInfrastructureLegendVisibility(); // Keep this
  });

  // Stadiums
  document.getElementById('toggleStadiums').addEventListener('change', function(e) {
      toggleLandUseType('stadium', e.target.checked ? '#a1d99b' : '#cccccc');
      map.setLayoutProperty('stadium-outline', 'visibility', e.target.checked ? 'visible' : 'none');
      updateSocialInfrastructureLegendVisibility(); // Keep this
  });

  // Cemeteries
  document.getElementById('toggleCemeteries').addEventListener('change', function(e) {
      if (e.target.checked) {
          map.setPaintProperty('landuse_cemetery', 'fill-pattern', 'blackHatch');
          map.setPaintProperty('landuse_cemetery', 'fill-opacity', 0.7);
          map.setLayoutProperty('cemetery-outline', 'visibility', 'visible');
      } else {
          map.setPaintProperty('landuse_cemetery', 'fill-pattern', undefined);
          map.setPaintProperty('landuse_cemetery', 'fill-color', '#cccccc');
          map.setPaintProperty('landuse_cemetery', 'fill-opacity', 0.3);
          map.setLayoutProperty('cemetery-outline', 'visibility', 'none');
      }
      updateSocialInfrastructureLegendVisibility(); // Keep this
  });

  // Individual toggles for general land use types
document.getElementById('toggleResidential')?.addEventListener('change', (e) => {
    toggleLandUseType('residential', e.target.checked ? '#f4a261' : '#cccccc');
    updateGeneralLandUseLegendVisibility();
    updateLandUseLegendVisibility();
});

// Toggle Land Use 
  document.getElementById('toggleLanduse')?.addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    
    if (map.getLayer('landuse-fill')) {
        map.setLayoutProperty('landuse-fill', 'visibility', visibility);
    }
    if (map.getLayer('landuse-outline')) {
        map.setLayoutProperty('landuse-outline', 'visibility', visibility);
    }
    
    // If turning on, enable all land use types by default
    if (e.target.checked) {
        window.activeLandUseTypes = ['residential', 'commercial', 'industrial', 'farmland', 'park'];
        // Check all individual checkboxes
        document.getElementById('toggleResidential').checked = true;
        document.getElementById('toggleCommercial').checked = true;
        document.getElementById('toggleIndustrial').checked = true;
        document.getElementById('toggleFarmland').checked = true;
        document.getElementById('togglePark').checked = true;
    } else {
        // If turning off, clear all active types
        window.activeLandUseTypes = [];
        // Uncheck all individual checkboxes
        document.getElementById('toggleResidential').checked = false;
        document.getElementById('toggleCommercial').checked = false;
        document.getElementById('toggleIndustrial').checked = false;
        document.getElementById('toggleFarmland').checked = false;
        document.getElementById('togglePark').checked = false;
    }
    
    updateLandUseLayer();
    updateLandUseLegendVisibility();
    updateGeneralLandUseLegendVisibility();
  });


  // Update Local Plan Boundaries toggle to include legend update
  document.getElementById('toggleLPB').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('local-plan-boundaries')) {
      map.setLayoutProperty('local-plan-boundaries', 'visibility', visibility);
    }
    updateLandUseLegendVisibility();
  });

    // Toggle Built Up Areas layer
  document.getElementById('toggleBuiltUpAreas').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('built-up-areas')) {
      map.setLayoutProperty('built-up-areas', 'visibility', visibility);
    }
    updateLandUseLegendVisibility();
  });

    // Toggle Educational Establishments layer
  document.getElementById('toggleEducational').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('educational-establishments')) {
      map.setLayoutProperty('educational-establishments', 'visibility', visibility);
      const legend = document.getElementById('social-infrastructure-legend');
      legend.style.display = visibility === 'visible' ? 'block' : 'none';
    }
  });

  // Toggle Agricultural Land layer
  document.getElementById('toggleAgricultural').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('agricultural-land')) {
      map.setLayoutProperty('agricultural-land', 'visibility', visibility);
    }
    updateLandUseLegendVisibility();
  });


    // Toggle Roads layer
    document.getElementById('toggleRoads').addEventListener('change', (e) => {
      const visibility = e.target.checked ? 'visible' : 'none';
      if (map.getLayer('road-lines')) map.setLayoutProperty('road-lines', 'visibility', visibility);
    });

    // Toggle Amenity layer
    document.getElementById('toggleAmenity').addEventListener('change', function () {
    const visibility = this.checked ? 'visible' : 'none';
    if (map.getLayer('pois-amenity')) map.setLayoutProperty('pois-amenity', 'visibility', visibility);
    const legend = document.getElementById('social-infrastructure-legend');
    legend.style.display = visibility === 'visible' ? 'block' : 'none';
    });

    // Toggle Tourism layer
    document.getElementById('toggleTourism').addEventListener('change', function () {
    const visibility = this.checked ? 'visible' : 'none';
    if (map.getLayer('pois-tourism')) map.setLayoutProperty('pois-tourism', 'visibility', visibility);
    const legend = document.getElementById('social-infrastructure-legend');
    legend.style.display = visibility === 'visible' ? 'block' : 'none';
    });

    // Toggle Shop layer
    document.getElementById('toggleShop').addEventListener('change', function () {
    const visibility = this.checked ? 'visible' : 'none';
    if (map.getLayer('pois-shop')) map.setLayoutProperty('pois-shop', 'visibility', visibility);
    const legend = document.getElementById('social-infrastructure-legend');
    legend.style.display = visibility === 'visible' ? 'block' : 'none';
    });

  // Toggle base POIs
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

  // Toggle Conservation Areas layer
  document.getElementById('toggleConservationAreas').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('conservation-areas')) {
      map.setLayoutProperty('conservation-areas', 'visibility', visibility);
      map.setLayoutProperty('conservation-areas-outline', 'visibility', visibility);
    }
    updateHistoricLegendVisibility();

  });

  // Replace the Article 4 toggle with this standard format:
  document.getElementById('toggleArticle4').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('article-4-direction')) {
      map.setLayoutProperty('article-4-direction', 'visibility', visibility);
    }
    if (map.getLayer('article-4-direction-outline')) {
      map.setLayoutProperty('article-4-direction-outline', 'visibility', visibility);
    }
    updateHistoricLegendVisibility();
  });


  // Toggle Ancient Woodland layer
  document.getElementById('toggleAncientWoodland').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('ancient-woodland')) {
      map.setLayoutProperty('ancient-woodland', 'visibility', visibility);
    }
    if (map.getLayer('ancient-woodland-outline')) {
      map.setLayoutProperty('ancient-woodland-outline', 'visibility', visibility);
    }
  });

  // Toggle Area of Outstanding Natural Beauty (AONB) layer
  document.getElementById('toggleAONB').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('aonb-fill')) {
      map.setLayoutProperty('aonb-fill', 'visibility', visibility);
    }
    if (map.getLayer('aonb-outline')) {
      map.setLayoutProperty('aonb-outline', 'visibility', visibility);
    }
  });

   // Toggle Local Nature Reserves (LNR) layer
  document.getElementById('toggleLNR').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('local-nature-reserves')) {
      map.setLayoutProperty('local-nature-reserves', 'visibility', visibility);
    }
    if (map.getLayer('local-nature-reserves-outline')) {
      map.setLayoutProperty('local-nature-reserves-outline', 'visibility', visibility);
    }
  });

    // Toggle National Nature Reserves (NNR) layer
  document.getElementById('toggleNNR').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('national-nature-reserves')) {
      map.setLayoutProperty('national-nature-reserves', 'visibility', visibility);
    }
    if (map.getLayer('national-nature-reserves-outline')) {
      map.setLayoutProperty('national-nature-reserves-outline', 'visibility', visibility);
    }
  });

      // Toggle Canopy layer
    document.getElementById('toggleCanopy').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('ward-canopy')) {
      map.setLayoutProperty('ward-canopy', 'visibility', visibility);
    }
    // Show/hide the refresh button
    const refreshBtn = document.getElementById('refresh-canopy-btn');
    if (refreshBtn) {
      refreshBtn.style.display = e.target.checked ? 'block' : 'none';
    }
  });

    // Toggle Woodland
    document.getElementById('toggleWoodland').addEventListener('change', function (e) {
    const visible = e.target.checked;
    if (visible) {
      map.setPaintProperty('landcover_wood', 'fill-color', originalLandcoverStyles.wood['fill-color']);
    } else {
      map.setPaintProperty('landcover_wood', 'fill-color', '#aaaaaa');
    }
  });

  // Toggle Grass Area
    document.getElementById('toggleGrassArea').addEventListener('change', function (e) {
    const visible = e.target.checked;
    if (visible) {
      map.setPaintProperty('landcover_grass', 'fill-color', originalLandcoverStyles.grass['fill-color']);
    } else {
      map.setPaintProperty('landcover_grass', 'fill-color', '#cccccc');
    }
  });

  // Toggle Tree Preservation Zones
  document.getElementById('toggleTPZ').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('tree-preservation-zones')) {
      map.setLayoutProperty('tree-preservation-zones', 'visibility', visibility);
    }
  });

  // Toggle NTOW (National Trust Open Woodland)
  document.getElementById('toggleNTOW').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('ntow-trees')) {
      map.setLayoutProperty('ntow-trees', 'visibility', visibility);
    }
    const legend = document.getElementById('ntow-legend');
    legend.style.display = visibility === 'visible' ? 'block' : 'none';
  });



  // Toggle Transport Access layer
  document.getElementById('toggleTransportAccess').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('public-transport-nodes')) {
      map.setLayoutProperty('public-transport-nodes', 'visibility', visibility);
    }
  });

  // Toggle PROW (Public Rights of Way) layer
  document.getElementById('toggleprow').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    for (const id of [
      'prow-footpath',
      'prow-bridleway',
      'prow-restricted-byway',
      'prow-byway-open'
    ]) {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', visibility);
      }
    }
    // Toggle the legend display
    const legend = document.getElementById('prow-legend');
    if (legend) legend.style.display = visibility === 'visible' ? 'block' : 'none';
  });


  // Toggle Flood Risk layer
  document.getElementById('toggleFloodRisk').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('flood-risk')) {
      map.setLayoutProperty('flood-risk', 'visibility', visibility);
    }
  });

  // Toggle Hydrogelogy layer
  document.getElementById('togglehydrogelogy').addEventListener('change', (e) => {
    const visible = e.target.checked;
    if (map.getLayer('hydrogelogy')) {
      map.setLayoutProperty('hydrogelogy', 'visibility', visible ? 'visible' : 'none');
    }
    const legend = document.getElementById('hydrogeology-legend');
    if (legend) legend.style.display = visible ? 'block' : 'none';
  });

  // Toggle Contour layer
  document.getElementById('toggleContours').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('contour-lines-index')) {
      map.setLayoutProperty('contour-lines-index', 'visibility', visibility);
    }
    if (map.getLayer('contour-lines-ordinary')) {
      map.setLayoutProperty('contour-lines-ordinary', 'visibility', visibility);
    }
    if (map.getLayer('contour-points')) {
      map.setLayoutProperty('contour-points', 'visibility', visibility);
    }
    if (map.getLayer('contour-labels')) {
      map.setLayoutProperty('contour-labels', 'visibility', visibility);
    }

  });

  // Toggle Streetlighting layer
  document.getElementById('toggleStreetlighting')?.addEventListener('change', (e) => {
  const visibility = e.target.checked ? 'visible' : 'none';

  // Toggle all streetlighting point types
  if (map.getLayer('streetlighting-signs')) {
    map.setLayoutProperty('streetlighting-signs', 'visibility', visibility);
  }
  if (map.getLayer('streetlighting-columns')) {
    map.setLayoutProperty('streetlighting-columns', 'visibility', visibility);
  }
  if (map.getLayer('streetlighting-others')) {
    map.setLayoutProperty('streetlighting-others', 'visibility', visibility);
  }

  // Toggle buffer and shadow layers
  if (map.getLayer('streetlighting-buffer')) {
    map.setLayoutProperty('streetlighting-buffer', 'visibility', visibility);
  }
  if (map.getLayer('streetlighting-buffer-outline')) {
    map.setLayoutProperty('streetlighting-buffer-outline', 'visibility', visibility);
  }
  if (map.getLayer('streetlighting-shadows')) {
    map.setLayoutProperty('streetlighting-shadows', 'visibility', visibility);
  }

  // Show/hide the legend
  document.getElementById('streetlighting-legend').style.display = e.target.checked ? 'block' : 'none';
});




// TOGGLE BUTTON for collapsing controls
  const btn = document.querySelector('.toggle-button');
  const controls = document.querySelector('.layer-controls');
  if (btn && controls) {
    btn.addEventListener('click', () => {
      controls.classList.toggle('collapsed');
    });
  }

  // GROUP HEADER COLLAPSE
  document.querySelectorAll('.group-header').forEach(header => {
    // Collapse all groups by default
    const content = header.nextElementSibling;
    content.classList.add('collapsed');
    header.classList.remove('expanded');

    header.addEventListener('click', () => {
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

  // Add the debug code here where map is available
  // Add this temporarily to see what values you have
  map.on('click', 'landuse-fill', (e) => {
      console.log('Land use value:', e.features[0].properties.landuse);
      console.log('All properties:', e.features[0].properties);
  });

  function hideBoreholeScanKey() {
  const key = document.getElementById('borehole-scan-key');
  if (key) key.remove();
}

// Toggle Boreholes layer and scan key
document.getElementById('toggleBoreholes').addEventListener('change', (e) => {
  const visibility = e.target.checked ? 'visible' : 'none';
  if (map.getLayer('boreholes')) {
    map.setLayoutProperty('boreholes', 'visibility', visibility);
  }
  if (e.target.checked) {
    showBoreholeScanKey();
  } else {
    hideBoreholeScanKey();
  }
});
function showBoreholeScanKey() {
  if (!document.getElementById('borehole-scan-key')) {
    document.getElementById('sidebar-content').innerHTML += `
      <div id="borehole-scan-key" style="margin: 16px 0;">
        <div style="display: flex; flex-direction: column; align-items: center;">
          <!-- Gradient bar -->
          <div style="
            height: 16px;
            width: 160px;
            background: linear-gradient(to right, #a6cee3 0%, #1f78b4 50%, #08306b 100%);
            border-radius: 8px;
            border: 1px solid #aaa;
            margin-bottom: 8px;
            position: relative;
          "></div>
          <!-- Arrows and labels -->
          <div style="display: flex; width: 160px; justify-content: space-between; position: relative;">
            <div style="display: flex; flex-direction: column; align-items: center; width: 0;">
              <span style="font-size: 16px; color: #333;">&#8593;</span>
              <span style="font-size: 12px; margin-top: 2px;">1900</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; width: 0;">
              <span style="font-size: 16px; color: #333;">&#8593;</span>
              <span style="font-size: 12px; margin-top: 2px;">2000</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; width: 0;">
              <span style="font-size: 16px; color: #333;">&#8593;</span>
              <span style="font-size: 12px; margin-top: 2px;">2023</span>
            </div>
          </div>
          <!-- Description -->
          <div style="font-size: 11px; color: #666; margin-top: 18px;">
            Borehole scan year (lighter = older, darker = newer)
          </div>
        </div>
      </div>
    `;
  }
}
} 

window.setupToggles = setupToggles;
// Remove this test code - don't keep it permanently:
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
  military:          '#cb181d'   // deep red (warning/secure)
};

window.activeLandUseTypes = ['residential', 'commercial', 'industrial', 'farmland', 'park', 'retail', 'landfill', 'grass', 'meadow', 'recreation_ground', 'railway', 'allotments', 'construction', 'orchard', 'military'];
window.inactiveColor = '#cccccc';

