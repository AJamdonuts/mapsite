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
