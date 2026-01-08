"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import SEOHead from "../components/SEOHead"
import "../styles/PackageDetailPage.css"
import AnimatedElement from "../components/AnimatedElement"
import AnimatedSection from "../components/AnimatedSection"
import { apiEndpoints } from "../config/api"

function PackageDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [packageData, setPackageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const sidebarRef = useRef(null)
  const footerRef = useRef(null)
  const [activeItinerary, setActiveItinerary] = useState(null)

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" })

    const fetchPackageData = async () => {
      try {
        const fetchUrl = apiEndpoints.getPackageById(id)
        console.log("[v0] Fetching package from:", fetchUrl)

        const response = await fetch(fetchUrl)

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Package response:", data)

        if (data.success && data.package) {
          setPackageData(data.package)
          console.log("[v0] Package loaded successfully:", data.package.name)
        } else {
          setError("Package not found")
          console.error("[v0] Package not found in response")
        }
      } catch (err) {
        console.error("[v0] Error fetching package:", err)
        setError("Error loading package details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchPackageData()
  }, [id])

  // Effect for sticky sidebar that stays visible until footer
  useEffect(() => {
    if (!sidebarRef.current || !footerRef.current) return

    const handleScroll = () => {
      const sidebar = sidebarRef.current
      const footer = document.querySelector("footer")

      if (!sidebar || !footer) return

      const sidebarRect = sidebar.getBoundingClientRect()
      const footerRect = footer.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // If footer is in view, adjust sidebar position
      if (footerRect.top < windowHeight) {
        const distanceToFooter = footerRect.top - windowHeight
        sidebar.style.transform = `translateY(${distanceToFooter}px)`
      } else {
        sidebar.style.transform = "translateY(0)"
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loading])

  // Format duration as nights/days (e.g., 4N/5D)
  const formatDuration = (days) => {
    const nights = days - 1
    return `${nights}N/${days}D`
  }

  // Handle booking - navigate to booking page
  const handleBookNow = () => {
    navigate(`/booking/${packageData.name.toLowerCase().replace(/\s+/g, "-")}`)
  }

  // Handle inquiry
  const handleInquiry = () => {
    navigate("/contact", { state: { inquiry: packageData?.name } })
  }

  // Toggle itinerary day
  const toggleItinerary = (dayIndex) => {
    if (activeItinerary === dayIndex) {
      setActiveItinerary(null)
    } else {
      setActiveItinerary(dayIndex)
    }
  }

  if (loading) {
    return (
      <div className="pdp-loading-container">
        <div className="pdp-loading-spinner"></div>
        <p>Loading package details...</p>
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="pdp-error-container">
        <i className="fas fa-exclamation-circle fa-3x"></i>
        <h2>Error</h2>
        <p>{error || "Package not found"}</p>
        <Link to="/packages" className="pdp-back-button">
          <i className="fas fa-arrow-left"></i> Back to Packages
        </Link>
      </div>
    )
  }

  return (
    <div className="pdp-package-detail-page">
      <SEOHead
        title={`${packageData.name} - ${formatDuration(packageData.duration)} Tour Package | TripEasy`}
        description={`Book ${packageData.name} tour package for ${formatDuration(
          packageData.duration,
        )} starting from ₹${packageData.price.toLocaleString("en-IN")}. ${
          packageData.description
        } Best prices guaranteed!`}
        keywords={`${packageData.name}, ${packageData.location}, tour package, travel package, holiday package, ${
          packageData.highlights ? packageData.highlights.join(", ") : ""
        }, ${formatDuration(packageData.duration)} tour, TripEasy`}
        canonical={`https://tripeasy.in/package/${packageData.name.toLowerCase().replace(/\s+/g, "-")}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          name: packageData.name,
          description: packageData.description,
          url: `https://tripeasy.in/package/${packageData.name.toLowerCase().replace(/\s+/g, "-")}`,
          image: packageData.detailImage || packageData.image,
          offers: {
            "@type": "Offer",
            price: packageData.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "TravelAgency",
              name: "TripEasy",
            },
          },
          provider: {
            "@type": "TravelAgency",
            name: "TripEasy",
            url: "https://tripeasy.in",
          },
          duration: `P${packageData.duration}D`,
          touristType: "Leisure",
        }}
      />
      <div
        className="pdp-package-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
            packageData.detailImage || packageData.image
          })`,
        }}
      >
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="pdp-package-hero-content">
              <h1 className="pdp-package-title">{packageData.name}</h1>
              <div className="pdp-package-location">
                <i className="fas fa-map-marker-alt"></i>
                <span>{packageData.location}</span>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </div>

      <div className="container">
        <div className="pdp-package-detail-grid">
          <div className="pdp-package-main-content">
            <AnimatedElement animation="fade-right">
              <div className="pdp-package-overview">
                <h2 className="pdp-section-title">
                  <i className="fas fa-info-circle pdp-section-icon"></i>
                  Overview
                </h2>
                <div className="pdp-overview-content">
                  <p>{packageData.description}</p>
                  <p>
                    Experience the beauty and culture of this amazing destination with our carefully crafted itinerary.
                    Our package ensures you get the best experience with comfortable accommodations, guided tours, and
                    authentic local experiences.
                  </p>
                  <div className="pdp-overview-features">
                    <div className="pdp-feature">
                      <i className="fas fa-hotel"></i>
                      <span>Premium Accommodations</span>
                    </div>
                    <div className="pdp-feature">
                      <i className="fas fa-utensils"></i>
                      <span>Daily Breakfast</span>
                    </div>
                    <div className="pdp-feature">
                      <i className="fas fa-car"></i>
                      <span>Private Transfers</span>
                    </div>
                    <div className="pdp-feature">
                      <i className="fas fa-user-tie"></i>
                      <span>Expert Guides</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-right" delay={200}>
              <div className="pdp-package-highlights-section">
                <h2 className="pdp-section-title">
                  <i className="fas fa-star pdp-section-icon"></i>
                  Highlights
                </h2>
                <ul className="pdp-highlights-list">
                  {packageData.highlights &&
                    packageData.highlights.map((highlight, index) => (
                      <li key={index} className="pdp-highlight-item">
                        <i className="fas fa-check-circle"></i>
                        <span>{highlight}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-right" delay={400}>
              <div className="pdp-package-itinerary">
                <h2 className="pdp-section-title">
                  <i className="fas fa-route pdp-section-icon"></i>
                  Itinerary
                </h2>
                <AnimatedSection staggered={true} staggerDelay={150} className="pdp-itinerary-days">
                  {packageData.itinerary && packageData.itinerary.length > 0
                    ? packageData.itinerary.map((day, index) => (
                        <div key={index} className="pdp-itinerary-day">
                          <div
                            className={`pdp-day-header ${activeItinerary === index ? "pdp-active" : ""}`}
                            onClick={() => toggleItinerary(index)}
                          >
                            <h3>
                              <span className="pdp-day-number">Day {day.day}</span>
                              {day.title}
                            </h3>
                            <i
                              className={`fas ${
                                activeItinerary === index ? "fa-chevron-up" : "fa-chevron-down"
                              } pdp-toggle-icon`}
                            ></i>
                          </div>
                          <div
                            className={`pdp-day-content ${activeItinerary === index ? "pdp-day-content-active" : ""}`}
                          >
                            <p>{day.description}</p>
                            <ul className="pdp-activities-list">
                              {day.activities &&
                                day.activities.map((activity, i) => (
                                  <li key={i} className="pdp-activity-item">
                                    <i className="fas fa-circle-dot"></i> {activity}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      ))
                    : // Fallback if itinerary is not available
                      [...Array(packageData.duration || 1)].map((_, index) => (
                        <div key={index} className="pdp-itinerary-day">
                          <div
                            className={`pdp-day-header ${activeItinerary === index ? "pdp-active" : ""}`}
                            onClick={() => toggleItinerary(index)}
                          >
                            <h3>
                              <span className="pdp-day-number">Day {index + 1}</span>
                              Exploration Day
                            </h3>
                            <i
                              className={`fas ${
                                activeItinerary === index ? "fa-chevron-up" : "fa-chevron-down"
                              } pdp-toggle-icon`}
                            ></i>
                          </div>
                          <div
                            className={`pdp-day-content ${activeItinerary === index ? "pdp-day-content-active" : ""}`}
                          >
                            <p>Explore the beautiful destination and enjoy local attractions and experiences.</p>
                            <ul className="pdp-activities-list">
                              <li className="pdp-activity-item">
                                <i className="fas fa-circle-dot"></i> Morning: Breakfast at hotel
                              </li>
                              <li className="pdp-activity-item">
                                <i className="fas fa-circle-dot"></i> Afternoon: Guided tour
                              </li>
                              <li className="pdp-activity-item">
                                <i className="fas fa-circle-dot"></i> Evening: Free time for exploration
                              </li>
                            </ul>
                          </div>
                        </div>
                      ))}
                </AnimatedSection>
              </div>
            </AnimatedElement>
          </div>

          <div className="pdp-package-sidebar" ref={sidebarRef}>
            <AnimatedElement animation="fade-left">
              <div className="pdp-booking-card pdp-sticky-sidebar">
                <div className="pdp-booking-price">
                  <span className="pdp-price-label">From</span>
                  <span className="pdp-price-value">₹{packageData.price.toLocaleString("en-IN")}</span>
                  <span className="pdp-price-per">per person</span>
                </div>

                <div className="pdp-booking-details">
                  <div className="pdp-booking-detail">
                    <i className="fas fa-calendar-alt"></i>
                    <span>{formatDuration(packageData.duration)}</span>
                  </div>
                  <div className="pdp-booking-detail">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{packageData.location}</span>
                  </div>
                  <div className="pdp-booking-detail">
                    <i className="fas fa-users"></i>
                    <span>Max People: 20</span>
                  </div>
                </div>

                <button className="pdp-book-now-button" onClick={handleBookNow}>
                  <i className="fas fa-credit-card"></i> Book Now
                </button>

                <a href="tel:+91-9157450389">
                  <button className="pdp-book-now-button">
                    <i className="fas fa-phone"></i> Call Now
                  </button>
                </a>

                <button className="pdp-inquiry-button" onClick={handleInquiry}>
                  <i className="fas fa-envelope"></i> Send Inquiry
                </button>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-left" delay={300}>
              <div className="pdp-why-book-card">
                <h3>Why Book With Us</h3>
                <ul className="pdp-why-book-list">
                  <li>
                    <i className="fas fa-check-circle"></i>
                    <span>No Booking Fees</span>
                  </li>
                  <li>
                    <i className="fas fa-check-circle"></i>
                    <span>Best Price Guarantee</span>
                  </li>
                  <li>
                    <i className="fas fa-check-circle"></i>
                    <span>Free Cancellation</span>
                  </li>
                  <li>
                    <i className="fas fa-check-circle"></i>
                    <span>24/7 Customer Support</span>
                  </li>
                </ul>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </div>
      <div ref={footerRef}></div>
    </div>
  )
}

export default PackageDetailPage
