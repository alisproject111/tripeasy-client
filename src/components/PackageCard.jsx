"use client";

import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import "../styles/PackageCard.css";
import AnimatedElement from "./AnimatedElement";
import Toast from "./Toast";
import LazyImage from "./LazyImage";

function PackageCard({ package: pkg }) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isCheckingPdf, setIsCheckingPdf] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  // Format duration as nights/days (e.g., 4N/5D)
  const formatDuration = useCallback((days) => {
    const nights = days - 1;
    return `${nights}N/${days}D`;
  }, []);

  // Calculate discount percentage
  const calculateDiscount = useCallback((originalPrice, currentPrice) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }, []);

  // Memoize original price calculation
  const originalPrice = useMemo(() => {
    return Math.round(pkg.price * (1 + Math.random() * 0.1 + 0.1));
  }, [pkg.price]);

  // Handle sharing functionality
  const handleShare = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/package/${pkg.name
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    if (navigator.share) {
      navigator
        .share({
          title: pkg.name,
          text: `Check out this amazing travel package: ${pkg.name}`,
          url: shareUrl,
        })
        .catch((error) => {
          console.error("Error sharing:", error);
          copyToClipboard(shareUrl);
        });
    } else {
      copyToClipboard(shareUrl);
    }
  }, [pkg.name]);

  // Copy to clipboard
  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text).catch((error) => {
      console.error("Error copying to clipboard:", error);
    });
  }, []);

  // Optimized PDF download with on-demand loading
  const handleDownload = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCheckingPdf || isPdfLoading) return;

    setIsCheckingPdf(true);
    setIsPdfLoading(true);

    // Check if the package has a PDF URL
    if (pkg.pdfUrl && pkg.pdfUrl.trim() !== "") {
      const packageFileName = pkg.name.replace(/\s+/g, "-").toLowerCase();

      // Load PDF on-demand when user clicks download
      const pdfLink = document.createElement("a");
      pdfLink.href = pkg.pdfUrl;
      pdfLink.download = `${packageFileName}.pdf`;
      pdfLink.style.display = "none";

      // Add to DOM and trigger download
      document.body.appendChild(pdfLink);

      // Use setTimeout to ensure browser recognizes the element
      setTimeout(() => {
        pdfLink.click();
        document.body.removeChild(pdfLink);

        // Show success toast
        setToastMessage("PDF downloaded successfully!");
        setToastType("success");
        setShowToast(true);

        setIsCheckingPdf(false);
        setIsPdfLoading(false);

        // Hide notification after 3 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }, 100);
    } else {
      // Show error if PDF not available
      setToastMessage("PDF not available for this package");
      setToastType("error");
      setShowToast(true);
      setIsCheckingPdf(false);
      setIsPdfLoading(false);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  }, [pkg.name, pkg.pdfUrl, isCheckingPdf, isPdfLoading]);

  return (
    <AnimatedElement animation="fade-up">
      <div className="package-card">
        <div className="package-image-container">
          <LazyImage
            src={pkg.image || "/placeholder.svg"}
            alt={pkg.name}
            className="package-image"
            loading="lazy"
            decoding="async"
          />
          <div className="package-duration">
            <i className="fas fa-clock"></i> {formatDuration(pkg.duration)}
          </div>
          <div className="package-actions">
            <button
              className={`package-action-btn download-btn ${
                isCheckingPdf || isPdfLoading ? "checking" : ""
              }`}
              onClick={handleDownload}
              aria-label="Download PDF"
              disabled={isCheckingPdf || isPdfLoading}
              title="Download package itinerary"
            >
              {isCheckingPdf || isPdfLoading ? (
                <div className="btn-preloader"></div>
              ) : (
                <i className="fas fa-download"></i>
              )}
            </button>
            <button
              className="package-action-btn share-btn"
              onClick={handleShare}
              aria-label="Share Package"
            >
              <i className="fas fa-share-alt"></i>
            </button>
          </div>
        </div>

        <div className="package-content">
          <h3 className="package-title1">{pkg.name}</h3>

          <div className="package-location">
            <i className="fas fa-map-marker-alt"></i>
            <span>{pkg.location}</span>
          </div>

          <div className="package-features">
            <div className="feature-row">
              <div className="feature-item">
                <i className="fas fa-hotel"></i>
                <span>4 Star Hotel</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-mountain"></i>
                <span>
                  {pkg.highlights && pkg.highlights[0]
                    ? pkg.highlights[0]
                    : "Scenic Views"}
                </span>
              </div>
            </div>

            <div className="feature-row">
              <div className="feature-item">
                <i className="fas fa-monument"></i>
                <span>
                  {pkg.highlights && pkg.highlights[1]
                    ? pkg.highlights[1]
                    : "Famous Sights"}
                </span>
              </div>
              <div className="feature-item">
                <i className="fas fa-umbrella-beach"></i>
                <span>
                  {pkg.highlights && pkg.highlights[2]
                    ? pkg.highlights[2]
                    : "Local Experiences"}
                </span>
              </div>
            </div>

            <div className="feature-row">
              <div className="feature-item">
                <i className="fas fa-utensils"></i>
                <span>Breakfast & Dinner</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-camera"></i>
                <span>
                  {pkg.highlights && pkg.highlights[3]
                    ? pkg.highlights[3]
                    : "Sightseeing"}
                </span>
              </div>
            </div>
          </div>

          <div className="package-price-container">
            <div className="price-details">
              <div className="original-price">
                ₹{originalPrice.toLocaleString("en-IN")}
              </div>
              <div className="current-price">
                ₹{pkg.price.toLocaleString("en-IN")}
              </div>
              <div className="price-per">per person</div>
            </div>

            <Link
              to={`/package/${pkg.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="read-more-btn"
              onClick={() => window.scrollTo(0, 0)}
            >
              <i className="fas fa-eye"></i> Read More
            </Link>
          </div>
        </div>
      </div>

      {/* Toast notification will be rendered in a portal at the app level */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </AnimatedElement>
  );
}

export default PackageCard;
