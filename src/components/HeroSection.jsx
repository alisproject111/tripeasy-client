"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/HeroSection.css";

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      image: "/assets/hero/hero-background-1.jpg", // Updated path
      title: "Best Travel Packages in India - Domestic & International Tours",
      subtitle:
        "Discover incredible India with our premium holiday packages. Goa beaches, Kerala backwaters, Himachal mountains - all at unbeatable prices",
    },
    {
      image: "/assets/hero/hero-background-2.jpg", // Updated path
      title: "International Holiday Packages - Bali, Thailand, Vietnam Tours",
      subtitle:
        "Explore exotic destinations with our affordable international tour packages. Bali temples, Thailand beaches, Vietnam culture - book now!",
    },
    {
      image: "/assets/hero/hero-background-3.jpg", // Updated path
      title: "Family Vacation & Honeymoon Packages - Create Lasting Memories",
      subtitle:
        "Perfect family holidays and romantic honeymoon packages tailored for you. Adventure tours, cultural trips, beach vacations - all inclusive deals",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevSlide(currentSlide);
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  return (
    <section className="hero-section">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? "active" : ""} ${
              index === prevSlide && isTransitioning ? "prev" : ""
            }`}
          >
            {/* Use a semi-transparent overlay div and an img tag instead of background-image */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 0,
              }}
            ></div>
            <img
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              className="hero-image"
            />
            <div className="hero-content">
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
            </div>
          </div>
        ))}

        <div className="hero-buttons">
          <Link to="/packages" className="btn btn-primary">
            <i className="fas fa-box"></i>
            <span>View Packages</span>
          </Link>
          <Link to="/contact" className="btn btn-contact">
            <i className="fas fa-envelope"></i>
            <span>Contact Us</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;