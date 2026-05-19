"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import PackageCard from "./PackageCard"
import "../styles/PopularPackages.css"
import AnimatedSection from "./AnimatedSection"
import AnimatedElement from "./AnimatedElement"
import { getCachedPackages, setCachedPackages } from "../utils/dataCache"
import { apiEndpoints } from "../config/api"

const PopularPackages = () => {
  const cachedData = getCachedPackages()
  const [popularPackages, setPopularPackages] = useState(cachedData || [])
  const [loading, setLoading] = useState(!cachedData)
  const [isMobile, setIsMobile] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  // Fetch packages data from API
  useEffect(() => {
    if (cachedData) return

    let active = true
    const fetchPackagesData = async () => {
      try {
        const fetchUrl = `${apiEndpoints.getAllPackages}?limit=6&featured=true`
        console.log("[v0] Fetching packages from:", fetchUrl)

        const response = await fetch(fetchUrl, {
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
          if (active) {
            console.log("[v0] Featured packages loaded:", data.packages.length)
            setCachedPackages(data.packages)
            setPopularPackages(data.packages)
            setError(null)
            setLoading(false)
          }
        } else {
          throw new Error(data.message || "Failed to fetch packages")
        }
      } catch (error) {
        console.error("[v0] Error fetching packages data, retrying in 3s:", error.message)
        if (active) {
          setTimeout(fetchPackagesData, 3000)
        }
      }
    }

    fetchPackagesData()
    return () => {
      active = false
    }
  }, [cachedData])

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



  if (loading) {
    return (
      <section className="popular-packages section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Finding best travel packages for you...</h2>
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div className="loading-spinner"></div>
            </div>
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
