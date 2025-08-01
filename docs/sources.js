
 // SOURCES 

function addSources(map) {

  // Add GeoJSON source for listed buildings 
  map.addSource('listed-buildings', {
    type: 'geojson',
    data: 'datasets/NH_Listed_Building_points.geojson',
  });

  // Add GeoJSON source for scheduled monuments
  map.addSource('scheduled_monuments', {
    type: 'geojson',
    data: 'datasets/NH_Scheduled_Monuments.geojson',
  });

  // Add GeoJSON source for heritage parks
  map.addSource('heritage_parks', {
    type: 'geojson',
    data: 'datasets/NH_Heritage_Parks.geojson',
  });

  // Add GeoJSON source for World Heritage Sites
  map.addSource('world-heritage', {
    type: 'geojson',
    data: 'datasets/NH_WorldHeritageSites.geojson',
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


}
window.addSources = addSources; // Export function for use in main.js