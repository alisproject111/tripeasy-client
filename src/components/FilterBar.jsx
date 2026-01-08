"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import "../styles/SearchBar.css" // Use the SearchBar styles
import "../styles/FilterBar.css" // Keep this for any specific FilterBar styles
import { apiEndpoints } from "../config/api"

function FilterBar({ onFilterChange, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    destination: initialFilters.destination || "",
    duration: initialFilters.duration || "",
    budget: initialFilters.budget || "",
    sortBy: initialFilters.sortBy || "price-low",
  })

  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1)
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1)
  const [allDestinations, setAllDestinations] = useState([])

  const suggestionsRef = useRef(null)
  const destinationInputRef = useRef(null)
  const durationDropdownRef = useRef(null)
  const budgetDropdownRef = useRef(null)
  const sortByDropdownRef = useRef(null)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        console.log("[v0] Fetching destinations from:", apiEndpoints.getAllPackages)
        const response = await fetch(apiEndpoints.getAllPackages)

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] API Response:", data)

          if (data.success && data.packages) {
            const destinationNames = [...new Set(data.packages.map((pkg) => pkg.location))].sort()
            setAllDestinations(destinationNames)
            console.log("[v0] Destinations loaded:", destinationNames)
            return
          }
        }

        console.error("[v0] Failed to fetch from API, status:", response.status)
        setAllDestinations([])
      } catch (error) {
        console.error("[v0] Error fetching destinations:", error)
        setAllDestinations([])
      }
    }

    fetchDestinations()
  }, [])

  // Handle destination input change and show suggestions
  const handleDestinationChange = (e) => {
    const value = e.target.value
    setFilters((prev) => ({ ...prev, destination: value }))
    setFocusedSuggestionIndex(-1)

    if (value.trim().length > 0) {
      const filtered = allDestinations.filter((dest) => dest.toLowerCase().includes(value.toLowerCase()))

      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions(allDestinations)
      setShowSuggestions(true)
    }
  }

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    setFilters((prev) => ({ ...prev, destination: suggestion }))
    setSuggestions([])
    setShowSuggestions(false)
    setFocusedSuggestionIndex(-1)
    destinationInputRef.current?.blur() // Remove focus from input to prevent dropdown from reopening
  }

  // Handle dropdown toggle
  const toggleDropdown = (dropdown) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null)
      setFocusedOptionIndex(-1)
    } else {
      setActiveDropdown(dropdown)
      setFocusedOptionIndex(-1)
    }
  }

  // Handle duration selection
  const handleDurationSelect = (value) => {
    setFilters((prev) => ({ ...prev, duration: value }))
    setActiveDropdown(null)
    setFocusedOptionIndex(-1)
  }

  // Handle budget selection
  const handleBudgetSelect = (value) => {
    setFilters((prev) => ({ ...prev, budget: value }))
    setActiveDropdown(null)
    setFocusedOptionIndex(-1)
  }

  // Handle sort by selection
  const handleSortBySelect = (value) => {
    setFilters((prev) => ({ ...prev, sortBy: value }))
    setActiveDropdown(null)
    setFocusedOptionIndex(-1)
  }

  // Handle keyboard navigation for suggestions
  const handleDestinationKeyDown = (e) => {
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

  // Handle keyboard navigation for dropdown options
  const handleDropdownKeyDown = (e, options, selectHandler) => {
    if (!activeDropdown) return

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setFocusedOptionIndex((prevIndex) => (prevIndex < options.length - 1 ? prevIndex + 1 : prevIndex))
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setFocusedOptionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0))
    }
    // Enter
    else if (e.key === "Enter" && focusedOptionIndex >= 0) {
      e.preventDefault()
      selectHandler(options[focusedOptionIndex].value)
    }
    // Escape
    else if (e.key === "Escape") {
      setActiveDropdown(null)
      setFocusedOptionIndex(-1)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        destinationInputRef.current &&
        !destinationInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }

      if (
        activeDropdown === "duration" &&
        durationDropdownRef.current &&
        !durationDropdownRef.current.contains(event.target)
      ) {
        setActiveDropdown(null)
      }

      if (
        activeDropdown === "budget" &&
        budgetDropdownRef.current &&
        !budgetDropdownRef.current.contains(event.target)
      ) {
        setActiveDropdown(null)
      }

      if (
        activeDropdown === "sortBy" &&
        sortByDropdownRef.current &&
        !sortByDropdownRef.current.contains(event.target)
      ) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeDropdown])

  // Use useCallback to prevent unnecessary re-renders
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      onFilterChange(filters)
    },
    [filters, onFilterChange],
  )

  const handleReset = useCallback(() => {
    const resetFilters = {
      destination: "",
      duration: "",
      budget: "",
      sortBy: "price-low",
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }, [onFilterChange])

  // Update filters when initialFilters change (e.g., from URL params)
  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      destination: initialFilters.destination || prevFilters.destination,
      duration: initialFilters.duration || prevFilters.duration,
      budget: initialFilters.budget || prevFilters.budget,
      sortBy: initialFilters.sortBy || prevFilters.sortBy,
    }))
  }, [initialFilters])

  // Define dropdown options
  const durationOptions = [
    { label: "Any Duration", value: "" },
    { label: "1-3 Days", value: "1-3" },
    { label: "4-7 Days", value: "4-7" },
    { label: "8-14 Days", value: "8-14" },
    { label: "15+ Days", value: "15+" },
  ]

  const budgetOptions = [
    { label: "Any Budget", value: "" },
    { label: "₹0 - ₹20,000", value: "0-20000" },
    { label: "₹20,000 - ₹50,000", value: "20000-50000" },
    { label: "₹50,000 - ₹1,00,000", value: "50000-100000" },
    { label: "₹1,00,000+", value: "100000+" },
  ]

  const sortByOptions = [
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Duration: Short to Long", value: "duration-low" },
    { label: "Duration: Long to Short", value: "duration-high" },
    { label: "Popularity", value: "popularity" },
  ]

  const handleDestinationFocus = () => {
    // Show all suggestions when input is focused and empty, or show filtered suggestions if there's text
    if (!filters.destination.trim()) {
      setSuggestions(allDestinations)
      setShowSuggestions(true)
    } else {
      const filtered = allDestinations.filter((dest) => dest.toLowerCase().includes(filters.destination.toLowerCase()))
      setSuggestions(filtered)
      setShowSuggestions(true)
    }
  }

  useEffect(() => {
    if (focusedSuggestionIndex >= 0 && suggestionsRef.current) {
      const suggestionItems = suggestionsRef.current.querySelectorAll(".suggestion-item")
      if (suggestionItems[focusedSuggestionIndex]) {
        suggestionItems[focusedSuggestionIndex].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }
    }
  }, [focusedSuggestionIndex])

  return (
    <div className="search-bar-container">
      <div className="search-bar-content">
        <div className="search-bar-header">
          <h2 className="search-title">
            <span className="search-icon-wrapper">
              <i className="fas fa-search"></i>
            </span>
            Find Your Perfect Trip
          </h2>
          <p className="search-subtitle">Search and compare from thousands of destinations</p>
        </div>

        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-fields-container">
            <div className="search-group">
              <label htmlFor="destination">
                <i className="fas fa-map-marker-alt"></i>
                Destination
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="destination"
                  placeholder="Where do you want to go?"
                  value={filters.destination}
                  onChange={handleDestinationChange}
                  onKeyDown={handleDestinationKeyDown}
                  onFocus={handleDestinationFocus} // Use the new handleDestinationFocus function
                  className="search-input"
                  autoComplete="off"
                  ref={destinationInputRef}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="suggestions-container" ref={suggestionsRef}>
                    <ul className="suggestions-list">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className={`suggestion-item ${focusedSuggestionIndex === index ? "focused" : ""}`}
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          <i className="fas fa-map-marker-alt"></i>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="search-group">
              <label htmlFor="duration">
                <i className="fas fa-calendar-alt"></i>
                Duration
              </label>
              <div
                className="custom-dropdown"
                ref={durationDropdownRef}
                tabIndex={0}
                onKeyDown={(e) => handleDropdownKeyDown(e, durationOptions, handleDurationSelect)}
              >
                <div className="dropdown-selected" onClick={() => toggleDropdown("duration")}>
                  <span>
                    {filters.duration
                      ? filters.duration === "1-3"
                        ? "1-3 Days"
                        : filters.duration === "4-7"
                          ? "4-7 Days"
                          : filters.duration === "8-14"
                            ? "8-14 Days"
                            : filters.duration === "15+"
                              ? "15+ Days"
                              : "Any Duration"
                      : "Any Duration"}
                  </span>
                  <i className={`fas fa-chevron-down ${activeDropdown === "duration" ? "rotate" : ""}`}></i>
                </div>
                {activeDropdown === "duration" && (
                  <div className="dropdown-options">
                    {durationOptions.map((option, index) => (
                      <div
                        key={index}
                        className={`dropdown-option ${focusedOptionIndex === index ? "focused" : ""}`}
                        onClick={() => handleDurationSelect(option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="search-group">
              <label htmlFor="budget">
                <i className="fas fa-wallet"></i>
                Budget
              </label>
              <div
                className="custom-dropdown"
                ref={budgetDropdownRef}
                tabIndex={0}
                onKeyDown={(e) => handleDropdownKeyDown(e, budgetOptions, handleBudgetSelect)}
              >
                <div className="dropdown-selected" onClick={() => toggleDropdown("budget")}>
                  <span>
                    {filters.budget
                      ? filters.budget === "0-20000"
                        ? "₹0 - ₹20,000"
                        : filters.budget === "20000-50000"
                          ? "₹20,000 - ₹50,000"
                          : filters.budget === "50000-100000"
                            ? "₹50,000 - ₹1,00,000"
                            : filters.budget === "100000+"
                              ? "₹1,00,000+"
                              : "Any Budget"
                      : "Any Budget"}
                  </span>
                  <i className={`fas fa-chevron-down ${activeDropdown === "budget" ? "rotate" : ""}`}></i>
                </div>
                {activeDropdown === "budget" && (
                  <div className="dropdown-options">
                    {budgetOptions.map((option, index) => (
                      <div
                        key={index}
                        className={`dropdown-option ${focusedOptionIndex === index ? "focused" : ""}`}
                        onClick={() => handleBudgetSelect(option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="search-group">
              <label htmlFor="sortBy">
                <i className="fas fa-sort"></i>
                Sort By
              </label>
              <div
                className="custom-dropdown"
                ref={sortByDropdownRef}
                tabIndex={0}
                onKeyDown={(e) => handleDropdownKeyDown(e, sortByOptions, handleSortBySelect)}
              >
                <div className="dropdown-selected" onClick={() => toggleDropdown("sortBy")}>
                  <span>
                    {filters.sortBy === "price-low"
                      ? "Price: Low to High"
                      : filters.sortBy === "price-high"
                        ? "Price: High to Low"
                        : filters.sortBy === "duration-low"
                          ? "Duration: Short to Long"
                          : filters.sortBy === "duration-high"
                            ? "Duration: Long to Short"
                            : filters.sortBy === "popularity"
                              ? "Popularity"
                              : "Price: Low to High"}
                  </span>
                  <i className={`fas fa-chevron-down ${activeDropdown === "sortBy" ? "rotate" : ""}`}></i>
                </div>
                {activeDropdown === "sortBy" && (
                  <div className="dropdown-options">
                    {sortByOptions.map((option, index) => (
                      <div
                        key={index}
                        className={`dropdown-option ${focusedOptionIndex === index ? "focused" : ""}`}
                        onClick={() => handleSortBySelect(option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="filter-buttons">
            <button type="submit" className="search-button group">
              <span>Search Packages</span>
              <i className="fas fa-search transition-transform group-hover:scale-110"></i>
            </button>
            <button type="button" className="reset-filter-btn" onClick={handleReset}>
              <i className="fas fa-undo"></i>
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FilterBar
