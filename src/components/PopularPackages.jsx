"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import PackageCard from "./PackageCard"
import "../styles/PopularPackages.css"
import AnimatedSection from "./AnimatedSection"
import AnimatedElement from "./AnimatedElement"

const PopularPackages = () => {
  const [popularPackages, setPopularPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [error, setError] = useState(null)

  // Fetch packages data from API
  useEffect(() => {
    const fetchPackagesData = async () => {
      try {
        console.log("[v0] Fetching packages from https://tripeasy-server.vercel.app/api/packages")

        const response = await fetch("https://tripeasy-server.vercel.app/api/packages", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Packages API response:", data)

        if (data.success && data.packages) {
          let featured = data.packages.filter((pkg) => pkg.featured).slice(0, 6)

          // If no featured packages, show all packages (first 6)
          if (featured.length === 0) {
            featured = data.packages.slice(0, 6)
          }

          console.log("[v0] Featured packages loaded:", featured.length)
          setPopularPackages(featured)
          setError(null)
        } else {
          throw new Error(data.message || "Failed to fetch packages")
        }
      } catch (error) {
        console.error("[v0] Error fetching packages data:", error.message)
        setError(error.message)
        setPopularPackages([])
      } finally {
        setLoading(false)
      }
    }

    fetchPackagesData()
  }, [])

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Initial check
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (error) {
    return (
      <section className="popular-packages section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Error Loading Packages</h2>
            <p className="section-subtitle" style={{ color: "red" }}>
              {error}
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="popular-packages section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Loading packages...</h2>
          </div>
        </div>
      </section>
    )
  }

  // For mobile, don't use animations
  if (isMobile) {
    return (
      <section className="popular-packages section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Travel Packages - Best Holiday Deals</h2>
            <p className="section-subtitle">
              Handpicked tour packages with best prices. Domestic India tours & international vacation packages
            </p>
          </div>

          <div className="popular-packages-grid no-animation">
            {popularPackages && popularPackages.length > 0 ? (
              popularPackages.map((pkg) => (
                <div key={pkg._id || pkg.id} className="package-card-wrapper no-animation">
                  <PackageCard package={pkg} />
                </div>
              ))
            ) : (
              <p>No packages available</p>
            )}
          </div>

          <div className="view-all-container">
            <Link to="/packages#package-list" className="view-all-btn">
              <span>View All Packages</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // For desktop, use animations
  return (
    <section className="popular-packages section">
      <div className="container">
        <AnimatedElement animation="fade-up" threshold={0.1} duration={500}>
          <div className="section-header">
            <h2 className="section-title">Popular Travel Packages - Best Holiday Deals</h2>
            <p className="section-subtitle">
              Handpicked tour packages with best prices. Domestic India tours & international vacation packages
            </p>
          </div>
        </AnimatedElement>

        <AnimatedSection staggered={true} staggerDelay={50} className="popular-packages-grid">
          {popularPackages && popularPackages.length > 0 ? (
            popularPackages.map((pkg) => (
              <div key={pkg._id || pkg.id} className="package-card-wrapper">
                <PackageCard package={pkg} />
              </div>
            ))
          ) : (
            <p>No packages available</p>
          )}
        </AnimatedSection>

        <AnimatedElement animation="fade-up" delay={200} duration={500}>
          <div className="view-all-container">
            <Link to="/packages#package-list" className="view-all-btn">
              <span>View All Packages</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </AnimatedElement>
      </div>
    </section>
  )
}

export default PopularPackages