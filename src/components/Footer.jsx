"use client";

import { Link } from "react-router-dom";
import "../styles/Footer.css";
import { useEffect } from "react";

function Footer() {
  const currentYear = new Date().getFullYear();

  // Add useEffect to handle scrolling after navigation
  useEffect(() => {
    // Check if we need to scroll to a section after navigation
    const sectionToScroll = sessionStorage.getItem("scrollToSection");
    if (sectionToScroll) {
      // Clear the stored section
      sessionStorage.removeItem("scrollToSection");

      // Wait for the page to fully load
      setTimeout(() => {
        const element = document.getElementById(sectionToScroll);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);
    }
  }, []);

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <h3>TravelPackages</h3>
          <p>
            Discover the world with our premium travel packages. We offer
            unforgettable experiences at affordable prices.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://x.com/i/flow/login?redirect_after_login=%2Fflyanytripindia"
              className="social-link"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://www.instagram.com/flyanytripindia?igsh=MTkxbzcxenJnNjA5aw=="
              className="social-link"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/flyanytripindia/"
              className="social-link"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                <i className="fas fa-home footer-icon"></i> Home
              </Link>
            </li>
            <li>
              <Link to="/packages" onClick={() => window.scrollTo(0, 0)}>
                <i className="fas fa-box footer-icon"></i> Packages
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => window.scrollTo(0, 0)}>
                <i className="fas fa-info-circle footer-icon"></i> About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
                <i className="fas fa-envelope footer-icon"></i> Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Popular Destinations</h3>
          <ul className="footer-links">
            <li>
              <Link
                to={`/package/goa-getaway`}
                onClick={() => window.scrollTo(0, 0)}
              >
                <i className="fas fa-map-marker-alt footer-icon"></i> Goa
              </Link>
            </li>
            <li>
              <Link
                to={`/package/shimla-&-manali`}
                onClick={() => window.scrollTo(0, 0)}
              >
                <i className="fas fa-map-marker-alt footer-icon"></i> Manali
              </Link>
            </li>
            <li>
              <Link
                to={`/package/dazzling-dubai-getaway`}
                onClick={() => window.scrollTo(0, 0)}
              >
                <i className="fas fa-map-marker-alt footer-icon"></i> Dubai
              </Link>
            </li>
            <li>
              <Link
                to={`/package/udaipur-royal-escapade`}
                onClick={() => window.scrollTo(0, 0)}
              >
                <i className="fas fa-map-marker-alt footer-icon"></i> Rajasthan
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <address className="contact-info">
            <p>
              <a
                href="https://maps.google.com/?q=Shop+No+16,+2nd+Floor,+VED+TransCube+opposite+the+Main+Railway+Station,+Vadodara,+Gujarat+390002+India"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-map-marker-alt"></i> Shop No 16, 2nd Floor,
                VED TransCube opposite the Main Railway Station, Vadodara,
                Gujarat 390002 India
              </a>
            </p>
            <p>
              <a href="tel:+91-7880789486">
                <i className="fas fa-phone"></i> +91 7880789486
              </a>
            </p>
            <p>
              <a href="mailto:contact.us.tripeasy@gmail.com">
                <i className="fas fa-envelope"></i>{" "}
                contact.us.tripeasy@gmail.com
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="footer-copyright">
            &copy; {currentYear} TripEasy. All rights reserved.
          </p>
          <div className="footer-policies">
            <Link
              to="/privacy-policy"
              target="_blank"
              className="footer-policy-link"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-and-conditions"
              target="_blank"
              className="footer-policy-link"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/refund-policy"
              target="_blank"
              className="footer-policy-link"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
