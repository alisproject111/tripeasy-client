"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import PackageCard from "./PackageCard"
import "../styles/PackageList.css"
import { apiEndpoints } from "../config/api"

function PackageList({ filters = {}, packageType = "all" }) {
  const location = useLocation()
  const navigate = useNavigate()
  const packagesPerPage = 6
  const packageListRef = useRef(null)
  const [packagesData, setPackagesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const fetchPackagesData = async () => {
      try {
        console.log("[v0] Fetching packages from:", apiEndpoints.getAllPackages)

        const response = await fetch(apiEndpoints.getAllPackages, {
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          console.error(`[v0] API Error: ${response.status} ${response.statusText}`)
          const errorText = await response.text()
          console.error("[v0] Response:", errorText)
          throw new Error(`Failed to fetch packages: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("[v0] API Response data:", data)

        if (data.success && data.packages) {
          setPackagesData(data.packages || [])
          console.log(`[v0] Successfully loaded ${data.packages?.length || 0} packages`)
        } else {
          console.error("Failed to fetch packages data:", data.message)
          setPackagesData([])
        }
      } catch (error) {
        console.error("[v0] Error fetching packages data:", error)
        setError(`Error fetching packages data: ${error.message}`)
        setRetryCount((prevCount) => prevCount + 1)
        if (retryCount < 3) {
          setTimeout(fetchPackagesData, 2000)
        } else {
          setRetryCount(0)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPackagesData()
  }, [retryCount])

  // Get current page from URL
  const getPageFromUrl = () => {
    const searchParams = new URLSearchParams(location.search)
    const page = searchParams.get("page")
    return page ? Number.parseInt(page, 10) : 1
  }

  // Set current page based on URL
  const [currentPage, setCurrentPage] = useState(getPageFromUrl())

  // Use useMemo to optimize filtering logic
  const filteredPackages = useMemo(() => {
    let result = [...packagesData]

    // Filter by package type (domestic or international)
    if (packageType === "domestic") {
      result = result.filter((pkg) => pkg.location && pkg.location.toLowerCase().includes("india"))
    } else if (packageType === "international") {
      result = result.filter((pkg) => !pkg.location || !pkg.location.toLowerCase().includes("india"))
    }

    // Apply filters
    if (filters.destination) {
      const searchTerm = filters.destination.toLowerCase()

      // Define common words to filter out
      const commonWords = [
        "india",
        "the",
        "and",
        "&",
        ",",
        "-",
        "of",
        "in",
        "at",
        "to",
        "for",
        "with",
        "by",
        "a",
        "an",
        "escape",
        "retreat",
        "tour",
        "adventure",
        "getaway",
        "vacation",
        "holiday",
        "trip",
        "experience",
        "expedition",
        "journey",
        "splendor",
        "bliss",
        "explorer",
        "package",
        "packages",
        "himalayan",
      ]

      // Extract meaningful words from the search query
      const searchWords = searchTerm.split(/[\s,&-]+/).filter((word) => word.length > 2 && !commonWords.includes(word))

      // If no meaningful words found, use the original search term
      if (searchWords.length === 0) {
        result = result.filter(
          (pkg) => pkg.name.toLowerCase().includes(searchTerm) || pkg.location.toLowerCase().includes(searchTerm),
        )
      } else {
        // Filter packages that match any of the meaningful words
        result = result.filter((pkg) => {
          const packageName = pkg.name.toLowerCase()
          const packageLocation = pkg.location.toLowerCase()

          // Check if any search word is found in the package name or location
          return searchWords.some((word) => packageName.includes(word) || packageLocation.includes(word))
        })
      }
    }

    if (filters.duration) {
      const [min, max] = filters.duration.split("-").map(Number)
      result = result.filter((pkg) => {
        if (max) {
          return pkg.duration >= min && pkg.duration <= max
        } else {
          // For "15+" case
          return pkg.duration >= min
        }
      })
    }

    if (filters.budget) {
      const [min, max] = filters.budget.split("-").map(Number)
      result = result.filter((pkg) => {
        if (max) {
          return pkg.price >= min && pkg.price <= max
        } else {
          // For "3000+" case
          return pkg.price >= min
        }
      })
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          result.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          result.sort((a, b) => b.price - a.price)
          break
        case "duration-low":
          result.sort((a, b) => a.duration - b.duration)
          break
        case "duration-high":
          result.sort((a, b) => b.duration - a.duration)
          break
        default:
          break
      }
    }

    return result
  }, [filters, packageType, packagesData])

  // Calculate total pages
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage)

  // Validate current page and redirect to 404 if invalid
  useEffect(() => {
    const pageFromUrl = getPageFromUrl()

    // Check if page number is invalid
    if (pageFromUrl < 1 || (totalPages > 0 && pageFromUrl > totalPages)) {
      // Redirect to 404 page for invalid page numbers
      navigate("/404", { replace: true })
      return
    }

    setCurrentPage(pageFromUrl)
  }, [location.search, totalPages, navigate])

  // Additional validation for manual URL changes
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      navigate("/404", { replace: true })
    }
  }, [currentPage, totalPages, navigate])

  // Get current packages
  const indexOfLastPackage = currentPage * packagesPerPage
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage
  const currentPackages = filteredPackages.slice(indexOfFirstPackage, indexOfLastPackage)

  // Change page
  const paginate = (pageNumber) => {
    // Validate page number before navigation
    if (pageNumber < 1 || pageNumber > totalPages) {
      navigate("/404", { replace: true })
      return
    }

    // Create new URL with updated page parameter
    const searchParams = new URLSearchParams(location.search)
    searchParams.set("page", pageNumber.toString())

    // Navigate to the new URL
    navigate(`${location.pathname}?${searchParams.toString()}`)

    // Scroll to top of package list container
    if (packageListRef.current) {
      packageListRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  if (loading) {
    return (
      <div className="package-list-container" ref={packageListRef}>
        <div className="package-loading">
          <div className="loading-spinner"></div>
          <p>Loading amazing packages for you...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="package-list-container" ref={packageListRef}>
      {filteredPackages.length === 0 ? (
        <div className="package-no-results">
          <i className="fas fa-search fa-3x"></i>
          <h3>No packages found matching your criteria</h3>
          <p>Try adjusting your search filters or browse our other destinations</p>
        </div>
      ) : (
        <>
          <div className="package-results-summary">
            <p>
              Found <span>{filteredPackages.length}</span> packages matching your criteria
              <span className="package-page-indicator">
                (Page {currentPage} of {totalPages})
              </span>
            </p>
          </div>

          <div className="package-grid">
            {filteredPackages.slice((currentPage - 1) * packagesPerPage, currentPage * packagesPerPage).map((pkg) => (
              <div key={pkg._id || pkg.id} className="package-card-wrapper">
                <PackageCard key={pkg._id || pkg.id} package={pkg} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="package-pagination">
              <button
                onClick={() => {
                  const searchParams = new URLSearchParams(location.search)
                  searchParams.set("page", Math.max(1, currentPage - 1).toString())
                  navigate(`${location.pathname}?${searchParams.toString()}`)
                }}
                disabled={currentPage === 1}
                className="package-pagination-button"
                aria-label="Previous page"
              >
                <i className="fas fa-chevron-left"></i> Previous
              </button>

              <div className="package-page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={`page-${page}`}
                    onClick={() => {
                      const searchParams = new URLSearchParams(location.search)
                      searchParams.set("page", page.toString())
                      navigate(`${location.pathname}?${searchParams.toString()}`)
                    }}
                    className={`package-page-number ${currentPage === page ? "package-page-active" : ""}`}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  const searchParams = new URLSearchParams(location.search)
                  searchParams.set("page", Math.min(totalPages, currentPage + 1).toString())
                  navigate(`${location.pathname}?${searchParams.toString()}`)
                }}
                disabled={currentPage === totalPages}
                className="package-pagination-button"
                aria-label="Next page"
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PackageList
