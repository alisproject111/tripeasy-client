"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import "../styles/NotFoundPage.css"

const NotFoundPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1)
  const [allDestinations, setAllDestinations] = useState([])

  const suggestionsRef = useRef(null)
  const searchInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/destinations")
        const data = await response.json()

        if (data.success && data.data.destinations) {
          const destinations = data.data.destinations.map((dest) => dest.name).sort()
          setAllDestinations(destinations)
        }
      } catch (error) {
        console.error("[v0] Error fetching destinations:", error)
        setAllDestinations([])
      }
    }

    fetchDestinations()
  }, [])

  // Extract unique destinations from API response (same as SearchBar)
  const destinations = allDestinations

  // Handle search input change and show suggestions (same logic as SearchBar)
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    setFocusedSuggestionIndex(-1)

    if (value.trim().length > 0) {
      // Filter destinations and ensure we use the full name format
      const filtered = destinations
        .filter((dest) => dest.toLowerCase().includes(value.toLowerCase()))
        // Remove duplicates by preferring the longer format (with ", India" suffix)
        .filter((dest, index, self) => {
          const baseLocation = dest.split(",")[0].trim()
          const longerVersionExists = self.some(
            (d) => d !== dest && d.startsWith(baseLocation) && d.includes(", India"),
          )

          // Keep this item if it's the longer version or if no longer version exists
          return dest.includes(", India") || !longerVersionExists
        })

      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      // Show all destinations when input is cleared, but filter out shorter versions
      const uniqueDestinations = destinations.filter((dest, index, self) => {
        const baseLocation = dest.split(",")[0].trim()
        const longerVersionExists = self.some((d) => d !== dest && d.startsWith(baseLocation) && d.includes(", India"))

        return dest.includes(", India") || !longerVersionExists
      })

      setSuggestions(uniqueDestinations)
      setShowSuggestions(true)
    }
  }

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion)
    setSuggestions([])
    setShowSuggestions(false)
    setFocusedSuggestionIndex(-1)
    searchInputRef.current?.blur()
  }

  // Show suggestions when input is focused
  const handleSearchFocus = () => {
    if (!searchQuery.trim()) {
      // Filter out shorter versions of destinations
      const uniqueDestinations = destinations.filter((dest, index, self) => {
        const baseLocation = dest.split(",")[0].trim()
        const longerVersionExists = self.some((d) => d !== dest && d.startsWith(baseLocation) && d.includes(", India"))

        return dest.includes(", India") || !longerVersionExists
      })

      setSuggestions(uniqueDestinations)
      setShowSuggestions(true)
    }
  }

  // Handle keyboard navigation for suggestions
  const handleSearchKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setFocusedSuggestionIndex((prevIndex) => (prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex))
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setFocusedSuggestionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0))
    }
    // Enter
    else if (e.key === "Enter" && focusedSuggestionIndex >= 0) {
      e.preventDefault()
      handleSelectSuggestion(suggestions[focusedSuggestionIndex])
    }
    // Escape
    else if (e.key === "Escape") {
      setShowSuggestions(false)
      setFocusedSuggestionIndex(-1)
    }
  }

  // Scroll the focused suggestion into view
  useEffect(() => {
    if (focusedSuggestionIndex >= 0 && suggestionsRef.current) {
      const suggestionItems = suggestionsRef.current.querySelectorAll(".nf-suggestion-item")
      if (suggestionItems[focusedSuggestionIndex]) {
        suggestionItems[focusedSuggestionIndex].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }
    }
  }, [focusedSuggestionIndex])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault()
      if (!searchQuery.trim()) {
        return
      }

      // Navigate to packages page with search parameter and scroll to package list
      const params = new URLSearchParams()
      params.append("destination", searchQuery.trim())
      navigate(`/packages?${params.toString()}#package-list`)
    },
    [searchQuery, navigate],
  )

  const popularDestinations = [
    {
      name: "Goa Packages",
      path: "/packages?destination=Goa, India#package-list",
      icon: "🏖️",
    },
    {
      name: "Kerala Tours",
      path: "/packages?destination=Kerala, India#package-list",
      icon: "🌴",
    },
    {
      name: "Manali Trips",
      path: "/packages?destination=Manali, India#package-list",
      icon: "🏔️",
    },
    {
      name: "Bali Tours",
      path: "/packages?destination=Bali, Indonesia#package-list",
      icon: "🌺",
    },
  ]

  const quickLinks = [
    { name: "All Packages", path: "/packages#package-list", icon: "📦" },
    { name: "About Us", path: "/about", icon: "ℹ️" },
    { name: "Contact Us", path: "/contact", icon: "📞" },
    { name: "Home", path: "/", icon: "🏠" },
  ]

  return (
    <>
      <Helmet>
        <title>Page Not Found - TripEasy | Travel Packages India</title>
        <meta
          name="description"
          content="Oops! The page you're looking for doesn't exist. Explore our amazing travel packages and find your perfect holiday destination with TripEasy."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="not-found-page-wrapper">
        <div className="not-found-page-content">
          <div className="not-found-container">
            {/* Animated Background Elements */}
            <div className="nf-floating-elements">
              <div className="nf-floating-plane">✈️</div>
              <div className="nf-floating-cloud nf-cloud-1">☁️</div>
              <div className="nf-floating-cloud nf-cloud-2">☁️</div>
              <div className="nf-floating-cloud nf-cloud-3">☁️</div>
            </div>

            {/* Main Content */}
            <div className="not-found-content">
              <div className="nf-error-illustration">
                <div className="nf-error-number">4🏝️4</div>
                <div className="nf-error-subtitle">Oops! Looks like you've wandered off the beaten path!</div>
              </div>

              <div className="nf-error-message">
                <h1>Page Not Found</h1>
                <p>
                  Don't worry, even the best explorers sometimes take a wrong turn. Let's get you back on track to your
                  dream destination!
                </p>
              </div>

              {/* Search Section */}
              <div className="nf-search-section">
                <h3>🔍 Search for Your Perfect Trip</h3>
                <form onSubmit={handleSearch} className="nf-search-form">
                  <div className="nf-search-input-wrapper">
                    <input
                      type="text"
                      placeholder="Search destinations: Goa, Kerala, Manali, Dubai, Thailand..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                      onFocus={handleSearchFocus}
                      className="nf-search-input"
                      autoComplete="off"
                      ref={searchInputRef}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="nf-suggestions-container" ref={suggestionsRef}>
                        <ul className="nf-suggestions-list">
                          {suggestions.map((suggestion, index) => (
                            <li
                              key={index}
                              className={`nf-suggestion-item ${focusedSuggestionIndex === index ? "focused" : ""}`}
                              onClick={() => handleSelectSuggestion(suggestion)}
                            >
                              <span className="nf-suggestion-icon">📍</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <button type="submit" className="nf-search-btn">
                      <span className="nf-search-btn-icon">🔍</span>
                      Search
                    </button>
                  </div>
                </form>
              </div>

              {/* Popular Destinations */}
              <div className="nf-suggestions-section">
                <div className="nf-popular-destinations">
                  <h3>🌟 Popular Destinations</h3>
                  <div className="nf-destination-links">
                    {popularDestinations.map((destination, index) => (
                      <Link key={index} to={destination.path} className="nf-destination-link">
                        <span className="nf-link-icon">{destination.icon}</span>
                        <span>{destination.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="nf-quick-links">
                  <h3>🚀 Quick Navigation</h3>
                  <div className="nf-nav-links">
                    {quickLinks.map((link, index) => (
                      <Link key={index} to={link.path} className="nf-nav-link">
                        <span className="nf-link-icon">{link.icon}</span>
                        <span>{link.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="nf-cta-section">
                <div className="nf-cta-content">
                  <h3>🎯 Ready to Start Your Journey?</h3>
                  <p>Explore our handpicked travel packages and create memories that last a lifetime!</p>
                  <div className="nf-cta-buttons">
                    <Link to="/packages#package-list" className="nf-cta-btn primary">
                      <span className="nf-btn-icon">🎒</span>
                      Explore Packages
                    </Link>
                    <Link to="/" className="nf-cta-btn secondary">
                      <span className="nf-btn-icon">🏠</span>
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>

              {/* Fun Travel Fact */}
              <div className="nf-travel-fact">
                <div className="nf-fact-content">
                  <span className="nf-fact-icon">💡</span>
                  <p>
                    <strong>Did you know?</strong> The word "travel" comes from the Old French word "travail," which
                    means "work" or "labor." Today, we make travel feel like pure joy!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFoundPage
