
/* ============================================================================
   MAP LAYER VISIBILITY TOGGLES & LEGEND MANAGEMENT
   ============================================================================

   This script manages the visibility of Maplibre GL layers and the display of map legends
   based on user interaction with checkbox controls in the UI. It is designed for a web map
   with multiple layers (land use, heritage, environment, transport, etc.).

   HOW TO USE / INTEGRATE:
   - Each map layer group (e.g., heritage, land use) should have corresponding checkboxes in the HTML.
   - Checkbox IDs must match those referenced in this script (e.g., 'toggleArticle4', 'toggleLanduse').
   - Each legend should have an element with the expected ID (e.g., 'historic-legend').
   - Call `setupToggles(map)` after Maplibre map is initialised.

   MAIN FEATURES:
   - Toggles layer visibility on checkbox change
   - Updates legend visibility based on active layers
   - Handles color changes for certain layers (e.g., land use types)
   - Modular configuration for easy extension

   STRUCTURE:
     1. Utility Functions (Legend Updates, Layer Color Updates)
     2. Land Use Layers
     3. Social Infrastructure Layers
     4. Heritage Layers
     5. Environmental & Natural Layers
     6. Transport & Access Layers
     7. Error Handling

   MAINTAINER NOTES:
   - Ensure all referenced IDs exist in your HTML to avoid runtime errors.
   - Extend layer groups by adding to the config objects.
   - Debug/test code is marked and should be removed for production.
============================================================================ */



/**
 * Main setup function for layer toggles and legend management.
 */
function setupToggles(map) {
  
// ============================================================================
// 1. UTILITY FUNCTIONS
// ============================================================================



  /**
   * Show/hide a legend element if any of the associated toggles are checked.
   */
  function updateLegendVisibility(legendId, toggleIds) {
    const showLegend = toggleIds.some(id => document.getElementById(id)?.checked);
    const legend = document.getElementById(legendId);
    if (legend) legend.style.display = showLegend ? 'block' : 'none';
  }


  // Configuration for all legends and their controlling toggles.
  // Add new legend groups here as needed.
  const legendConfigs = [
    {
      legendId: 'historic-legend',
      toggles: {
        toggleArticle4: ['article-4-direction', 'article-4-direction-outline'],
        toggleConservationAreas: ['conservation-areas', 'conservation-areas-outline'],
        toggleHeritageParks: ['heritage-parks-fill', 'heritage-parks-outline'],
        toggleListed: ['listed-point', 'listed-highlight'],
        toggleSMonuments: ['smonuments-fill', 'smonuments-outline'],
        toggleWorldHeritage: ['whs-core', 'whs-buffer']
      }
    },
    {
      legendId: 'landuse-legend',
      toggles: {
        toggleResidential: ['landuse_residential'],
        toggleBuiltUpAreas: ['built-up-areas'],
        toggleLPB: ['local-plan-boundaries']
      }
    },
    {
      legendId: 'agricultural-legend',
      toggles: {
        toggleAgricultural: ['agricultural-land']
      }
    },
    {
      legendId: 'ntow-legend',
      toggles: {
        toggleNTOW: ['ntow-trees']
      }
    },
    {
      legendId: 'social-infrastructure-legend',
      toggles: {
        toggleHospitals: ['hospital-outline'],
        toggleSchools: ['school-outline'],
        toggleStadiums: ['stadium-outline'],
        toggleCemeteries: ['landuse_cemetery', 'cemetery-outline'],
        toggleEducational: ['educational-establishments'],
        toggleAmenity: ['pois-amenity'],
        toggleTourism: ['pois-tourism'],
        toggleShop: ['pois-shop']
      }
    },
    {
  legendId: 'hydrogelogy-legend',
      toggles: {
        togglehydrogelogy: ['hydrogelogy']
      }
    },
    {
      legendId: 'prow-legend',
      toggles: {
        toggleprow: ['prow-footpath', 'prow-bridleway', 'prow-restricted-byway', 'prow-byway-open']
      }
    }
  ];

  // Attach event listeners for each legend config
  // Each checkbox toggles its layers and updates the legend visibility
  legendConfigs.forEach(({ legendId, toggles }) => {
    Object.entries(toggles).forEach(([checkboxId, layerIds]) => {
      document.getElementById(checkboxId)?.addEventListener('change', (e) => {
        // Toggle layers on/off
        const visibility = e.target.checked ? 'visible' : 'none';
        layerIds.forEach(id => {
          if (map.getLayer(id)) {
            map.setLayoutProperty(id, 'visibility', visibility);
          }
        });
        // Update legend visibility for this group
        updateLegendVisibility(legendId, Object.keys(toggles));
      });
    });
  });


  /**
   * Change the color of a specific land use type layer.
   */
  function toggleLandUseType(type, color) {
      map.setPaintProperty(`landuse_${type}`, 'fill-color', color);
  }


  /**
   * Update the main land use fill and outline layers based on active types and colors.
   * Uses global window.landUseColors and window.activeLandUseTypes.
   */
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

// ============================================================================
// 1. HERITAGE & DESIGNATION LAYERS
// ============================================================================


function toggleLayers(layerIds, checked) {
  const visibility = checked ? 'visible' : 'none';
  layerIds.forEach(id => {
    if (map.getLayer(id)) {
      map.setLayoutProperty(id, 'visibility', visibility);
    }
  });
}

const heritageLayerConfig = {
  toggleArticle4: ['article-4-direction', 'article-4-direction-outline'],
  toggleConservationAreas: ['conservation-areas', 'conservation-areas-outline'],
  toggleHeritageParks: ['heritage-parks-fill', 'heritage-parks-outline'],
  toggleListed: ['listed-point', 'listed-highlight'],
  toggleSMonuments: ['smonuments-fill', 'smonuments-outline'],
  toggleWorldHeritage: ['whs-core', 'whs-buffer']
};

Object.entries(heritageLayerConfig).forEach(([checkboxId, layerIds]) => {
  document.getElementById(checkboxId)?.addEventListener('change', (e) => {
    toggleLayers(layerIds, e.target.checked);
    updateHistoricLegendVisibility();
  });
});


  // ============================================================================
// 2. LAND USE & PLANNING LAYER TOGGLES (Refactored)
// ============================================================================



function toggleLayer(layerId, visible) {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
  }
}


// Helper function to toggle a legend element
// Only show if at least one relevant layer is visible
function updateLanduseLegend() {
  const visible = landUseTypes.some(type => document.getElementById(`toggle${type}`)?.checked) || 
                  document.getElementById('toggleBuiltUpAreas')?.checked ||
                  document.getElementById('toggleLPB')?.checked;
  toggleLegend('landuse-legend', visible);
}


function toggleLegend(legendId, visible) {
  const legend = document.getElementById(legendId);
  if (legend) legend.style.display = visible ? 'block' : 'none';
}

// Agricultural Land
document.getElementById('toggleAgricultural')?.addEventListener('change', (e) => {
  toggleLayer('agricultural-land', e.target.checked);
  toggleLegend('agricultural-legend', e.target.checked);
});

// Built Up Areas
document.getElementById('toggleBuiltUpAreas')?.addEventListener('change', (e) => {
  toggleLayer('built-up-areas', e.target.checked);
  updateLanduseLegend();
});

// Land Use
const landUseTypes = ['Residential', 'Commercial', 'Industrial', 'Farmland', 'Park'];

document.getElementById('toggleLanduse')?.addEventListener('change', (e) => {
  const checked = e.target.checked;

  toggleLayer('landuse-fill', checked);
  toggleLayer('landuse-outline', checked);

  // Update all individual land use checkboxes
  landUseTypes.forEach(type => {
    const checkbox = document.getElementById(`toggle${type}`);
    if (checkbox) checkbox.checked = checked;
  });

  // Update active land use types
  window.activeLandUseTypes = checked ? landUseTypes.map(t => t.toLowerCase()) : [];

  updateLandUseLayer();
  updateLanduseLegend();
});


// Individual Land Use Toggles
// Each checkbox changes the color of its land use layer and updates the legend
landUseTypes.forEach(type => {
  document.getElementById(`toggle${type}`)?.addEventListener('change', (e) => {
    const colorMap = {
      Residential: '#f4a261',
      Commercial: '#2a9d8f',
      Industrial: '#e76f51',
      Farmland: '#a8dadc',
      Park: '#81b29a'
    };
    toggleLandUseType(type.toLowerCase(), e.target.checked ? colorMap[type] : '#cccccc');
    updateLanduseLegend();
  });
});

// Local Plan Boundaries
document.getElementById('toggleLPB')?.addEventListener('change', (e) => {
  toggleLayer('local-plan-boundaries', e.target.checked);
  updateLanduseLegend();
});


// Streetlighting layers group
const streetlightingLayers = [
  'streetlighting-signs',
  'streetlighting-columns',
  'streetlighting-others',
  'streetlighting-buffer',
  'streetlighting-buffer-outline',
  'streetlighting-shadows'
];

document.getElementById('toggleStreetlighting')?.addEventListener('change', (e) => {
  const checked = e.target.checked;
  streetlightingLayers.forEach(layer => toggleLayer(layer, checked));
  toggleLegend('streetlighting-legend', checked);
});

// ============================================================================
// 3. NATURAL ENVIRONMENT LAYER TOGGLES
// ============================================================================


// Config: standard visibility toggles
const naturalLayerConfig = {
  toggleAncientWoodland: ['ancient-woodland', 'ancient-woodland-outline'],
  toggleAONB: ['aonb-fill', 'aonb-outline'],
  toggleLNR: ['local-nature-reserves', 'local-nature-reserves-outline'],
  toggleNNR: ['national-nature-reserves', 'national-nature-reserves-outline'],
  toggleTPZ: ['tree-preservation-zones']
};

const naturalLegendMap = {
  toggleAncientWoodland: 'ancient-woodland-legend',
  toggleAONB: 'aonb-legend',
  toggleLNR: 'lnr-legend',
  toggleNNR: 'nnr-legend',
  toggleTPZ: 'tpz-legend',
  toggleGrassArea: 'grass-area-legend',
  toggleWoodland: 'woodland-legend'
};


/**
 * Show/hide the main natural environment legend if any relevant layer is active.
 */
function updateNaturalEnvironmentLegendVisibility() {
  const ids = [
    'toggleAncientWoodland',
    'toggleAONB',
    'toggleLNR',
    'toggleNNR',
    'toggleTPZ',
    'toggleGrassArea',
    'toggleWoodland',
    'toggleNTOW',
    'toggleCanopy'
  ];
  const visible = ids.some(id => document.getElementById(id)?.checked);
  const legend = document.getElementById('natural-environment-legend');
  if (legend) legend.style.display = visible ? 'block' : 'none';
}

Object.entries(naturalLayerConfig).forEach(([checkboxId, layerIds]) => {
  document.getElementById(checkboxId)?.addEventListener('change', (e) => {
    toggleLayers(layerIds, e.target.checked);
    const legendId = naturalLegendMap[checkboxId];
    if (legendId) {
      const legend = document.getElementById(legendId);
      if (legend) legend.style.display = e.target.checked ? 'block' : 'none';
    }
    updateNaturalEnvironmentLegendVisibility();
  });
});

// update legend when toggling grass, woodland, NTOW, canopy
['toggleGrassArea','toggleWoodland','toggleNTOW','toggleCanopy'].forEach(id => {
  document.getElementById(id)?.addEventListener('change', updateNaturalEnvironmentLegendVisibility);
});

// On page load, set legend visibility
updateNaturalEnvironmentLegendVisibility();

// Grass area (paint property change)
document.getElementById('toggleGrassArea')?.addEventListener('change', (e) => {
  if (map.getLayer('landcover_grass')) {
    const color = e.target.checked
      ? originalLandcoverStyles.grass['fill-color']
      : '#cccccc';
    map.setPaintProperty('landcover_grass', 'fill-color', color);
  }
});

// Woodland (paint property change)
document.getElementById('toggleWoodland')?.addEventListener('change', (e) => {
  if (map.getLayer('landcover_wood')) {
    const color = e.target.checked
      ? originalLandcoverStyles.wood['fill-color']
      : '#aaaaaa';
    map.setPaintProperty('landcover_wood', 'fill-color', color);
  }
});

// NTOW (layer toggle and legend visibility)
document.getElementById('toggleNTOW')?.addEventListener('change', (e) => {
  toggleLayers(['ntow-trees'], e.target.checked);
  updateNTOWLegendVisibility();
});

// Canopy (layer toggle and button visibility)
document.getElementById('toggleCanopy')?.addEventListener('change', (e) => {
  toggleLayers(['ward-canopy'], e.target.checked);
  const refreshBtn = document.getElementById('refresh-canopy-btn');
  if (refreshBtn) refreshBtn.style.display = e.target.checked ? 'block' : 'none';
});


// ============================================================================
// 4. SOCIAL INFRASTRUCTURE LAYER TOGGLES 
// ============================================================================


// Central legend updater for social infrastructure
// Shows legend if any social infrastructure layer is active
function updateSocialInfrastructureLegendVisibility() {
  const toggles = [
    'toggleAmenity', 'toggleCemeteries', 'toggleEducational',
    'toggleHospitals', 'toggleShop', 'toggleSchools', 'toggleStadiums', 'toggleTourism'
  ]; // Removed 'toggleBasePOIs'
  const show = toggles.some(id => document.getElementById(id)?.checked);
  const legend = document.getElementById('social-infrastructure-legend');
  if (legend) legend.style.display = show ? 'block' : 'none';
}

// Config for standard visibility toggles
const socialLayerConfig = {
  toggleAmenity: ['pois-amenity'],
  toggleShop: ['pois-shop'],
  toggleTourism: ['pois-tourism'],
  toggleEducational: ['educational-establishments'],
  toggleBasePOIs: ['poi_z10', 'poi_z11', 'poi_z12', 'poi_z13', 'poi_z14', 'poi_z15', 'poi_z16']
};

// Apply standard toggle behaviour
Object.entries(socialLayerConfig).forEach(([toggleId, layers]) => {
  document.getElementById(toggleId)?.addEventListener('change', (e) => {
    toggleLayers(layers, e.target.checked);
    updateSocialInfrastructureLegendVisibility();
  });
});

// Cemeteries
if (document.getElementById('toggleCemeteries')) {
  document.getElementById('toggleCemeteries').addEventListener('change', (e) => {
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
    updateSocialInfrastructureLegendVisibility();
  });
}

// Hospitals
if (document.getElementById('toggleHospitals')) {
  document.getElementById('toggleHospitals').addEventListener('change', (e) => {
    toggleLandUseType('hospital', e.target.checked ? '#f28cb1' : '#cccccc');
    map.setLayoutProperty('hospital-outline', 'visibility', e.target.checked ? 'visible' : 'none');
    updateSocialInfrastructureLegendVisibility();
  });
}

// Schools
if (document.getElementById('toggleSchools')) {
  document.getElementById('toggleSchools').addEventListener('change', (e) => {
    toggleLandUseType('school', e.target.checked ? '#e6cc00' : '#cccccc');
    map.setLayoutProperty('school-outline', 'visibility', e.target.checked ? 'visible' : 'none');
    updateSocialInfrastructureLegendVisibility();
  });
}

// Stadiums
if (document.getElementById('toggleStadiums')) {
  document.getElementById('toggleStadiums').addEventListener('change', (e) => {
    toggleLandUseType('stadium', e.target.checked ? '#a1d99b' : '#cccccc');
    map.setLayoutProperty('stadium-outline', 'visibility', e.target.checked ? 'visible' : 'none');
    updateSocialInfrastructureLegendVisibility();
  });
}

// Initial state on load
updateSocialInfrastructureLegendVisibility();

// ============================================================================
// 5. ENVIRONMENTAL FEATURES LAYER TOGGLES (MODULAR)
// ============================================================================

function updateEnvironmentalLegendVisibility() {
  const toggles = ['toggleFloodRisk', 'toggleHydrogelogy', 'toggleContours', 'toggleBoreholes'];
  const show = toggles.some(id => document.getElementById(id)?.checked);
  const legend = document.getElementById('environmental-legend');
  if (legend) legend.style.display = show ? 'block' : 'none';
}

const environmentalLayerConfig = {
  toggleFloodRisk: ['flood-risk'],
  toggleHydrogelogy: ['hydrogelogy'],
  toggleContours: ['contour-lines-index', 'contour-lines-ordinary', 'contour-points', 'contour-labels'],
  toggleBoreholes: ['boreholes']
};

Object.entries(environmentalLayerConfig).forEach(([toggleId, layers]) => {
  const checkbox = document.getElementById(toggleId);
  if (!checkbox) return;

  checkbox.addEventListener('change', (e) => {
    const visible = e.target.checked ? 'visible' : 'none';

    layers.forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', visible);
      }
    });

    // Special handling for Hydrogeology legend
    if (toggleId === 'toggleHydrogelogy') {
      const legend = document.getElementById('hydrogelogy-legend');
      if (legend) legend.style.display = e.target.checked ? 'block' : 'none';
    }

    // Special handling for Boreholes scan key
    if (toggleId === 'toggleBoreholes') {
      if (e.target.checked) showBoreholeScanKey();
      else hideBoreholeScanKey();
    }

    updateEnvironmentalLegendVisibility();
  });
});


/**
 * Show the borehole scan key legend in the sidebar (for borehole layer).
 */
function showBoreholeScanKey() {
  if (!document.getElementById('borehole-scan-key')) {
    document.getElementById('sidebar-content').innerHTML += `
      <div id="borehole-scan-key" style="margin: 16px 0;">
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="
            height: 16px;
            width: 160px;
            background: linear-gradient(to right, #a6cee3 0%, #1f78b4 50%, #08306b 100%);
            border-radius: 8px;
            border: 1px solid #aaa;
            margin-bottom: 8px;
            position: relative;
          "></div>
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
          <div style="font-size: 11px; color: #666; margin-top: 18px;">
            Borehole scan year (lighter = older, darker = newer)
          </div>
        </div>
      </div>
    `;
  }
}

/**
 * Remove the borehole scan key legend from the sidebar.
 */
function hideBoreholeScanKey() {
  const key = document.getElementById('borehole-scan-key');
  if (key) key.remove();
}

// Initial state
updateEnvironmentalLegendVisibility();

// ============================================================================
// 6. TRANSPORT & ACCESSIBILITY LAYER TOGGLES (MODULAR)
// ============================================================================

function updateTransportLegendVisibility() {
  const toggles = ['toggleTransportAccess', 'togglePROW', 'toggleRoads'];
  const show = toggles.some(id => document.getElementById(id)?.checked);
  const legend = document.getElementById('transport-legend');
  if (legend) legend.style.display = show ? 'block' : 'none';
}

const transportLayerConfig = {
  toggleTransportAccess: ['public-transport-nodes'],
  togglePROW: [
    'prow-footpath',
    'prow-bridleway',
    'prow-restricted-byway',
    'prow-byway-open'
  ],
  toggleRoads: ['road-lines']
};

Object.entries(transportLayerConfig).forEach(([toggleId, layers]) => {
  const checkbox = document.getElementById(toggleId);
  if (!checkbox) return;

  checkbox.addEventListener('change', (e) => {
    const visible = e.target.checked ? 'visible' : 'none';

    layers.forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', visible);
      }
    });

    // PROW has its own legend
    if (toggleId === 'togglePROW') {
      const legend = document.getElementById('prow-legend');
      if (legend) legend.style.display = e.target.checked ? 'block' : 'none';
    }

    updateTransportLegendVisibility();
  });
});

// Initial state
updateTransportLegendVisibility();

// ============================================================================


// Master toggle for collapsing all controls (UI)
const btn = document.querySelector('.toggle-button');
const controls = document.querySelector('.layer-controls');
if (btn && controls) {
  btn.addEventListener('click', () => {
    controls.classList.toggle('collapsed');
  });
}

// Group header collapse logic (for collapsible layer groups)
const collapseByDefault = true;
document.querySelectorAll('.group-header').forEach(header => {
  const content = header.nextElementSibling;
  
  if (collapseByDefault) {
    content.classList.add('collapsed');
    header.classList.remove('expanded');
  }

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


// Debug: click landuse-fill layer to log feature properties (remove for production)
if (typeof map !== 'undefined') {
  map.on('click', 'landuse-fill', (e) => {
    console.log('Land use value:', e.features[0]?.properties?.landuse);
    console.log('All properties:', e.features[0]?.properties);
  });
}

}

window.setupToggles = setupToggles;
// Remove this test code:
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

