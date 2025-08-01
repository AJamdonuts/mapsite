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
}
window.addLayers = addLayers; // Export function for use in main.js