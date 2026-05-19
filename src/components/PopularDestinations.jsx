import { useRef, useEffect, useState, useCallback } from "react"
import DestinationCard from "./DestinationCard"
import "../styles/PopularDestinations.css"
import AnimatedElement from "./AnimatedElement"
import { getCachedDestinations, setCachedDestinations } from "../utils/dataCache"
import { apiEndpoints } from "../config/api"

const PopularDestinations = ({ onLoadComplete }) => {
  const domesticRef = useRef(null)
  const internationalRef = useRef(null)
  const [isPausedDomestic, setIsPausedDomestic] = useState(false)
  const [isPausedInternational, setIsPausedInternational] = useState(false)
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const [scrollDirectionDomestic, setScrollDirectionDomestic] = useState("right")
  const [scrollDirectionInternational, setScrollDirectionInternational] = useState("right")
  const [reachedEndDomestic, setReachedEndDomestic] = useState(false)
  const [reachedEndInternational, setReachedEndInternational] = useState(false)
  const [canScrollLeftDomestic, setCanScrollLeftDomestic] = useState(false)
  const [canScrollRightDomestic, setCanScrollRightDomestic] = useState(true)
  const [canScrollLeftInternational, setCanScrollLeftInternational] = useState(false)
  const [canScrollRightInternational, setCanScrollRightInternational] = useState(true)
  const [isTouchScrolling, setIsTouchScrolling] = useState(false)

  const cachedDestinations = getCachedDestinations()

  const initialDomestic = cachedDestinations
    ? cachedDestinations.filter((dest) => dest.location && dest.location.toLowerCase().includes("india"))
    : []

  const initialInternational = cachedDestinations
    ? cachedDestinations.filter((dest) => !dest.location || !dest.location.toLowerCase().includes("india"))
    : []

  const [domesticDestinations, setDomesticDestinations] = useState(initialDomestic)
  const [internationalDestinations, setInternationalDestinations] = useState(initialInternational)
  const [loading, setLoading] = useState(!cachedDestinations)

  useEffect(() => {
    if (!loading) {
      if (onLoadComplete) onLoadComplete()
    }
  }, [loading, onLoadComplete])

  useEffect(() => {
    if (cachedDestinations) return

    let active = true
    const fetchData = async () => {
      try {
        console.log("[v0] Fetching destinations from:", apiEndpoints.getDestinations)
        const destResponse = await fetch(apiEndpoints.getDestinations)
        const destData = await destResponse.json()
        const destinations = destData.data?.destinations || []

        const domesticDest = destinations
          .filter((dest) => dest.location && dest.location.toLowerCase().includes("india"))

        const internationalDest = destinations
          .filter((dest) => !dest.location || !dest.location.toLowerCase().includes("india"))

        if (active) {
          setCachedDestinations(destinations)
          setDomesticDestinations(domesticDest)
          setInternationalDestinations(internationalDest)
          setLoading(false)
        }
      } catch (error) {
        console.error("[v0] Error fetching destinations, retrying in 3s:", error)
        if (active) {
          setTimeout(fetchData, 3000)
        }
      }
    }

    fetchData()
    return () => {
      active = false
    }
  }, [cachedDestinations])

  const checkScrollPosition = useCallback((ref) => {
    if (!ref || !ref.current) return
    const { scrollLeft, scrollWidth, clientWidth } = ref.current

    if (ref === domesticRef) {
      setCanScrollLeftDomestic(scrollLeft > 10)
      setCanScrollRightDomestic(scrollLeft + clientWidth < scrollWidth - 10)
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        setReachedEndDomestic(true)
        setScrollDirectionDomestic("left")
      } else if (scrollLeft <= 10 && scrollDirectionDomestic === "left") {
        setReachedEndDomestic(false)
        setScrollDirectionDomestic("right")
      }
    } else if (ref === internationalRef) {
      setCanScrollLeftInternational(scrollLeft > 10)
      setCanScrollRightInternational(scrollLeft + clientWidth < scrollWidth - 10)
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        setReachedEndInternational(true)
        setScrollDirectionInternational("left")
      } else if (scrollLeft <= 10 && scrollDirectionInternational === "left") {
        setReachedEndInternational(false)
        setScrollDirectionInternational("right")
      }
    }
  }, [scrollDirectionDomestic, scrollDirectionInternational])

  // Handle touch events for mobile devices
  useEffect(() => {
    const handleTouchStart = () => {
      setIsTouchScrolling(true)
      setAutoScrollEnabled(false)
    }

    const handleTouchEnd = () => {
      // Add a delay before resuming auto-scroll
      setTimeout(() => {
        setIsTouchScrolling(false)
        setAutoScrollEnabled(true)
      }, 1500)
    }

    const domRef = domesticRef.current
    const intRef = internationalRef.current

    // Add touch event listeners to both scroll containers
    if (domRef) {
      domRef.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      })
      domRef.addEventListener("touchend", handleTouchEnd, {
        passive: true,
      })
    }

    if (intRef) {
      intRef.addEventListener("touchstart", handleTouchStart, { passive: true })
      intRef.addEventListener("touchend", handleTouchEnd, {
        passive: true,
      })
    }

    // Clean up event listeners
    return () => {
      if (domRef) {
        domRef.removeEventListener("touchstart", handleTouchStart)
        domRef.removeEventListener("touchend", handleTouchEnd)
      }
      if (intRef) {
        intRef.removeEventListener("touchstart", handleTouchStart)
        intRef.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [])

  // Initialize scroll position indicators
  useEffect(() => {
    // Add scroll event listeners to update indicators during scrolling
    const handleScroll = (ref) => {
      checkScrollPosition(ref)

      // If user is manually scrolling, pause auto-scroll
      if (!isTouchScrolling) {
        setAutoScrollEnabled(false)

        // Resume auto-scrolling after a delay
        clearTimeout(window.scrollTimeout)
        window.scrollTimeout = setTimeout(() => {
          setAutoScrollEnabled(true)
        }, 2000)
      }
    }

    const domRef = domesticRef.current
    const intRef = internationalRef.current

    const handleDomScroll = () => handleScroll(domesticRef)
    const handleIntScroll = () => handleScroll(internationalRef)

    if (domRef) {
      domRef.addEventListener("scroll", handleDomScroll, { passive: true })
    }

    if (intRef) {
      intRef.addEventListener("scroll", handleIntScroll, { passive: true })
    }

    // Initial check
    const timer = setTimeout(() => {
      checkScrollPosition(domesticRef)
      checkScrollPosition(internationalRef)
    }, 100)

    return () => {
      if (domRef) {
        domRef.removeEventListener("scroll", handleDomScroll)
      }
      if (intRef) {
        intRef.removeEventListener("scroll", handleIntScroll)
      }
      clearTimeout(timer)
      clearTimeout(window.scrollTimeout)
    }
  }, [domesticDestinations, internationalDestinations, isTouchScrolling, checkScrollPosition])

  // Auto-scroll functionality with improved direction change
  useEffect(() => {
    if (!autoScrollEnabled || isTouchScrolling) return

    const scrollDomestic = () => {
      if (domesticRef.current && !isPausedDomestic) {
        const cardWidth = 1 // Scroll 1px at a time for smooth scrolling

        domesticRef.current.scrollBy({
          left: scrollDirectionDomestic === "right" ? cardWidth : -cardWidth,
          behavior: "auto",
        })

        checkScrollPosition(domesticRef)
      }
    }

    const scrollInternational = () => {
      if (internationalRef.current && !isPausedInternational) {
        const cardWidth = 1 // Scroll 1px at a time for smooth scrolling

        internationalRef.current.scrollBy({
          left: scrollDirectionInternational === "right" ? cardWidth : -cardWidth,
          behavior: "auto",
        })

        checkScrollPosition(internationalRef)
      }
    }

    // Set intervals for smooth scrolling
    const domesticInterval = setInterval(scrollDomestic, 30)
    const internationalInterval = setInterval(scrollInternational, 30)

    return () => {
      clearInterval(domesticInterval)
      clearInterval(internationalInterval)
    }
  }, [
    isPausedDomestic,
    isPausedInternational,
    autoScrollEnabled,
    scrollDirectionDomestic,
    scrollDirectionInternational,
    reachedEndDomestic,
    reachedEndInternational,
    isTouchScrolling,
    checkScrollPosition,
  ])

  const scroll = (ref, direction) => {
    if (!ref || !ref.current) return

    setAutoScrollEnabled(false)
    const cardWidth = 270
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth
    ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" })

    setTimeout(() => {
      checkScrollPosition(ref)
      setTimeout(() => {
        setAutoScrollEnabled(true)
      }, 2000)
    }, 300)
  }

  return (
    <section className="popular-destinations section">
      <div className="container">
        <AnimatedElement animation="fade-up">
          <div className="section-header">
            <h2 className="section-title">Top Travel Destinations - India & International</h2>
            <p className="section-subtitle">
              Explore the popular holiday destinations with our expert-curated travel packages
            </p>
          </div>
        </AnimatedElement>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: "20px" }}>Discovering amazing destinations...</p>
          </div>
        ) : (
          <>
            <AnimatedElement animation="fade-up" delay={200}>
              <div className="destination-section">
                <div className="destination-section-header">
                  <h3 className="destination-section-title">Domestic Holiday Destinations - India Tours</h3>
                </div>

                <div className="destinations-scroll-container">
                  <div className="scroll-buttons">
                    <button
                      className={`scroll-button ${!canScrollLeftDomestic ? "disabled" : ""}`}
                      onClick={() => scroll(domesticRef, "left")}
                      aria-label="Scroll left"
                      disabled={!canScrollLeftDomestic}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button
                      className={`scroll-button ${!canScrollRightDomestic ? "disabled" : ""}`}
                      onClick={() => scroll(domesticRef, "right")}
                      aria-label="Scroll right"
                      disabled={!canScrollRightDomestic}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>

                  <div
                    className="destinations-scroll"
                    ref={domesticRef}
                    onMouseEnter={() => setIsPausedDomestic(true)}
                    onMouseLeave={() => setIsPausedDomestic(false)}
                  >
                    {domesticDestinations.map((destination, index) => (
                      <DestinationCard key={`${destination._id}-${index}`} destination={destination} />
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={400}>
              <div className="destination-section">
                <div className="destination-section-header">
                  <h3 className="destination-section-title">International Holiday Destinations - World Tours</h3>
                </div>

                <div className="destinations-scroll-container">
                  <div className="scroll-buttons">
                    <button
                      className={`scroll-button ${!canScrollLeftInternational ? "disabled" : ""}`}
                      onClick={() => scroll(internationalRef, "left")}
                      aria-label="Scroll left"
                      disabled={!canScrollLeftInternational}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button
                      className={`scroll-button ${!canScrollRightInternational ? "disabled" : ""}`}
                      onClick={() => scroll(internationalRef, "right")}
                      aria-label="Scroll right"
                      disabled={!canScrollRightInternational}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>

                  <div
                    className="destinations-scroll"
                    ref={internationalRef}
                    onMouseEnter={() => setIsPausedInternational(true)}
                    onMouseLeave={() => setIsPausedInternational(false)}
                  >
                    {internationalDestinations.map((destination, index) => (
                      <DestinationCard key={`${destination._id}-${index}`} destination={destination} />
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedElement>
          </>
        )}
      </div>
    </section>
  )
}

export default PopularDestinations
