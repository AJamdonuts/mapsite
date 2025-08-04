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


function addLayers(map) {
    
    map.setPaintProperty('landcover_wood', 'fill-color', '#aaaaaa'); // light grey
    map.setPaintProperty('landcover_grass', 'fill-color', '#cccccc'); // slightly different grey
    map.setPaintProperty('landuse_cemetery', 'fill-color', '#bbbbbb');
    map.setPaintProperty('landuse_hospital', 'fill-color', '#bbbbbb');
    map.setPaintProperty('landuse_school', 'fill-color', '#bbbbbb');
    map.setPaintProperty('landuse_stadium', 'fill-color', '#bbbbbb');


    

// Listed buildings layer
    map.addLayer({
        id: 'listed-point',
        type: 'circle',
        source: 'listed-buildings',
        layout: {
        visibility: 'none' 
        },
        paint: {
        'circle-radius': 5,
        'circle-color': '#CC5500',
        'circle-stroke-color': '#5C2E00',
        'circle-stroke-width': 2,
        'circle-opacity': 0.7
        }
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




    // 3D Buildings
    map.addLayer({
        id: 'buildings-3d',
        type: 'fill-extrusion',
        source: 'building_height',
        paint: {
        'fill-extrusion-color': '#1f77b4',
        'fill-extrusion-opacity': 0.7,
        'fill-extrusion-height': [ // Calculate height based on building levels or height property
            'coalesce',
            ['get', 'height'],
            ['*', ['to-number', ['get', 'building:levels']], 3],
            10,
        ],
        'fill-extrusion-base': 0,
        },
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
                'Grade 1', '#f7fcb9', // Grade 1
                'Grade 2', '#addd8e', // Grade 2
                'Grade 3', '#31a354', // Grade 3
                'Grade 4', '#006d2c', // Grade 4
                'Grade 5', '#00441b', // Grade 5
                'Urban', '#b65555', // Urban
                'Non Agricultural', '#b8ae1e', // Non Agricultural
                '#cccccc' // Default gray for unknown classes
            ],
            'fill-opacity': 0.5,
            'fill-outline-color': '#000000'
        }
    });

    // Ancient Woodland layer
    map.addLayer({
        id: 'ancient-woodland',
        type: 'fill',
        source: 'ancient-woodland',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': '#228B22', // forest green
            'fill-opacity': 0.5,
            'fill-outline-color': '#000000'
        }
    });

    // Area of Outstanding Natural Beauty (AONB) layer
    map.addLayer({
        id: 'aonb-fill',
        type: 'fill',
        source: 'aonb',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': '#d0e1f9', // light blue
            'fill-opacity': 0.4,
            'fill-outline-color': '#000000'
        }
    });

    // Built up Areas layer
    map.addLayer({
        id: 'built-up-areas',
        type: 'fill',
        source: 'built-up-areas',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': '#efe05b', // khaki
            'fill-opacity': 0.5,
            'fill-outline-color': '#000000'
        }
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

    // Local Nature Reserves layer
    map.addLayer({
        id: 'local-nature-reserves',
        type: 'fill',
        source: 'local-nature-reserves',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': '#b2df8a', // light green
            'fill-opacity': 0.4,
            'fill-outline-color': '#000000'
        }
    });


    // National Nature Reserves layer
    map.addLayer({
        id: 'national-nature-reserves',
        type: 'fill',
        source: 'national-nature-reserves',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': '#a8d5ba', // light green
            'fill-opacity': 0.4,
            'fill-outline-color': '#000000'
        }
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

    // Educational Establishments layer
    map.addLayer({
        id: 'educational-establishments',
        type: 'circle',
        source: 'educational-establishments',
        layout: { visibility: 'none' },
        paint: {
            'circle-radius': 6,
            'circle-color': '#b220ba',
            'circle-stroke-color': '#000000',
            'circle-stroke-width': 1,
            'circle-opacity': 0.8
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

    
    // Land use fill
    window.landUseColors = {
        residential: '#f4a261',
        commercial: '#2a9d8f',
        industrial: '#e76f51',
        forest: '#264653',
        farmland: '#e9c46a',
        grass: '#a8dadc',
        park: '#81b29a',
        quarry: '#6c757d',
    };

    // Fill layer for land use areas
    map.addLayer({
        id: 'landuse-fill',
        type: 'fill',
        layout: { visibility: 'none' },
        source: 'landuse',
        paint: {
        'fill-color': [
            'match',
            ['get', 'landuse'], // Get land use type from feature
            ...Object.entries(landUseColors).flat(),
            '#cccccc', // Default gray if type not listed
        ],
        'fill-opacity': 0.3,
        },
    });

    // Land use outline for boundaries
    map.addLayer({
        id: 'landuse-outline',
        type: 'line',
        layout: { visibility: 'none' },
        source: 'landuse',
        paint: {
        'line-color': [
            'match',
            ['get', 'landuse'],
            ...Object.entries(landUseColors).flat(),
            '#555555'  // fallback color
        ],
        'line-width': 1,
        'line-opacity': 0.8,
        },
    });

    // Points of Interest (POIs) layer
    const poiColors = {
    amenity: '#e41a1c',    // red
    tourism: '#377eb8',    // blue
    shop: '#4daf4a',       // green
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
            'circle-radius': 6,
            'circle-color': poiColors[category],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff', // White border for visibility
        },
        });
    }

    
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

    map.loadImage('images/gold-hatch.png', (error, image) => {
      if (error) throw error;
      map.addImage('goldHatch', image, { pixelRatio: 2 });
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
}
window.addLayers = addLayers; // Export function for use in main.js