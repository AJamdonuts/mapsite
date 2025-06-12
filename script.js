// Initialise map
var map = L.map('map').setView([51.2797, 1.0830], 13);

// base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let listedBuildingsLayer;

// Function to load GeoJSON with error handling
function loadGeoJson(url, options = {}) {
  return fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      const layer = L.geoJSON(data, {
        style: {
          color: "#1f77b4",
          weight: 2,
          fillOpacity: 0.5
        },
        onEachFeature: function (feature, layer) {
          const p = feature.properties;
          layer.bindPopup(`
            <b>${p.Name || "Building"}</b><br>
            Grade: ${p.Grade || "Unknown"}<br>
            ${p.hyperlink ? `<a href="${p.hyperlink}" target="_blank">Historic England</a>` : ''}
          `);
        },
        ...options
      });

      layer.addTo(map); 
      return layer;      
    })
    .catch(err => {
      console.error('Error loading GeoJSON:', err);
    });
}

// Load dataset
loadGeoJson('datasets/NH_Listed_Building_polygons.geojson').then(layer => {
  listedBuildingsLayer = layer;
});

document.addEventListener('DOMContentLoaded', () => {
  const toggleCheckbox = document.getElementById('toggle-listed');
  if (toggleCheckbox) {
    toggleCheckbox.addEventListener('change', function (e) {
      if (listedBuildingsLayer) {
        if (e.target.checked) {
          listedBuildingsLayer.addTo(map);
        } else {
          map.removeLayer(listedBuildingsLayer);
        }
      }
    });
  }

  // Toggle dropdown visibility
  document.getElementById('layer-btn').addEventListener('click', () => {
    const options = document.getElementById('layer-options');
    options.classList.toggle('hidden');
  });
});