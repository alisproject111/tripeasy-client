// Simple in-memory client-side cache singleton for single-page application performance optimization
const cache = {};

/**
 * Get data from the client-side in-memory cache
 * @param {string} key - Cache key
 * @returns {any|null} The cached data or null if not cached
 */
export const getCachedData = (key) => {
  return cache[key] || null;
};

/**
 * Set data in the client-side in-memory cache
 * @param {string} key - Cache key
 * @param {any} data - Data to store
 */
export const setCachedData = (key, data) => {
  cache[key] = data;
};

/**
 * Check if the cache has a specific key
 * @param {string} key - Cache key
 * @returns {boolean} True if key exists in cache
 */
export const hasCachedData = (key) => {
  return !!cache[key];
};
