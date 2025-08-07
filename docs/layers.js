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

    // Land use outline for boundaries
    map.addLayer({
        id: 'landuse-outline',
        type: 'line',
        layout: { visibility: 'none' },
        source: 'landuse',
        paint: {
        'line-color': '#000000',
        'line-width': 1,
        'line-opacity': 0.8,
        },
        // Add this filter to exclude cemeteries completely
        filter: ['!=', ['get', 'landuse'], 'cemetery', 'hospital', 'school', 'stadium', 'military', 'forest', 'grass']
    });

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
    

} // End of addLayers function

window.addLayers = addLayers;




