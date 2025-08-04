
 // SOURCES 

function addSources(map) {

  // Add GeoJSON source for listed buildings 
  // Source: Historic England, NHLE dataset
  // Date collected: 2024-05-10
  map.addSource('listed-buildings', {
    type: 'geojson',
    data: 'datasets/NH_Listed_Building_points.geojson',
  });

  // Add GeoJSON source for scheduled monuments
  // Source: Historic England, NHLE dataset
  // Date collected: 2024-05-10
  map.addSource('scheduled_monuments', {
    type: 'geojson',
    data: 'datasets/NH_Scheduled_Monuments.geojson',
  });

  // Add GeoJSON source for heritage parks and gardens
  // Source: Historic England, NHLE dataset
  // Date collected: 2024-05-10
  map.addSource('heritage_parks', {
    type: 'geojson',
    data: 'datasets/NH_Heritage_Parks.geojson',
  });

  // Add GeoJSON source for World Heritage Sites
  // Source: Historic England, NHLE dataset
  // Date collected: 2024-05-10
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
  // Source: National Tree Officers Association, NTOW dataset
  // Date collected: 2023-11-01
  map.addSource('ntow-trees', {
  type: 'geojson',
  data: 'datasets/ntow_trees.json',
});

  // Add GeoJSON source for UK Ward Canopy Cover
  // Source: Forest Research, Canopy Cover dataset
  // Date collected: 2023-09-15
  map.addSource('canopy', {
    type: 'geojson',
    data: 'datasets/UK_Ward_Canopy_Cover.geojson'
  });

  // Add GeoJSON source for Agricultural Land Classification
  // Source: Natural England,  Data created by MHCLG. Agricultural Land Classification dataset
  // Date collected: 2025-08-01
  map.addSource('agricultural_land', {
    type: 'geojson',
    data: 'datasets/NE_agriculturalland.geojson'
  });

  // Add GeoJSON source for Ancienct Woodland
  // Source: Natural England, Ancient Woodland dataset
  // Date collected: 2024-09-27
  map.addSource('ancient-woodland', {
    type: 'geojson',
    data: 'datasets/NE_ancient-woodland.geojson'
  });

  // Add GeoJSON source for Area of Outstanding Natural Beauty (AONB)
  // Source: Natural England, AONB dataset
  // Date collected: 2024-10-04
  map.addSource('aonb', {
    type: 'geojson',
    data: 'datasets/NE_AONB.geojson'
  });

// Add GeoJSON source for Built Up Areas
  // Source: Office for National Statistics, Built Up Areas dataset
  // Date collected: 2024-06-11
  map.addSource('built-up-areas', {
    type: 'geojson',
    data: 'datasets/NS_built-up-area.geojson'
  });

  // Add GeoJSON source for Conservation Areas
  // Source: Historic England and Local Planning Authorities, Conservation Areas dataset
  // Date collected: 2025-08-01
  map.addSource('conservation-areas', {
    type: 'geojson',
    data: 'datasets/HE_LA_conservation-area.geojson'
  });

  // Add GeoJSON source for Educational establishments
  // Source: Department for Education, Ministry of Housing, Communities and Local Government, Educational Establishments dataset
  // Date collected: 2024-07-06
  map.addSource('educational-establishments', {
    type: 'geojson',
    data: 'datasets/MHCLG_educational-establishment.geojson'
  });

  // Add GeoJSON source for Local Nature Reserves (LNR)
  // Source: Natural England, Ministry of Housing, Communities and Local Government, Local Nature Reserves dataset
  // Date collected: 2025-04-25
  map.addSource('local-nature-reserves', {
    type: 'geojson',
    data: 'datasets/MHCLG_local-nature-reserve.geojson'
  });

  // Add GeoJSON source for National Nature Reserves (NNR)
  // Source: Natural England, Ministry of Housing, Communities and Local Government, National Nature Reserves dataset
  // Date collected: 2025-04-25
  map.addSource('national-nature-reserves', {
    type: 'geojson',
    data: 'datasets/MHCLG_national-nature-reserve.geojson'
  });



  // Add GeoJSON source for Local Plan Boundaries
  // Source: Local Planning Authorities, Ministry of Housing, Communities and Local Government, Local Plan Boundaries dataset
  // Date collected: 2025-03-22
  map.addSource('local-plan-boundaries', {
    type: 'geojson',
    data: 'datasets/MHCLG_local-plan-boundary.geojson'
  });
  
  

  // Add GeoJSON source for Public transport Access Nodes (PTAN)
  // Source: The Nationsl Public Transport Access Nodes (NaPTAN) dataset
  // Date collected: 2025-08-02
  map.addSource('public-transport-nodes', {
    type: 'geojson',
    data: 'datasets/NaPTAN_transport-access-node.geojson'
  });



  // Add GeoJSON source for Tree Preservation Zones
  // Source: Local Planning Authorities, Tree Preservation Zones dataset
  // Date collected: 2025-08-02
  map.addSource('tree-preservation-zones', {
    type: 'geojson',
    data: 'datasets/LPA_tree-preservation-zone.geojson'
  });


  // Add GeoJSON source for Article 4 Direction Area
  // Source: Local Planning Authorities, Article 4 Direction Areas dataset
  // Date collected: 2025-08-02
  map.addSource('article-4-direction', {
    type: 'geojson',
    data: 'datasets/LPA_article-4-direction-area.geojson'
  });


}
window.addSources = addSources; // Export function for use in main.js