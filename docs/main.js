// Entry point for the main map logic
/**
 * main.js - Map initialization and UI setup for the Mapsite project
 *
 * This file is the entry point for setting up the interactive map using MapLibre GL JS.
 * It initializes the map with a custom style, sets the center and zoom for the Kent area,
 * and enables features needed for exporting map images (preserveDrawingBuffer).
 *
 * Controls, popups, sidebar, toggles, charts, and search are modularized for clarity and maintainability.
 * Data sources and layers are loaded dynamically, allowing for easy extension and customization.
 *
 * Design choices:
 * - MapLibre GL JS is used for open-source flexibility and compatibility with MapTiler styles.
 * - preserveDrawingBuffer is enabled to support map export functionality.
 * - All UI features (popups, sidebar, toggles, charts, search) are initialized after the map loads,
 *   ensuring that the map is ready before user interaction is enabled.
 * - Layer IDs are collected dynamically for future extensibility (e.g., toggling, searching).
 *
 * This structure makes it easy for future developers to add new features, layers, or data sources
 * by updating the relevant setup functions. Each major feature is separated for clarity.
 */
console.log("main.js is loaded");


// Initialize the MapLibre GL JS map
const map = new maplibregl.Map({
  container: 'map', // HTML element id for the map
  style: 'https://api.maptiler.com/maps/streets/style.json?key=sLTnVyFpuI1axO89l1hV', // Map style URL
  center: [1.0830, 51.2797], // Initial map center [lng, lat]
  zoom: 13, // Initial zoom level
  preserveDrawingBuffer: true // important for exporting map as image
});

// Add navigation controls to the map (zoom, rotation)
map.addControl(new maplibregl.NavigationControl(), 'bottom-left');
// Enable scroll zoom
map.scrollZoom.enable();

// Will hold IDs of available layers after they are added
let availableLayers = [];

// When the map has finished loading, set up sources, layers, controls, and features
map.on('load', () => {
  addSources(map); // Add data sources (GeoJSON, etc.)
  addLayers(map); // Add visual layers to the map
  setupPopups(map); // Enable popups for features
  setupSidebar(map); // Set up sidebar UI
  setupToggles(map); // Add layer toggles
  setupCharts(map); // Initialize charts/graphs
  fetchOverpassData(map); // Fetch data from Overpass API

  setupSearch(map, ['schools-layer', 'monuments-layer']); // Enable search for specific layers

  // Dynamically get all layer IDs after layers are added
  availableLayers = window.customLayerIds;
});

