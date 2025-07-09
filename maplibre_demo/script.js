
const map = new maplibregl.Map({
  container: 'map',
  style: 'https://api.maptiler.com/maps/streets/style.json?key=sLTnVyFpuI1axO89l1hV', 
  center: [1.0830, 51.2797], // Canterbury
  zoom: 13
});

map.on('load', () => {
  // Listed buildings
  map.addSource('listed-buildings', {
    type: 'geojson',
    data: 'datasets/NH_Listed_Building_polygons.geojson'
  });

  map.addLayer({
    id: 'listed-fill',
    type: 'fill',
    source: 'listed-buildings',
    paint: {
      'fill-color': '#1f77b4',
      'fill-opacity': 0.5
    }
  });

  // 3D building height extrusion
  map.addSource('building_height', {
    type: 'geojson',
    data: 'datasets/building_height.geojson' 
  });

  map.addLayer({
    id: 'buildings-3d',
    type: 'fill-extrusion',
    source: 'building_height',
    paint: {
      'fill-extrusion-color': '#1f77b4',
      'fill-extrusion-opacity': 0.7,
      'fill-extrusion-height': [
        'coalesce',
        ['get', 'height'],
        ['*', ['to-number', ['get', 'building:levels']], 3],
        10
      ],
      'fill-extrusion-base': 0
    }
  });
});

const popup = new maplibregl.Popup({
closeButton: false,
closeOnClick: false
});

map.on('mousemove', 'buildings-3d', (e) => {
map.getCanvas().style.cursor = 'pointer';

const feature = e.features[0];
const props = feature.properties;

const name = props.Name || "Unnamed Building";

// Prefer 'height', fallback to 'building:levels', then 'Unknown'
let height;
if (props.height) {
height = `${props.height} m`;
} else if (props['building:levels']) {
const levels = parseInt(props['building:levels']);
height = `${levels * 3} m (approx from ${levels} levels)`;
} else {
height = 'Unknown';
}

popup
.setLngLat(e.lngLat)
.setHTML(`<strong>${name}</strong><br>Height: ${height}`)
.addTo(map);
});

map.on('mouseleave', 'buildings-3d', () => {
map.getCanvas().style.cursor = '';
popup.remove();
});

map.on('load', () => {
    // 🔹 Add individual trees
    map.addSource('osm-trees', {
      type: 'geojson',
      data: 'datasets/osm_trees.geojson'
    });
  
    map.addLayer({
      id: 'osm-tree-points',
      type: 'circle',
      source: 'osm-trees',
      filter: ['==', '$type', 'Point'], // Only points
      paint: {
        'circle-radius': 3,
        'circle-color': '#228B22',
        'circle-opacity': 0.7,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#004d00'
      }
    });
  
    // 🔹 Add woodland polygons
    map.addLayer({
      id: 'osm-tree-polygons',
      type: 'fill',
      source: 'osm-trees',
      filter: ['==', '$type', 'Polygon'], // Only polygons
      paint: {
        'fill-color': '#a3c293',
        'fill-opacity': 0.3
      }
    });


    map.addSource('tree-clusters', {
        type: 'geojson',
        data: 'datasets/osm_trees.geojson',
        cluster: true,
        clusterMaxZoom: 14, // max zoom to cluster points on
        clusterRadius: 50   // radius of each cluster in pixels
      });
      
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'tree-clusters',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#a3c293',     // small cluster
            10, '#66aa66', // medium
            25, '#228B22'  // large
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            12, 10, 16, 25, 22
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#004d00'
        }
      });

      
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'tree-clusters',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#ffffff'
        }
      });
    
      map.addLayer({
        id: 'unclustered-trees',
        type: 'circle',
        source: 'tree-clusters',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-radius': 30,
          'circle-color': '#228B22',
          'circle-opacity': 0.3,
          'circle-stroke-width': 1,
          'circle-stroke-color': 0,
        }
      });

      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
      
        const clusterId = features[0].properties.cluster_id;
        map.getSource('tree-clusters').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;
      
            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });
      
  });
  
  map.on('mouseenter', 'osm-tree-points', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'osm-tree-points', () => {
    map.getCanvas().style.cursor = '';
  });

  document.getElementById('toggleOSMTrees').addEventListener('change', function () {
    const visibility = this.checked ? 'visible' : 'none';
    map.setLayoutProperty('osm-tree-points', 'visibility', visibility);
    map.setLayoutProperty('osm-tree-polygons', 'visibility', visibility);
  });