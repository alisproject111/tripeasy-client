"use client";

import { useState, useEffect, useRef } from "react";
import { generatePlaceholder, createLazyLoadObserver, optimizeImageElement } from "../utils/imageOptimization";

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
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!imageRef.current || !src) return;

    // Create intersection observer for lazy loading
    observerRef.current = createLazyLoadObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Image is in viewport, load it
          if (imageRef.current && src) {
            setImageSrc(src);

            // Preload image to ensure it's loaded before displaying
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              setIsLoading(false);
              setHasError(false);
              if (onLoad) onLoad();
            };
            img.onerror = () => {
              setIsLoading(false);
              setHasError(true);
              if (onError) onError();
            };
            img.src = src;
          }

          // Stop observing after image is loaded
          if (observerRef.current && imageRef.current) {
            observerRef.current.unobserve(imageRef.current);
          }
        }
      });
    });

    // Start observing the image element
    observerRef.current.observe(imageRef.current);

    return () => {
      if (observerRef.current && imageRef.current) {
        observerRef.current.unobserve(imageRef.current);
      }
    };
  }, [src, onLoad, onError]);

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
      className={`${className} ${isLoading ? "loading" : ""} ${hasError ? "error" : ""}`}
      width={width}
      height={height}
      style={{
        ...style,
        opacity: isLoading ? 0.7 : 1,
        transition: "opacity 0.3s ease-in-out",
      }}
      onLoad={() => {
        setIsLoading(false);
        if (onLoad) onLoad();
      }}
      onError={() => {
        setIsLoading(false);
        setHasError(true);
        if (onError) onError();
      }}
      loading={loading}
      decoding={decoding}
    />
  );
};

export default LazyImage;
