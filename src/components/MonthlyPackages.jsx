"use client"

import { useState, useEffect, useRef } from "react"
import DestinationCard from "./DestinationCard"
import "../styles/MonthlyPackages.css"
import AnimatedElement from "./AnimatedElement"
import { apiEndpoints } from "../config/api"

function MonthlyDestinations() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [isPaused, setIsPaused] = useState(false)
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const [scrollDirection, setScrollDirection] = useState("right")
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isTouchScrolling, setIsTouchScrolling] = useState(false)
  const [packagesData, setPackagesData] = useState({
    packages: [],
    destinations: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const destinationsRef = useRef(null)

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  useEffect(() => {
    let active = true
    const fetchPackagesData = async () => {
      try {
        console.log("[v0] Fetching destinations from:", apiEndpoints.getDestinations)

        const response = await fetch(apiEndpoints.getDestinations, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Monthly destinations API response:", data)

        if (data.success && data.data?.destinations) {
          if (active) {
            setPackagesData({
              packages: [],
              destinations: data.data.destinations || [],
            })
            setError(null)
            setLoading(false)
          }
        } else {
          throw new Error("Failed to fetch destinations data")
        }
      } catch (err) {
        console.error("[v0] Error fetching destinations data, retrying in 3s:", err.message)
        if (active) {
          setTimeout(fetchPackagesData, 3000)
        }
      }
    }

    fetchPackagesData()
    return () => {
      active = false
    }
  }, [])

  const getMonthlyDestinations = (month) => {
    return packagesData.destinations.filter((dest) => dest.favorableMonths && dest.favorableMonths.includes(month))
  }

  const [monthlyDestinationsList, setMonthlyDestinationsList] = useState([])

  useEffect(() => {
    if (!loading && packagesData.destinations.length > 0) {
      const destinations = getMonthlyDestinations(currentMonth)
      setMonthlyDestinationsList(destinations)

      if (destinationsRef.current) {
        destinationsRef.current.scrollLeft = 0
      }

      setTimeout(() => {
        checkScrollPosition()
      }, 100)
    }
  }, [currentMonth, packagesData, loading])

  const handleMonthChange = (month) => {
    setCurrentMonth(month)
  }

  const scroll = (direction) => {
    if (!destinationsRef || !destinationsRef.current) return

    setAutoScrollEnabled(false)

    const cardWidth = 270
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth
    destinationsRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    })

    setTimeout(() => {
      checkScrollPosition()
      setTimeout(() => {
        setAutoScrollEnabled(true)
      }, 2000)
    }, 300)
  }

  // Check if scroll has reached the end or beginning
  const checkScrollPosition = () => {
    if (!destinationsRef || !destinationsRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = destinationsRef.current

    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)

    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      setScrollDirection("left")
    } else if (scrollLeft <= 10 && scrollDirection === "left") {
      setScrollDirection("right")
    }
  }

  useEffect(() => {
    const handleTouchStart = () => {
      setIsTouchScrolling(true)
      setAutoScrollEnabled(false)
    }

    const handleTouchEnd = () => {
      setTimeout(() => {
        setIsTouchScrolling(false)
        setAutoScrollEnabled(true)
      }, 1500)
    }

    if (destinationsRef.current) {
      destinationsRef.current.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      })
      destinationsRef.current.addEventListener("touchend", handleTouchEnd, {
        passive: true,
      })
    }

    return () => {
      if (destinationsRef.current) {
        destinationsRef.current.removeEventListener("touchstart", handleTouchStart)
        destinationsRef.current.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      checkScrollPosition()

      if (!isTouchScrolling) {
        setAutoScrollEnabled(false)

        clearTimeout(window.monthlyScrollTimeout)
        window.monthlyScrollTimeout = setTimeout(() => {
          setAutoScrollEnabled(true)
        }, 2000)
      }
    }

    if (destinationsRef.current) {
      destinationsRef.current.addEventListener("scroll", handleScroll, {
        passive: true,
      })
    }

    return () => {
      if (destinationsRef.current) {
        destinationsRef.current.removeEventListener("scroll", handleScroll)
      }
      clearTimeout(window.monthlyScrollTimeout)
    }
  }, [scrollDirection, isTouchScrolling])

  useEffect(() => {
    if (!autoScrollEnabled || monthlyDestinationsList.length === 0 || isTouchScrolling) return

    const scrollDestinations = () => {
      if (destinationsRef.current && !isPaused) {
        const cardWidth = 1

        destinationsRef.current.scrollBy({
          left: scrollDirection === "right" ? cardWidth : -cardWidth,
          behavior: "auto",
        })

        checkScrollPosition()
      }
    }

    const scrollInterval = setInterval(scrollDestinations, 30)

    return () => clearInterval(scrollInterval)
  }, [isPaused, monthlyDestinationsList, autoScrollEnabled, scrollDirection, isTouchScrolling])

  if (loading) {
    return (
      <section className="monthly-destinations section" id="monthly-destinations">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Loading destinations...</h2>
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div className="loading-spinner"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="monthly-destinations section" id="monthly-destinations">
      <div className="container">
        <AnimatedElement animation="fade-up">
          <div className="section-header">
            <h2 className="section-title">Best Destinations for {months[currentMonth]}</h2>
            <p className="section-subtitle">Discover the perfect places to visit this month</p>
          </div>
        </AnimatedElement>

        <AnimatedElement animation="fade-up" delay={200}>
          <div className="month-selector">
            {months.map((month, index) => (
              <button
                key={index}
                className={`month-btn ${index === currentMonth ? "active" : ""}`}
                onClick={() => handleMonthChange(index)}
              >
                {month}
              </button>
            ))}
          </div>
        </AnimatedElement>

        <AnimatedElement animation="fade-up" delay={400}>
          <div className="monthly-destinations-container">
            <div className="scroll-buttons">
              <button
                className={`scroll-button ${!canScrollLeft ? "disabled" : ""}`}
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                disabled={!canScrollLeft}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                className={`scroll-button ${!canScrollRight ? "disabled" : ""}`}
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                disabled={!canScrollRight}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>

            <div className="destinations-scroll-container">
              <div
                className="destinations-scroll"
                ref={destinationsRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {monthlyDestinationsList && monthlyDestinationsList.length > 0 ? (
                  monthlyDestinationsList.map((destination, index) => {
                    return (
                      <DestinationCard key={`${destination.id || destination._id}-${index}`} destination={destination} />
                    )
                  })
                ) : (
                  <div className="no-destinations">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>No destinations available for this month. Please check other months.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </AnimatedElement>
      </div>
    </section>
  )
}

export default MonthlyDestinations