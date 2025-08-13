// LAYERS 

window.originalLandcoverStyles = {
    wood: {
        'fill-color': '#228B22', // forest green
    },
    grass: {
        'fill-color': '#7CFC00', // lawn green
    },
};

window.originalLanduseStyles = {
    cemetery: { 'fill-color': '#a9a9a9' },   // dark grey
    hospital: { 'fill-color': '#f28cb1' },   // light pink
    school:   { 'fill-color': '#ffe699' },   // light yellow
    stadium:  { 'fill-color': '#a1d99b' },   // soft green
};

// Add these global variables if they don't exist
window.activeLandUseTypes = ['residential', 'commercial', 'industrial', 'forest', 'farmland', 'grass', 'park', 'retail', 'landfill']; // Initialize with all types
window.inactiveColor = '#cccccc';

// Update the landUseColors object to match your desired colors:
window.landUseColors = {
    'residential': '#00FF00',     // Green (changed from orange)
    'commercial': '#FF0000',      // Red (changed from pink)
    'industrial': '#0000FF',      // Blue (changed from dark green)
    'farmland': '#FFFF00',        // Yellow (changed from orange)
    'park': '#800080',             // Purple (changed from dark green)
    'retail': '#FFA500',           // Orange
    'landfill': '#808080'
};


function addLayers(map) {
    // Article 4 Direction Areas layer
    map.addLayer({
        id: 'article-4-direction',
        type: 'fill',
        source: 'article-4-direction',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': '#f0e68c', // khaki
            'fill-opacity': 0.15,
            'fill-outline-color': '#000000'
        }
    });
    window.customLayerIds.push('article-4-direction');

    // Highlight layer for Article 4 Direction Areas
    map.addLayer({
        id: 'article-4-highlight',
        type: 'line',
        source: 'article-4-direction',
        layout: {},
        paint: {
            'line-color': '#FF4500', // orange-red highlight
            'line-width': 4,
            'line-opacity': 1
        },
        filter: ['==', 'fid', 0] // No feature selected by default
    });
    window.customLayerIds.push('article-4-highlight');

    // Article 4 Direction Areas dashed outline
    map.addLayer({
        id: 'article-4-direction-outline',
        type: 'line',
        source: 'article-4-direction',
        layout: { visibility: 'none' },
        paint: {
            'line-color': '#000000', // black
            'line-width': [
                'interpolate',
                ['exponential', 1.5],
                ['zoom'],
                8, 0.5,   // At zoom 8: 0.5px width
                12, 1,    // At zoom 12: 1px width
                16, 2,    // At zoom 16: 2px width
                20, 3     // At zoom 20: 3px width
            ],
            'line-opacity': 0.8,
            'line-dasharray': [3, 3] // Creates dashed line pattern
        }
    });
    window.customLayerIds.push('article-4-direction-outline');

    //Heritage Parks and Gardens layer
    map.addLayer({
        id: 'heritage-parks-fill',
        type: 'fill',
        source: 'heritage_parks',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': ' #c1f7a1', 
            'fill-opacity': 0.3,
        }
    });
    window.customLayerIds.push('heritage-parks-fill');

    map.addLayer({
        id: 'heritage-parks-outline',
        type: 'line',
        source: 'heritage_parks',
        layout: { visibility: 'none' },
        paint: {
            'line-color': '#598145',
            'line-width': 1.5
        }
    });
    window.customLayerIds.push('heritage-parks-outline');

    // Listed buildings layer
    map.addLayer({
        id: 'listed-point',
        type: 'circle',
        source: 'listed-buildings',
        layout: {
        visibility: 'none' 
        },
        paint: {
        'circle-radius': 4,
        'circle-color': 'rgba(179, 205, 224, 0.9)',
        'circle-stroke-color': '#6495ed',
        'circle-stroke-width': 1.2,
        }
    });
    window.customLayerIds.push('listed-point');

    // Listed buildings fill layer (for polygons)
    map.addLayer({
        id: 'listed-fill',
        type: 'fill',
        source: 'listed-buildings',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': '#3388ff',
            'fill-opacity': 0.3
        }
    });
    window.customLayerIds.push('listed-fill');

    // Listed buildings highlight layer (for selection highlighting)
    map.addLayer({
        id: 'listed-highlight',
        type: 'fill',
        source: 'listed-buildings',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': '#ff0000',
            'fill-opacity': 0.6
        },
        filter: ['==', 'fid', 0] // No feature selected by default
    });
    window.customLayerIds.push('listed-highlight');

    // Scheduled Monuments layer
    map.addLayer({
        id: 'smonuments-fill',
        type: 'fill',
        layout: { visibility: 'none' },
        source: 'scheduled_monuments',
        paint: {
            'fill-color': '#f06a6c', // light red
            'fill-opacity': 0.3,
        }
    });
    window.customLayerIds.push('smonuments-fill');

    map.addLayer({
        id: 'smonuments-outline',
        type: 'line',
        source: 'scheduled_monuments',
        layout: { visibility: 'none' },
        paint: {
            'line-color': '#f06a6c',
            'line-width': 1.5
        }
    });
    window.customLayerIds.push('smonuments-outline');


// World Heritage Sites layer

    // Core Area Layer
    map.addLayer({
      id: 'whs-core',
      type: 'fill',
      source: 'world-heritage',
      layout: { visibility: 'none' },
      filter: ['==', ['get', 'Notes'], 'Core Area'],
      paint: {
        'fill-color': '#FFC300', // gold
        'fill-opacity': 0.4,
      }
    });
    window.customLayerIds.push('whs-core');

    // Buffer Zone Layer
    map.addLayer({
      id: 'whs-buffer',
      type: 'fill',
      source: 'world-heritage',
      layout: { visibility: 'none' },
      filter: ['==', ['get', 'Notes'], 'Buffer Zone'],
      paint: {
        'fill-pattern': 'goldHatch'
      }
    });
    window.customLayerIds.push('whs-buffer');

    // Conservation Areas outline - Separate line layer for visible outline
    map.addLayer({
        id: 'conservation-areas-outline',
        type: 'line',
        source: 'conservation-areas',
        layout: { visibility: 'none' },
        paint: {
            'line-color': '#1565c0', // darker blue outline at full opacity
            'line-width': 2,
            'line-opacity': 1
        }
    });
    window.customLayerIds.push('conservation-areas-outline');

    // Highlight layer for Conservation Areas
    map.addLayer({
        id: 'conservation-areas-highlight',
        type: 'line',
        source: 'conservation-areas',
        layout: {},
        paint: {
            'line-color': '#FF6B35', // orange highlight (different from Article 4's red)
            'line-width': 4,
            'line-opacity': 1
        },
        filter: ['==', 'fid', 0] // Use 'fid' and 0, same as Article 4
    });
    window.customLayerIds.push('conservation-areas-highlight');

    // Conservation Areas layer - Updated styling
    map.addLayer({
        id: 'conservation-areas',
        type: 'fill',
        source: 'conservation-areas',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': '#90caf9', // light blue
            'fill-opacity': 0.3 // 30% opacity
            // Remove fill-outline-color since we'll use a separate line layer
        }
    });
    window.customLayerIds.push('conservation-areas');

    // 3D Buildings
    map.addLayer({
        id: 'buildings-3d',
        type: 'fill-extrusion',
        source: 'building_height',
        paint: {
        'fill-extrusion-color': 'transparent', // Use transparent color for fill
        'fill-extrusion-opacity': 0.1,
        'fill-extrusion-height': [ // Calculate height based on building levels or height property
            'coalesce',
            ['get', 'height'],
            ['*', ['to-number', ['get', 'building:levels']], 3],
            10,
        ],
        'fill-extrusion-base': 0,
        },
    });
    window.customLayerIds.push('buildings-3d');

    // Ancient Woodland layer
    map.addLayer({
        id: 'ancient-woodland',
        type: 'fill',
        source: 'ancient-woodland',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': '#3a743a',
            'fill-opacity': 0.5,
        }
    });
    window.customLayerIds.push('ancient-woodland');

    // Ancient Woodland outline layer
        map.addLayer({
        id: 'ancient-woodland-outline',
        type: 'line',
        source: 'ancient-woodland',
        layout: { visibility: 'none' },
        paint: {
            'line-color': '#006d2c', 
            'line-width': 2,
            'line-opacity': 1,
        },
    });
    window.customLayerIds.push('ancient-woodland-outline');

    // Area of Outstanding Natural Beauty (AONB) layer
    map.addLayer({
        id: 'aonb-fill',
        type: 'fill',
        source: 'aonb',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': '#ccebc5',  
            'fill-opacity': 0.3  
        },
    });
    window.customLayerIds.push('aonb-fill');

    // AONB outline layer with dashed line
    map.addLayer({
        id: 'aonb-outline',
        type: 'line',
        source: 'aonb',
        layout: { visibility: 'none' },
        paint: {
            'line-color': '#006d2c', 
            'line-width': 2,
            'line-opacity': 1,
            'line-dasharray': [3, 3] 
        },
    });
    window.customLayerIds.push('aonb-outline');

    // Local Nature Reserves layer
    map.addLayer({
        id: 'local-nature-reserves',
        type: 'fill',
        source: 'local-nature-reserves',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': '#b3cde3', 
            'fill-opacity': 0.4,
        }
    });
    window.customLayerIds.push('local-nature-reserves');

    // Local Nature Reserves outline layer
    map.addLayer({
        id: 'local-nature-reserves-outline',
        type: 'line',
        source: 'local-nature-reserves',
        layout: { visibility: 'none' },
        paint: {
            'line-color': '#045a8d', 
            'line-width': 2,
            'line-opacity': 1
        }
    });
    window.customLayerIds.push('local-nature-reserves-outline');


    // National Nature Reserves layer
    map.addLayer({
        id: 'national-nature-reserves',
        type: 'fill',
        source: 'national-nature-reserves',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': '#fbb4ae', 
            'fill-opacity': 0.4,
        }
    });
    window.customLayerIds.push('national-nature-reserves');

    // National Nature Reserves outline layer
    map.addLayer({
        id: 'national-nature-reserves-outline',
        type: 'line',
        source: 'national-nature-reserves',
        layout: { visibility: 'none' },
        paint: {
            'line-color': '#99000d', 
            'line-width': 2,
            'line-opacity': 1
        }
    });
    window.customLayerIds.push('national-nature-reserves-outline');

        // National Tree Register (NTOW) trees

    map.addLayer({
    id: 'ntow-trees',
    type: 'fill',
    layout: { visibility: 'none' },
    source: 'ntow-trees',
    paint: {
        'fill-color': [
        'match',
        ['get', 'woodland_type'], // Color by tree group type
        'Lone Tree', '#00a884',
        'Group of Trees', '#4ae700',
        'NFI OHC', '#6fa803',
        'Small Woodland', '#0ae6a9',
        /* fallback */ '#cccccc'
        ],
        'fill-opacity': 0.6,
        'fill-outline-color': '#000000'
    }
    });
    window.customLayerIds.push('ntow-trees');

    //UK Ward Canopy Cover layer
    map.addLayer({
    id: 'ward-canopy',
    type: 'fill',
    layout: { visibility: 'none' },
    source: 'canopy',
    paint: {
        'fill-color': [
        'interpolate', // Gradient fill based on canopy percentage
        ['linear'],
        ['get', 'percancov'], // Percentage canopy cover
        0, '#f7fcf5',
        10, '#bae4b3',
        20, '#74c476',
        30, '#238b45',
        40, '#00441b'
        ],
        'fill-opacity': 0.4,
        'fill-outline-color': '#000000'
    }
    });
    window.customLayerIds.push('ward-canopy');


    // Tree Preservation Zones layer
    map.addLayer({
        id: 'tree-preservation-zones',
        type: 'fill',
        source: 'tree-preservation-zones',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': '#8B4513', // brown
            'fill-opacity': 0.4,
            'fill-outline-color': '#000000'
        }
    });
    window.customLayerIds.push('tree-preservation-zones');


    // Transport Access Nodes layer
    map.addLayer({
        id: 'public-transport-nodes',
        type: 'circle',
        source: 'public-transport-nodes',
        layout: { visibility: 'none' },
        paint: {
            'circle-radius': 4,
            'circle-color': '#ff7f0e', // orange
            'circle-stroke-color': '#000000',
            'circle-stroke-width': 1,
            'circle-opacity': 0.8
        }
    });
    window.customLayerIds.push('public-transport-nodes');

     // Agricultural Land Classification
    map.addLayer({
        id: 'agricultural-land',
        type: 'fill',
        source: 'agricultural_land',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': [
                'match',
                ['get', 'agricultural-land-classification-grade'],
                'Grade 1', '#228B22', // Grade 1
                'Grade 2', '#32CD32', // Grade 2
                'Grade 3', '#9ACD32', // Grade 3
                'Grade 3a', '#9ACD32', // Grade 3a
                'Grade 3b', '#ADFF2F', // Grade 3b
                'Grade 4', '#FFFF99', // Grade 4
                'Grade 5', '#DDDDDD', // Grade 5

                'rgba(0,0,0,0)' // Completely transparent for unknown classes
            ],
            'fill-opacity': 0.5,
            'fill-outline-color': '#000000'
        },
    });
    window.customLayerIds.push('agricultural-land');

    // Built up Areas layer
    map.addLayer({
        id: 'built-up-areas',
        type: 'fill',
        source: 'built-up-areas',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': '#FF6B6B', // khaki
            'fill-opacity': 0.4,
            'fill-outline-color': '#CC5555'
        }
    });
    window.customLayerIds.push('built-up-areas');

    // Land use fill layer - ADD THIS BEFORE the outline layer
    map.addLayer({
        id: 'landuse-fill',
        type: 'fill',
        layout: { visibility: 'none' },
        source: 'landuse',
        paint: {
            'fill-color': [
                'case',
                ['in', ['get', 'landuse'], ['literal', window.activeLandUseTypes]],
                [
                    'match',
                    ['get', 'landuse'],
                    ...Object.entries(window.landUseColors).flat(),
                    window.inactiveColor
                ],
                '#000000'  // fallback color
                
            ],
            'fill-opacity': 0.6,
        },
        // Add this filter to exclude cemeteries completely
        filter: ['!=', ['get', 'landuse'], 'cemetery']
    });
    window.customLayerIds.push('landuse-fill');

    // Land use outline for boundaries
    map.addLayer({
        id: 'landuse-outline',
        type: 'line',
        layout: { visibility: 'none' },
        source: 'landuse',
        filter: ['in', ['get', 'landuse'], ['literal', ['residential', 'commercial', 'industrial', 'farmland', 'park']]], // Fixed syntax
        paint: {
        'line-color': '#666666',
        'line-width': 1
        }
    });
    window.customLayerIds.push('landuse-outline');

       // Local Plan Boundaries layer
    map.addLayer({
        id: 'local-plan-boundaries',
        type: 'line',
        source: 'local-plan-boundaries',
        layout: { visibility: 'none' },
        paint: {
            'line-color': '#ff7f0e', // orange
            'line-width': 2,
            'line-opacity': 0.8
        }
    });
    window.customLayerIds.push('local-plan-boundaries');


        map.loadImage('images/gold-hatch.png', (error, image) => {
      if (error) throw error;
      map.addImage('goldHatch', image, { pixelRatio: 2 });
    });

    // Load the black hatch image
    map.loadImage('images/black-hatch.png', (error, image) => {
        if (error) throw error;
        map.addImage('blackHatch', image, { pixelRatio: 4 });
    });


    // Land use cemetery
    map.addLayer({
    id: 'cemetery-outline',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'landuse',
    layout: { visibility: 'none' },
    filter: ['==', ['get', 'class'], 'cemetery'],
    paint: {
        'line-color': '#000000',
        'line-width': 2,
        'line-opacity': 1
    }
    });
    window.customLayerIds.push('cemetery-outline');

    // Land use hospital
    map.addLayer({
    id: 'hospital-outline',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'landuse',
    layout: { visibility: 'none' },
    filter: ['==', ['get', 'class'], 'hospital'],
    paint: {
        'line-color': '#d63384',
        'line-width': 2,
        'line-opacity': 1
    }
    });
    window.customLayerIds.push('hospital-outline');

    // Land use school
    map.addLayer({
    id: 'school-outline',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'landuse',
    layout: { visibility: 'none' },
    filter: ['==', ['get', 'class'], 'school'],
    paint: {
        'line-color': '#e6cc00',
        'line-width': 2,
        'line-opacity': 1
    }
    });
    window.customLayerIds.push('school-outline');

    // Land use stadium
    map.addLayer({
    id: 'stadium-outline',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'landuse',
    layout: { visibility: 'none' },
    filter: ['==', ['get', 'class'], 'stadium'],
    paint: {
        'line-color': '#d63384',
        'line-width': 2,
        'line-opacity': 1
    }
    });
    window.customLayerIds.push('stadium-outline');

  // Points of Interest (POIs) layer
    const poiColors = {
    amenity: '#f8bbd0',    // red
    tourism: '#81d4fa',    // blue
    shop: '#ce93d8',      
    };

    // Create a circle layer for each POI category
    for (const category of ['amenity', 'tourism', 'shop']) {
        map.addLayer({
        id: `pois-${category}`,
        type: 'circle',
        layout: { visibility: 'none' },
        source: 'pois',
        filter: ['all', ['has', category], ['has', 'name']], // Only features with category and name
        paint: {
            'circle-radius': 5,
            'circle-color': poiColors[category],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff', // White border for visibility
        },
        });
        window.customLayerIds.push(`pois-${category}`);
    }

    // Educational Establishments layer
    map.addLayer({
        id: 'educational-establishments',
        type: 'circle',
        source: 'educational-establishments',
        layout: { visibility: 'none' },
        paint: {
            'circle-radius': 6,
            'circle-color': '#fff176',
            'circle-stroke-color': '#666',
            'circle-stroke-width': 1,
        }
    });
    window.customLayerIds.push('educational-establishments');

    // Flood Risk Areas layer
    map.addLayer({
        id: 'flood-risk',
        type: 'fill',
        source: 'flood-risk',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': [
                'match',
                ['get', 'flood-risk-level'],
                '1', '#d0e9c6',   // Low
                '2', '#f4a582',   // Medium
                '3', '#ca0020',   // High
                '#cccccc'         // Default fallback
            ],
            'fill-opacity': 0.5,
            'fill-outline-color': '#000000'
        }
    });
    window.customLayerIds.push('flood-risk');

    // Boreholes layer
    map.addLayer({
        id: 'boreholes',
        type: 'circle',
        source: 'boreholes',
        layout: { visibility: 'none' },
        paint: {
        'circle-radius': 6,
        'circle-color': [
            'interpolate',
            ['linear'],
            ['to-number', ['get', 'YEAR_KNOWN']],
            1900, '#a6cee3',
            2000, '#1f78b4',
            2023, '#08306b'
        ],
        'circle-stroke-color': '#fff',
        'circle-stroke-width': 1
        }
    });
    window.customLayerIds.push('boreholes');

    // Hydrogelogy layer
    map.addLayer({
        id: 'hydrogelogy',
        type: 'fill',
        source: 'Hydrogelogy-features',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': [
              'match',
              ['get', 'CLASS'],
              '1B', '#a6cee3',
              '2A', '#1f78b4',
              '1C', '#b2df8a',
              '3', '#fdbf6f',
              /* fallback */ '#cccccc'
            ],
            'fill-opacity': 0.6
          }
    });
    window.customLayerIds.push('hydrogelogy');

    // PROW: Public Footpath
map.addLayer({
  id: 'prow-footpath',
  type: 'line',
  source: 'PROW',
  layout: { visibility: 'none' },
  filter: ['==', ['get', 'StatusDesc'], 'Public Footpath'],
  paint: {
    'line-color': '#E400FF',
    'line-width': 2,
    'line-opacity': 0.9,
    'line-dasharray': [2, 2]
  }
});
window.customLayerIds.push('prow-footpath');

// PROW: Bridleway
map.addLayer({
  id: 'prow-bridleway',
  type: 'line',
  source: 'PROW',
  layout: { visibility: 'none' },
  filter: ['==', ['get', 'StatusDesc'], 'Public Bridleway'],
  paint: {
    'line-color': '#0000FF',
    'line-width': 2,
    'line-opacity': 0.9,
    'line-dasharray': [6, 4]
  }
});
window.customLayerIds.push('prow-bridleway');

// PROW: Restricted Byway
map.addLayer({
  id: 'prow-restricted-byway',
  type: 'line',
  source: 'PROW',
  layout: { visibility: 'none' },
  filter: ['==', ['get', 'StatusDesc'], 'Restricted Byway'],
  paint: {
    'line-color': '#800080',
    'line-width': 2,
    'line-opacity': 0.9,
    'line-dasharray': [1, 3]
  }
});
window.customLayerIds.push('prow-restricted-byway');

// PROW: Byway Open to All Traffic (solid)
map.addLayer({
  id: 'prow-byway-open',
  type: 'line',
  source: 'PROW',
  layout: { visibility: 'none' },
  filter: ['==', ['get', 'StatusDesc'], 'Byway open to all traffic'],
  paint: {
    'line-color': '#FF0000',
    'line-width': 2,
    'line-opacity': 0.9
    // No line-dasharray for solid
  }
});
window.customLayerIds.push('prow-byway-open');

// Contour Lines layer
map.addLayer({
    id: 'contour-lines',
    type: 'line',
    source: 'contour-lines',
    layout: { visibility: 'none' },
    paint: {
        'line-color': [
            'interpolate',
            ['linear'],
            ['get', 'PROP_VALUE'],
            0, '#9ecae1',
            50, '#6baed6',
            100, '#3182bd',
            150, '#08519c',
            200, '#08306b'
        ],
        'line-width': [
          'case',
          ['==', ['%', ['get', 'PROP_VALUE'], 50], 0], 2,
          1
        ],
        'line-opacity': 0.9,
        'line-dasharray': [2, 2]
    }
});
window.customLayerIds.push('contour-lines');

// Contour Points layer
map.addLayer({
    id: 'contour-points',
    type: 'circle',
    source: 'contour-points',
    layout: { visibility: 'none' },
    paint: {
        'circle-radius': 3,
        'circle-color': '#8B4513', // brown
        'circle-stroke-color': '#ffffff', // white outline
        'circle-stroke-width': 0.5,
        'circle-opacity': 0.8
    }
});
window.customLayerIds.push('contour-points');

// Contour Labels layer
map.addLayer({
  id: 'contour-labels',
  type: 'symbol',
  source: 'contour-lines',
  layout: {
    'symbol-placement': 'line',
    'text-field': ['to-string', ['get', 'PROP_VALUE']],
    'text-font': ['Open Sans Regular'],
    'text-size': 10,
    'visibility': 'none'
  },
  paint: {
    'text-color': '#333',
    'text-halo-color': '#fff',
    'text-halo-width': 1
  }
});
window.customLayerIds.push('contour-labels');

// Contour Lines Index layer
map.addLayer({
  id: 'contour-lines-index',
  type: 'line',
  source: 'contour-lines',
  layout: { visibility: 'none' },
  filter: ['==', ['%', ['get', 'PROP_VALUE'], 50], 0],
  paint: {
    'line-color': '#8B4513',
    'line-width': 2,
    'line-opacity': 0.7
    // No line-dasharray for solid
  }
});
window.customLayerIds.push('contour-lines-index');

// Contour Lines Ordinary layer
map.addLayer({
  id: 'contour-lines-ordinary',
  type: 'line',
  source: 'contour-lines',
  layout: { visibility: 'none' },
  filter: ['!=', ['%', ['get', 'PROP_VALUE'], 50], 0],
  paint: {
    'line-color': '#8B4513',
    'line-width': 1,
    'line-opacity': 0.7,
    'line-dasharray': [2, 2]
  }
});
window.customLayerIds.push('contour-lines-ordinary');

// For the streetlighting buffer layer
map.addLayer({
  id: 'streetlighting-buffer',
  type: 'fill',
  source: 'streetlighting-buffer',
    layout: { visibility: 'none' },
  paint: {
    'fill-color': '#FFF8DC',     // Light yellow to show illuminated area
    'fill-opacity': 0.8,         // Very transparent so it doesn't dominate
  }
});
window.customLayerIds.push('streetlighting-buffer');

// Add a subtle outline for the buffer
map.addLayer({
  id: 'streetlighting-buffer-outline',
  type: 'line',
  source: 'streetlighting-buffer',
    layout: { visibility: 'none' },
  paint: {
    'line-color': '#FFFACD',
    'line-width': 1,
    'line-opacity': 0.5
  }
});
window.customLayerIds.push('streetlighting-buffer-outline');

// Streetlighting shadows layer
map.addLayer({
    id: 'streetlighting-shadows',
    type: 'fill',
    source: 'streetlighting-shadows',
    layout: { visibility: 'none' },
    paint: {
        'fill-color': '#000000', // Black for shadows
        'fill-opacity': 0.2,     // Very transparent to not dominate
        'fill-outline-color': '#000000'
    }
});
window.customLayerIds.push('streetlighting-shadows');


// Remove the current circle-based streetlighting layer and replace with these:

// First, create the rectangle image for signs (add this early in your addLayers function)
map.loadImage('images/streetlightingsign.png', (error, image) => {
    if (error) {
        console.error('Error loading streetlight sign PNG:', error);
        return;
    }
    if (!map.hasImage('sign-rectangle')) {
        map.addImage('sign-rectangle', image, { pixelRatio: 2 });
        console.log('Streetlight sign PNG added as symbol');
    }
});
window.customLayerIds.push('streetlighting-signs');

// Streetlighting Signs layer (slim rectangles)
map.addLayer({
    id: 'streetlighting-signs',
    type: 'symbol',
    source: 'streetlighting',
    layout: { 
        visibility: 'none',
        'icon-image': 'sign-rectangle', // This will now use your PNG
        'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 0.3,
            15, 0.6,
            18, 1.0
        ],
        'icon-allow-overlap': true
    },
    filter: ['==', ['get', 'feature_type'], 'Sign']
});
window.customLayerIds.push('streetlighting-signs');

// Streetlighting Columns layer (circles)
map.addLayer({
    id: 'streetlighting-columns',
    type: 'circle',
    source: 'streetlighting',
    layout: { visibility: 'none' },
    filter: ['==', ['get', 'feature_type'], 'Column'],
    paint: {
        'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 1,
            15, 3,
            18, 5
        ],
        'circle-color': '#F0F8FF',
        'circle-stroke-color': '#FFD700',
        'circle-stroke-width': 1,
        'circle-opacity': 0.8
    }
});
window.customLayerIds.push('streetlighting-columns');

// Streetlighting Others layer (small circles) - ADD THIS MISSING LAYER
map.addLayer({
    id: 'streetlighting-others',
    type: 'circle',
    source: 'streetlighting',
    layout: { visibility: 'none' },
    filter: ['all', 
        ['!=', ['get', 'feature_type'], 'Sign'],
        ['!=', ['get', 'feature_type'], 'Column']
    ],
    paint: {
        'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 0.8,
            15, 2,
            18, 3
        ],
        'circle-color': '#FFD700',
        'circle-stroke-color': '#B8860B',
        'circle-stroke-width': 1,
        'circle-opacity': 0.8
    }
});
window.customLayerIds.push('streetlighting-others');
}

// Export the addLayers function
window.addLayers = addLayers;

// Custom layer IDs export
window.customLayerIds = [];
