/*
  SOURCES.JS - Urban Design Webmapping Data Sources

  This file defines all the data sources used in the web mapping application for urban design analysis. The reasoning for using GeoJSON is its wide support in web mapping libraries (such as Mapbox GL JS and Leaflet), its human-readable format, and its ability to represent complex spatial features (points, lines, polygons) with associated properties. GeoJSON is ideal for client-side rendering and interactive mapping, making it suitable for modern web-based GIS applications.

  Most datasets were provided in GeoJSON format, but some required preprocessing. For those not originally in GeoJSON, I used QGIS to convert and clean the data, ensuring compatibility and spatial accuracy. The Canterbury boundary was used to filter and clip datasets to the relevant study area, focusing the analysis on the local urban context.

  The datasets chosen cover a broad spectrum of urban design factors, including heritage assets, land use, building heights, green infrastructure, flood risk, transport, and planning boundaries. Each dataset was selected for its relevance to urban design decision-making, availability, and authoritative source. By integrating these diverse datasets, the map provides a holistic view of the urban environment, supporting analysis and planning for sustainable, resilient, and context-sensitive urban design.

  Data sources include:
    - Historic England (heritage assets)
    - Natural England (environmental features)
    - Local Planning Authorities (planning boundaries, conservation areas)
    - Ordnance Survey (topography)
    - Kent County Council (streetlighting, PROW)
    - British Geological Survey (hydrogeology, boreholes)
    - Department for Education, MHCLG (educational establishments, brownfield sites)
    - National Tree Officers Association (tree data)
    - Forest Research (canopy cover)
    - Environment Agency (flood risk)
    - Office for National Statistics (built-up areas)
    - OpenStreetMap (land use, POIs)

  These datasets enable multi-layered spatial analysis for urban design, helping users understand constraints, opportunities, and context for development and placemaking.
*/
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
  // Source: The National Public Transport Access Nodes (NaPTAN) dataset
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

  // Add GeoJSON source for Flood Risk Data
  // Source: Environment Agency, Flood Risk dataset
  // Date collected: 2023-08-24
  // Note: This dataset is large, and has been filtered to only include relevant areas
  map.addSource('flood-risk', {
    type: 'geojson',
    data: 'datasets/flood_risk_kent_filtered.geojson'
  });

  // Add GeoJSON source for Borehole scans
  // Source: British Geological Survey, Borehole scans dataset
  // Date collected: 2024-10-01
  map.addSource('boreholes', {
    type: 'geojson',
    data: 'datasets/Borehole_scans.geojson'
  });

  // Add GeoJSON source for Hydrogelogy Features
  // Source: British Geological Survey, Hydrogelogy Features dataset
  // Date collected: 2024-10-01
  map.addSource('Hydrogelogy-features', {
    type: 'geojson',
    data: 'datasets/Hydrogelogy_625000_scale.geojson'
  });

  //Add GeoJSON source for PROW
  // Source: rowmaps- Kent County Council, PROW dataset
  // Date collected: 2025-05-14
  map.addSource('PROW', {
    type: 'geojson',
    data: 'datasets/rowmaps_Kent_PROW.geojson'
  });

  //Add GeoJSON source for contour points
  // Source: Ordnance Survey, Contour Points dataset
  // Date collected: 2025-05-14
  map.addSource('contour-points', {
    type: 'geojson',
    data: 'datasets/contourpoints.geojson'
  });

  // Add GeoJSON source for contour lines
  // Source: Ordnance Survey, Contour Lines dataset
  // Date collected: 2025-05-14
  map.addSource('contour-lines', {
    type: 'geojson',
    data: 'datasets/contourlines.geojson'
  });

  // Add GeoJSON source for Streetlighting
  // Source: Kent County Council, Streetlighting dataset
  // Date collected: 2025-05-14
  map.addSource('streetlighting', {
    type: 'geojson',
    data: 'datasets/Streetlighting_Kent.geojson'
  });

  // Add GeoJSON source for Streetlighting buffer
  // Source: Kent County Council, Streetlighting Buffer dataset
  // Date collected: 2025-05-14
  map.addSource('streetlighting-buffer', {
    type: 'geojson',
    data: 'datasets/bufferlighting.geojson'
  });

  // Add GeoJSON source for Streetlighting shadows
  // Source: Kent County Council, Streetlighting Shadows dataset
  // Date collected: 2025-05-14
  map.addSource('streetlighting-shadows', {
    type: 'geojson',
    data: 'datasets/streetlightshadows.geojson'
  });



}
window.addSources = addSources; // Export function for use in main.js