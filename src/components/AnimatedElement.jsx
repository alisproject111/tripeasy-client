"use client";

import { useEffect, useRef, useState } from "react";
import "../styles/AnimatedElement.css";

// This component wraps content and animates it when it enters the viewport
function AnimatedElement({
  children,
  animation = "fade-up", // fade-up, fade-left, fade-right, zoom-in
  delay = 0,
  duration = 800,
  threshold = 0.2, // How much of the element needs to be visible to trigger animation
  className = "",
  once = true, // Whether to animate only once or every time the element enters viewport
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if (once && hasAnimated) return;
          setIsVisible(true);
          setHasAnimated(true);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px",
      }
    );

    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, once, hasAnimated]);

  const animationStyle = {
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`,
  };

  return (
    <div
      ref={elementRef}
      className={`animated-element ${animation} ${
        isVisible ? "animate" : ""
      } ${className}`}
      style={animationStyle}
    >
      {children}
    </div>
  );
}

export default AnimatedElement;
