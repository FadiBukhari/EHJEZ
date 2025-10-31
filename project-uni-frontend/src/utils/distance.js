// Distance calculation utilities using Haversine formula

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} radians
 */
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 * @param {number} km - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (km) => {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
};

/**
 * Sort array of locations by distance from a point
 * @param {Array} locations - Array of objects with lat/lng
 * @param {number} userLat - User's latitude
 * @param {number} userLng - User's longitude
 * @returns {Array} Sorted array with distance property added
 */
export const sortByDistance = (locations, userLat, userLng) => {
  return locations
    .map((location) => ({
      ...location,
      distance: calculateDistance(
        userLat,
        userLng,
        location.latitude,
        location.longitude
      ),
    }))
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Filter locations by radius
 * @param {Array} locations - Array with distance property
 * @param {number} radiusKm - Maximum radius in kilometers
 * @returns {Array} Filtered array
 */
export const filterByRadius = (locations, radiusKm) => {
  return locations.filter((location) => location.distance <= radiusKm);
};
