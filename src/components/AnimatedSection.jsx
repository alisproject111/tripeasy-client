"use client";

import { useEffect, useRef, useState } from "react";
import "../styles/AnimatedSection.css";

function AnimatedSection({
  children,
  className = "",
  staggered = false,
  staggerDelay = 100,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px",
      }
    );

    observer.observe(currentSection);

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [hasAnimated]);

  return (
    <div
      ref={sectionRef}
      className={`animated-section ${staggered ? "stagger-children" : ""} ${
        isVisible ? "animate" : ""
      } ${className}`}
      style={
        staggered
          ? {
              "--stagger-delay": `${staggerDelay}ms`,
            }
          : {}
      }
    >
      {children}
    </div>
  );
}

export default AnimatedSection;
