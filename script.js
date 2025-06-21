/**
 * FILE: script.js
 * PROJECT: MapSite
 * PURPOSE: Controls map initialisation, data loading, and layer interactivity.
 * TECH: LeafletJS (v1.9.3), JavaScript
 * 
 * KEY FUNCTIONALITY:
 * 1. Initialises a Leaflet map centered on Canterbury, UK.
 * 2. Loads and displays GeoJSON data (listed buildings) with styled polygons aand trees as green circles.
 * 3. Toggles visibility via checkbox.
 * 4. Shows/hides layer controls via dropdown button.
 * 
 * DEPENDENCIES:
 * - LeafletJS (loaded via CDN in index.html)
 * - GeoJSON file: datasets/NH_Listed_Building_polygons.geojson
 * - GeoJSON file: datasets/osm_trees.geojson
 * - HTML elements (see index.html for IDs):
 *   - Map container: <div id="map">
 *   - Toggle checkbox: <input id="toggle-listed">
 *   - Layer button: <button id="layer-btn">
 * 
 * USAGE:
 * 1. Ensure Leaflet and HTML structure are loaded.
 * 2. Place GeoJSON file in the specified path.
 * 3. Interact via:
 *   - Checkbox: Toggle listed buildings layer.
 *   - Button: Show/hide layer options panel.
 * 
 * LAST UPDATED: 16.06.2024
 */




// Initialise map, coordinates and zoom level
var map = L.map('map').setView([51.2797, 1.0830], 13);

// OpenStreetMap base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map); // Add OpenStreetMap layer

let listedBuildingsLayer; // Variable to hold the listed buildings layer

// Function to load GeoJSON with error handling
function loadGeoJson(url, options = {}) {
  return fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json(); // Throws an error if the HTTP request fails
    })
    .then(data => {
      const layer = L.geoJSON(data, { // Converts GeoJSON data into a Leaflet layer.
        style: {
          color: "#1f77b4", // Blue colour for the polygons
          weight: 2,
          fillOpacity: 0.5
        },
        // Bind popups to each feature (building)
        onEachFeature: function (feature, layer) {
          const p = feature.properties;
          layer.bindPopup(`
            <b>${p.Name || "Building"}</b><br>
            Grade: ${p.Grade || "Unknown"}<br>
            ${p.hyperlink ? `<a href="${p.hyperlink}" target="_blank">Historic England</a>` : ''}
          `);
        },
        ...options // allow additional options to be passed
      });

      layer.addTo(map); // Add the layer to the map
      return layer;      
    })
    .catch(err => {
      console.error('Error loading GeoJSON:', err); // Log errors
    });
}



// Load the listed buildings GeoJSON and store the layer in `listedBuildingsLayer`
loadGeoJson('datasets/NH_Listed_Building_polygons.geojson').then(layer => {
  listedBuildingsLayer = layer;
});


let treeLayer; // Variable to hold the tree layer

loadGeoJson('datasets/osm_trees.geojson', {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 5,
      color: "#228B22", // forest green
      fillColor: "#32CD32",
      fillOpacity: 0.7,
      weight: 1
    });
  },
  onEachFeature: function (feature, layer) {
    const p = feature.properties;
    layer.bindPopup(`
      <b>Tree</b><br>
      Species: ${p.species || "Unknown"}<br>
      Age: ${p.age || "N/A"}
    `);
  }
}).then(layer => {
  treeLayer = layer;
});

document.addEventListener('DOMContentLoaded', () => {
  // Layer toggle button
  const layerBtn = document.getElementById('layer-btn');
  const layerOptions = document.getElementById('layer-options');

  if (layerBtn && layerOptions) {
    layerBtn.addEventListener('click', () => {
      layerOptions.classList.toggle('hidden');
    });
  }

  // Toggle listed buildings
  const toggleListed = document.getElementById('toggle-listed');
  if (toggleListed) {
    toggleListed.addEventListener('change', (e) => {
      if (listedBuildingsLayer) {
        e.target.checked ? listedBuildingsLayer.addTo(map) : map.removeLayer(listedBuildingsLayer);
      }
    });
  }

  // Toggle tree layer
  const toggleTrees = document.getElementById('toggle-trees');
  if (toggleTrees) {
    toggleTrees.addEventListener('change', (e) => {
      if (treeLayer) {
        e.target.checked ? treeLayer.addTo(map) : map.removeLayer(treeLayer);
      }
    });
  }
});
