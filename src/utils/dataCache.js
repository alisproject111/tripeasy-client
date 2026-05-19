// In-memory cache for API responses to prevent redundant requests and spinners during page navigation
let cache = {
  featuredPackages: null,
  allPackages: null,
  destinations: null,
  individualPackages: new Map(), // idOrSlug -> packageData
};

export const getCachedFeaturedPackages = () => cache.featuredPackages;
export const setCachedFeaturedPackages = (data) => {
  cache.featuredPackages = data;
};

// Aliases for backward compatibility
export const getCachedPackages = getCachedFeaturedPackages;
export const setCachedPackages = setCachedFeaturedPackages;

export const getCachedAllPackages = () => cache.allPackages;
export const setCachedAllPackages = (data) => {
  cache.allPackages = data;
};

export const getCachedDestinations = () => cache.destinations;
export const setCachedDestinations = (data) => {
  cache.destinations = data;
};

export const getCachedPackageByIdOrSlug = (idOrSlug) => {
  if (!idOrSlug) return null;
  const key = idOrSlug.toString().toLowerCase();
  if (cache.individualPackages.has(key)) {
    return cache.individualPackages.get(key);
  }

  const all = cache.allPackages || [];
  const featured = cache.featuredPackages || [];
  const list = [...all, ...featured];
  
  // Try numeric ID
  const numId = parseInt(idOrSlug);
  if (!isNaN(numId)) {
    const pkg = list.find(p => p.id === numId);
    if (pkg) return pkg;
  }
  
  // Try slug matching
  const slug = key.replace(/-/g, " ");
  const pkg = list.find(p => p.name.toLowerCase() === slug);
  if (pkg) return pkg;

  return null;
};

export const setCachedPackage = (idOrSlug, data) => {
  if (!idOrSlug || !data) return;
  const key = idOrSlug.toString().toLowerCase();
  cache.individualPackages.set(key, data);
  // Also store by its package name slug and id if possible
  if (data.id) {
    cache.individualPackages.set(data.id.toString().toLowerCase(), data);
  }
  if (data.name) {
    const nameSlug = data.name.toLowerCase().replace(/\s+/g, "-");
    cache.individualPackages.set(nameSlug, data);
  }
};

export const clearCache = () => {
  cache.featuredPackages = null;
  cache.allPackages = null;
  cache.destinations = null;
  cache.individualPackages.clear();
};
