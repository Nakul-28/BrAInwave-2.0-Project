/**
 * MapLibre Style References
 * 
 * Open-source map style URLs for different themes.
 * Used by MapView component for base map rendering.
 * No API keys or tokens required.
 */

export const MAP_STYLES = {
  // Official MapLibre demo tiles (OpenStreetMap-based)
  DEMO: 'https://demotiles.maplibre.org/style.json',
  
  // OpenMapTiles styles (when self-hosting or using their service)
  // OSM_BRIGHT: 'https://api.maptiler.com/maps/openstreetmap/style.json',
  
  // Alternative: Can point to any OpenStreetMap-compatible style JSON
} as const;

// Default style for the application
export const DEFAULT_STYLE = MAP_STYLES.DEMO;

/**
 * Default map configuration for Delhi, India
 */
export const DELHI_CENTER: [number, number] = [77.2090, 28.6139]; // [longitude, latitude]
export const DEFAULT_ZOOM = 11;
export const DEFAULT_PITCH = 0;
export const DEFAULT_BEARING = 0;
