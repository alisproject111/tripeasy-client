'use client';

import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for Intersection Observer
 * Detects when an element enters or leaves the viewport
 */
export const useIntersectionObserver = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const defaultOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
      ...options,
    };

    if (!("IntersectionObserver" in window)) {
      // Fallback for browsers without IntersectionObserver support
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Once element is visible, we can stop observing
        observer.unobserve(entry.target);
      } else {
        setIsVisible(false);
      }
    }, defaultOptions);

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isVisible];
};

export default useIntersectionObserver;
