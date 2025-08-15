/**
 * search.js
 *
 * This module provides a simple search functionality for map features using MapLibre GL JS.
 * It allows users to search for features by name across specified layers and centers the map on the first match found.
 *
 * Reasoning & Design Choices:
 * - Uses `map.querySourceFeatures(layerId)` to efficiently search for features in each layer.
 * - Searches only the 'name' property, assuming features have a 'name' field for user-friendly queries.
 * - Converts both query and feature names to lowercase for case-insensitive matching.
 * - On match, centers the map and shows a popup for immediate user feedback.
 * - Alerts the user if no match is found, providing clear feedback.
 * - Exposed as `window.setupSearch` for easy integration in HTML and other scripts.
 *
 * This approach is simple and fast for small to medium datasets, and avoids external dependencies.
 * For larger datasets or fuzzy search, consider integrating a dedicated search library or indexing strategy.
 */
function setupSearch(map, searchableLayers) {
  const input = document.getElementById('search-input');
  const button = document.getElementById('search-button');

  button.addEventListener('click', () => {
    const query = input.value.trim().toLowerCase();
    if (!query) return;

    for (const layerId of searchableLayers) {
      const features = map.querySourceFeatures(layerId);

      const match = features.find(f =>
        f.properties &&
        f.properties.name &&
        f.properties.name.toLowerCase().includes(query)
      );

      if (match) {
        const [lng, lat] = match.geometry.coordinates;
        map.flyTo({ center: [lng, lat], zoom: 16 });

        new maplibregl.Popup()
          .setLngLat([lng, lat])
          .setHTML(`<strong>${match.properties.name}</strong>`)
          .addTo(map);
        return;
      }
    }

    alert("No matching feature found.");
  });
}

// Attach the function to the window so it's globally accessible
window.setupSearch = setupSearch;
