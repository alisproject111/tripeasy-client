"use client";

import "../styles/SkeletonLoader.css";

/**
 * SkeletonLoader Component
 * Displays a shimmer animation while content is loading
 */
const SkeletonLoader = ({ width = "100%", height = "180px", borderRadius = "8px", count = 1 }) => {
  return (
    <div className="skeleton-loaders-container">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="skeleton-loader"
          style={{
            width,
            height,
            borderRadius,
          }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
