/**
 * Image Optimization Utilities
 * Provides utilities for lazy loading, image placeholders, and performance optimization
 */

// Generate a blurred placeholder image using CSS
export const generatePlaceholder = (width = 400, height = 300, color = '#e0e0e0') => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
      <text x="50%" y="50%" font-size="14" fill="#999" text-anchor="middle" dominant-baseline="middle">
        Loading image...
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Get responsive image source with srcset
export const getResponsiveImageSrc = (imagePath, sizes = [480, 768, 1200, 1920]) => {
  if (!imagePath) return null;

  // If it's already a full URL or data URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return { src: imagePath, srcSet: null };
  }

  // Generate srcset for responsive images
  const srcSet = sizes
    .map(size => `${imagePath}?w=${size} ${size}w`)
    .join(', ');

  return {
    src: imagePath,
    srcSet: srcSet,
  };
};

// Preload critical images
export const preloadImage = (imagePath) => {
  if (!imagePath) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = imagePath;
  document.head.appendChild(link);
};

// Create an Intersection Observer for lazy loading
export const createLazyLoadObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  };

  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, defaultOptions);
  }

  // Fallback for browsers that don't support IntersectionObserver
  return null;
};

// Optimize image by adding loading attribute and srcset
export const optimizeImageElement = (element) => {
  if (!element) return;

  // Add lazy loading attribute
  if (!element.hasAttribute('loading')) {
    element.setAttribute('loading', 'lazy');
  }

  // Add decoding attribute for better performance
  if (!element.hasAttribute('decoding')) {
    element.setAttribute('decoding', 'async');
  }
};

// Check if image is critical (above the fold)
export const isImageAboveFold = (element) => {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // If image is within viewport height + 300px buffer, consider it above fold
  return rect.top < windowHeight + 300;
};

// Preload images that are above the fold or critical
export const preloadCriticalImages = (imageElements) => {
  imageElements.forEach(element => {
    if (isImageAboveFold(element) && element.src) {
      preloadImage(element.src);
    }
  });
};

// Format image cache key for localStorage
export const getImageCacheKey = (imagePath) => {
  return `img_cache_${btoa(imagePath)}`;
};

// Clear old image cache
export const clearImageCache = () => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('img_cache_')) {
      localStorage.removeItem(key);
    }
  });
};

const imageOptimizationUtils = {
  generatePlaceholder,
  getResponsiveImageSrc,
  preloadImage,
  createLazyLoadObserver,
  optimizeImageElement,
  isImageAboveFold,
  preloadCriticalImages,
  getImageCacheKey,
  clearImageCache,
};

export default imageOptimizationUtils;
