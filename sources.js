export function addSources(map) {

// Wait for the map to finish loading before adding sources and layers
map.on('load', () => {

  // SOURCES 

  // Add GeoJSON source for listed buildings 
  map.addSource('listed-buildings', {
    type: 'geojson',
    data: 'datasets/NH_Listed_Building_polygons.geojson',
  });

  // Add GeoJSON source for building heights
  map.addSource('building_height', {
    type: 'geojson',
    data: 'datasets/building_height.geojson',
  });

  // Add GeoJSON source for land use
  map.addSource('landuse', {
    type: 'geojson',
    data: 'datasets/landuse_osm.geojson',
  });

  // Add GeoJSON source for Points of Interest (POIs)
  map.addSource('pois', {
  type: 'geojson',
  data: 'datasets/pois_osm.geojson',
  });

  // Add GeoJSON source for National Tree Register (NTOW) trees
  map.addSource('ntow-trees', {
  type: 'geojson',
  data: 'datasets/ntow_trees.json',
});

  // Add GeoJSON source for UK Ward Canopy Cover
    map.addSource('canopy', {
      type: 'geojson',
      data: 'datasets/UK_Ward_Canopy_Cover.geojson'
    });
  
    // End of map.on('load', ...)
    });
  
  } // End of addSources function

