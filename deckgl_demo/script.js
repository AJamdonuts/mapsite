
    // Function to show a custom message box
    function showMessageBox(message) {
      const messageBox = document.getElementById('messageBox');
      const messageBoxContent = document.getElementById('messageBoxContent');
      messageBoxContent.textContent = message;
      messageBox.style.display = 'flex';
    }

    // Event listener for closing the message box
    document.getElementById('messageBoxClose').addEventListener('click', () => {
      document.getElementById('messageBox').style.display = 'none';
    });

    // Initialise MapLibre GL map
    const maplibreMap = new maplibregl.Map({
      container: 'map',
      // Using a different OpenStreetMap tile provider as the previous one wasn't loading
      style: {
        'version': 8,
        'sources': {
          'osm-tiles': {
            'type': 'raster',
            'tiles': ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            'tileSize': 256,
            'attribution': '© OpenStreetMap contributors'
          }
        },
        'layers': [
          {
            'id': 'osm-layer',
            'type': 'raster',
            'source': 'osm-tiles',
            'paint': {
              'raster-fade-duration': 100
            }
          }
        ]
      },
      center: [1.0830, 51.2797], // Canterbury
      zoom: 15 // Increased zoom level for a more zoomed-in view
    });

    maplibreMap.on('load', () => {
      console.log('MapLibre GL JS base map loaded.');

      // Initialise MapboxOverlay for Deck.gl integration
      const deckOverlay = new MapboxOverlay({
        interleaved: true, // Set to true for correct depth sorting with MapLibre layers
        layers: [] // Initial empty layers array
      });

      // Add the Deck.gl overlay as a control to the MapLibre map
      maplibreMap.addControl(deckOverlay);
      console.log('Deck.gl MapboxOverlay added to map.');

      // Load your GeoJSON data
      fetch('datasets/NH_Listed_Building_polygons.geojson')
        .then(resp => {
          if (!resp.ok) {
            // Log the error and show a message if fetch fails
            console.error(`HTTP error fetching GeoJSON! Status: ${resp.status}, URL: ${resp.url}`);
            throw new Error(`Failed to load GeoJSON: ${resp.status}`);
          }
          return resp.json();
        })
        .then(data => {
          console.log('GeoJSON data loaded:', data);
          // Create a GeoJsonLayer. This layer automatically handles Polygon and MultiPolygon.
            const geoJsonLayer = new deck.GeoJsonLayer({
                id: 'listed-buildings-layer',
                data: data,
                stroked: true,
                filled: true,
                extruded: true, // enable 3D extrusion
                getElevation: f => f.properties.height || 10, // fallback height
                lineWidthMinPixels: 1,
                getFillColor: [31, 119, 180, 180],
                getLineColor: [0, 0, 0, 200],
                getLineWidth: 1,
                pickable: true,
                autoHighlight: true,
                highlightColor: [255, 255, 0, 150],
                onClick: info => {
                    if (info.object && info.object.properties) {
                    const buildingName = info.object.properties.Name || 'Unnamed Building';
                    showMessageBox(`Building: ${buildingName}`);
                    }
                }
                });

          // Update the layers in the Deck.gl overlay
          deckOverlay.setProps({ layers: [geoJsonLayer] });
          console.log('Deck.gl layers updated with GeoJSON data.');
        })
        .catch(error => {
          console.error('Error loading or processing GeoJSON:', error);
          showMessageBox('Failed to load building data. Please check the console for more details.');
        });
    });

    // Error listener for MapLibre
    maplibreMap.on('error', (e) => {
      console.error('MapLibre GL JS map error:', e.error);
      showMessageBox(`Map loading error: ${e.error.message || 'Unknown error'}`);
    });



