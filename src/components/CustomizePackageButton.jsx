"use client";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/CustomizePackageButton.css";
import CustomizePackageModal from "./CustomizePackageModal";

function CustomizePackageButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();

  // Only show on home page and packages page
  const isAllowedPage =
    location.pathname === "/" || location.pathname === "/packages";

  // Show button after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300 && isAllowedPage) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAllowedPage]);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  if (!isAllowedPage) return null;

  return (
    <>
      {isVisible && (
        <button
          className="customize-pkg-button"
          onClick={openModal}
          aria-label="Customize Package"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <i className="fas fa-wand-magic-sparkles"></i>
          {showTooltip && (
            <div className="pkg-tooltip">Design your perfect trip</div>
          )}
        </button>
      )}

      {isModalOpen && <CustomizePackageModal onClose={closeModal} />}
    </>
  );
}

export default CustomizePackageButton;
