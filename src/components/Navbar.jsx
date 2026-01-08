"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Check which section is currently in view
      const sections = [
        "home",
        "packages",
        "destinations",
        "monthly-destinations",
        "about",
      ];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Set active section based on location pathname
  useEffect(() => {
    if (location.pathname === "/") {
      setActiveSection("home");
    } else if (location.pathname === "/packages") {
      setActiveSection("packages");
    } else if (location.pathname === "/about") {
      setActiveSection("about");
    } else if (location.pathname === "/contact") {
      setActiveSection("contact");
    } else if (location.pathname.startsWith("/package/")) {
      // Set active section to packages when on package detail page
      setActiveSection("packages");
    } else if (location.pathname.startsWith("/booking/")) {
      // Set active section to packages when on booking page
      setActiveSection("packages");
    } else if (location.pathname.startsWith("/payment/")) {
      // Set active section to packages when on payment page
      setActiveSection("packages");
    } else if (location.pathname === "/terms") {
      // Don't highlight any section for terms page
      setActiveSection("");
    }
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Navigate to section function
  const navigateToSection = (id) => {
    closeMenu();

    // If already on home page, scroll to section
    if (location.pathname === "/") {
      scrollToSection(id);
    } else {
      // Navigate to home page with section hash
      navigate("/", { state: { scrollToId: id } });
    }
  };

  // Scroll to section function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Navbar height offset
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container navbar-container">
        <div className="nav-brand">
          <Link to="/" onClick={closeMenu}>
            <img
              src="/assets/logos/travel-logo.png" // Updated path
              alt="TravelPackages Logo"
              className="brand-logo"
            />
          </Link>
        </div>

        <button
          className={`nav-toggle ${isOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>

        <div className={`nav-menu ${isOpen ? "active" : ""}`}>
          <Link
            to="/"
            className={`nav-link ${activeSection === "home" ? "active" : ""}`}
            onClick={() => {
              closeMenu();
              if (location.pathname === "/") {
                scrollToSection("home");
              }
            }}
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </Link>

          <button
            className={`nav-link ${
              activeSection === "packages" ? "active" : ""
            }`}
            onClick={() => navigateToSection("packages")}
          >
            <i className="fas fa-box"></i>
            <span>Packages</span>
          </button>

          <button
            className={`nav-link ${
              activeSection === "destinations" ? "active" : ""
            }`}
            onClick={() => navigateToSection("destinations")}
          >
            <i className="fas fa-map-marker-alt"></i>
            <span>Destinations</span>
          </button>

          <Link
            to="/about"
            className={`nav-link ${activeSection === "about" ? "active" : ""}`}
            onClick={closeMenu}
          >
            <i className="fas fa-info-circle"></i>
            <span>About Us</span>
          </Link>

          <Link
            to="/contact"
            className={`nav-link ${
              activeSection === "contact" ? "active" : ""
            }`}
            onClick={closeMenu}
          >
            <i className="fas fa-envelope"></i>
            <span>Contact us</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;