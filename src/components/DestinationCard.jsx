"use client";

import { Link } from "react-router-dom";
import "../styles/DestinationCard.css";

function DestinationCard({ destination }) {
  // Generate a search query that will match packages more effectively
  const generateSearchQuery = () => {
    // Extract main location names from the destination
    const commonWords = [
      "india",
      "the",
      "and",
      "&",
      ",",
      "-",
      "of",
      "in",
      "at",
      "to",
      "for",
      "with",
      "by",
      "a",
      "an",
      "escape",
      "retreat",
      "tour",
      "adventure",
      "getaway",
      "vacation",
      "holiday",
      "trip",
      "experience",
      "expedition",
      "journey",
      "splendor",
      "bliss",
      "explorer",
      "package",
      "packages",
    ];

    const destinationWords = destination.name
      .toLowerCase()
      .split(/[\s,&-]+/)
      .filter((word) => word.length > 2 && !commonWords.includes(word));

    // Use the first two significant words for the search query
    return destinationWords.slice(0, 2).join(" ");
  };

  return (
    <div className="destination-card">
      <div className="destination-image-container">
        <img
          src={destination.image || "/placeholder.svg"}
          alt={destination.name}
          className="destination-image"
          loading="lazy"
        />
        <div className="destination-overlay">
          <Link
            to={`/packages?destination=${encodeURIComponent(
              generateSearchQuery()
            )}#package-list`}
            className="explore-btn"
          >
            <span>Explore</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
      <div className="destination-content">
        <h3 className="destination-name">{destination.name}</h3>
        <p className="destination-count">
          <i className="fas fa-box"></i> {destination.count} Packages
        </p>
      </div>
    </div>
  );
}

export default DestinationCard;
