"use client";

import { useState, useEffect, useRef } from "react";
import { generatePlaceholder, createLazyLoadObserver, optimizeImageElement } from "../utils/imageOptimization";

/**
 * LazyImage Component
 * Implements lazy loading with intersection observer for images
 * Shows placeholder while image is loading
 */
// Global cache to track images that have already loaded successfully in this session
const loadedImagesCache = new Set();

/**
 * LazyImage Component
 * Implements lazy loading with intersection observer for images
 * Shows placeholder while image is loading
 */
const LazyImage = ({
  src,
  alt,
  className = "",
  placeholder = null,
  onLoad = null,
  onError = null,
  width = null,
  height = null,
  style = {},
  decoding = "async",
  loading = "lazy",
}) => {
  const isAlreadyLoaded = src ? loadedImagesCache.has(src) : false;
  const [imageSrc, setImageSrc] = useState(isAlreadyLoaded ? src : null);
  const [isLoading, setIsLoading] = useState(!isAlreadyLoaded);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (isAlreadyLoaded) return;
    const currentElement = imageRef.current;
    if (!currentElement || !src) return;

    // Create intersection observer for lazy loading
    observerRef.current = createLazyLoadObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Image is in viewport, load it
          if (src) {
            setImageSrc(src);
          }

          // Stop observing after image is loaded
          if (observerRef.current && currentElement) {
            observerRef.current.unobserve(currentElement);
          }
        }
      });
    });

    // Start observing the image element
    observerRef.current.observe(currentElement);

    return () => {
      if (observerRef.current && currentElement) {
        observerRef.current.unobserve(currentElement);
      }
    };
  }, [src, isAlreadyLoaded]);

  // Optimize the image element
  useEffect(() => {
    if (imageRef.current) {
      optimizeImageElement(imageRef.current);
      imageRef.current.setAttribute("loading", loading);
      if (decoding) imageRef.current.setAttribute("decoding", decoding);
    }
  }, [loading, decoding]);

  const displaySrc = imageSrc || placeholder || generatePlaceholder(width, height);

  return (
    <img
      ref={imageRef}
      src={displaySrc || "/placeholder.svg"}
      alt={alt}
      className={`lazy-image ${className} ${isLoading ? "loading" : ""} ${hasError ? "error" : ""}`}
      width={width}
      height={height}
      style={{
        ...style,
        opacity: isLoading ? 0.7 : 1,
      }}
      onLoad={() => {
        if (imageSrc === src) {
          setIsLoading(false);
          loadedImagesCache.add(src);
          if (onLoad) onLoad();
        }
      }}
      onError={() => {
        if (imageSrc === src) {
          setIsLoading(false);
          setHasError(true);
          if (onError) onError();
        }
      }}
      loading={loading}
      decoding={decoding}
    />
  );
};

export default LazyImage;
