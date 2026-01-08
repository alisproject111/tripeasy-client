"use client"

import { useState, useEffect, useRef } from "react"
import "../styles/CustomizePackageModal.css"
import Toast from "./Toast"
import { apiEndpoints } from "../config/api"

function CustomizePackageModal({ onClose }) {
  const modalRef = useRef(null)
  const [activeTab, setActiveTab] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    origin: "",
    destination: "",
    startDate: "",
    duration: "",
    budget: "",
    travelers: "1",
    activities: [],
    accommodation: "standard",
    transportation: "public",
    specialRequests: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [toast, setToast] = useState({ show: false, message: "", type: "" })
  const [allDestinations, setAllDestinations] = useState([])

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

  // Activity options
  const activityOptions = [
    { id: "sightseeing", label: "Sightseeing & City Tours" },
    { id: "adventure", label: "Adventure Activities" },
    { id: "beach", label: "Beach & Water Sports" },
    { id: "cultural", label: "Cultural Experiences" },
    { id: "wildlife", label: "Wildlife & Safari" },
    { id: "food", label: "Food & Culinary Tours" },
    { id: "shopping", label: "Shopping" },
    { id: "relaxation", label: "Wellness & Spa" },
    { id: "photography", label: "Photography Tours" },
    { id: "nightlife", label: "Nightlife" },
  ]

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Close modal on escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [onClose])

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }

    // For phone field, only allow digits
    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, "")
      setFormData({
        ...formData,
        [name]: onlyNums,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }

    // Show destination suggestions
    if (name === "destination") {
      if (value.trim().length > 0) {
        const filtered = allDestinations.filter((dest) => dest.toLowerCase().includes(value.toLowerCase()))
        setSuggestions(filtered)
        setShowSuggestions(true)
      } else {
        setSuggestions(allDestinations)
        setShowSuggestions(false)
      }
    }
  }

  // Handle destination suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    setFormData({
      ...formData,
      destination: suggestion,
    })
    setShowSuggestions(false)
  }

  // Handle checkbox change for activities
  const handleActivityChange = (e) => {
    const { value, checked } = e.target

    if (checked) {
      setFormData({
        ...formData,
        activities: [...formData.activities, value],
      })
    } else {
      setFormData({
        ...formData,
        activities: formData.activities.filter((activity) => activity !== value),
      })
    }
  }

  // Replace the validateForm function with this improved version
  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    // Validate based on active tab
    if (activeTab === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Name is required"
        isValid = false
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address (e.g., name@example.com)"
        isValid = false
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required"
        isValid = false
      } else if (/[^0-9]/.test(formData.phone)) {
        newErrors.phone = "Phone number should contain only digits"
        isValid = false
      } else if (formData.phone.startsWith("0")) {
        newErrors.phone = "Phone number should not start with 0"
        isValid = false
      } else if (formData.phone.length !== 10) {
        newErrors.phone = "Phone number must be exactly 10 digits"
        isValid = false
      }
    } else if (activeTab === 2) {
      if (!formData.origin.trim()) {
        newErrors.origin = "Origin is required"
        isValid = false
      }
      if (!formData.destination.trim()) {
        newErrors.destination = "Destination is required"
        isValid = false
      }
      if (!formData.startDate) {
        newErrors.startDate = "Start date is required"
        isValid = false
      }
      if (!formData.duration) {
        newErrors.duration = "Duration is required"
        isValid = false
      }
      if (!formData.budget) {
        newErrors.budget = "Budget is required"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  // Update the handleNext function to show a toast with error summary
  const handleNext = () => {
    if (validateForm()) {
      setActiveTab(activeTab + 1)
    }
  }

  // Handle previous tab
  const handlePrev = () => {
    setActiveTab(activeTab - 1)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare data for API
      const requestData = {
        ...formData,
      }

      // Send data to backend API using apiEndpoints
      const response = await fetch(apiEndpoints.createCustomPackageRequest, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      const data = await response.json()

      if (data.success) {
        setIsSubmitting(false)
        setIsSuccess(true)

        // Reset form after 5 seconds and close modal
        setTimeout(() => {
          onClose()
        }, 5000)
      } else {
        throw new Error(data.message || "Failed to submit request")
      }
    } catch (error) {
      console.error("[v0] Error submitting form:", error)
      setToast({
        show: true,
        message: "There was an error submitting your request. Please try again.",
        type: "error",
      })

      // Hide toast after 5 seconds
      setTimeout(() => {
        setToast({ show: false, message: "", type: "" })
      }, 5000)

      setIsSubmitting(false)
    }
  }

  // Calculate minimum date (5 days from now)
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 5)
  const minDateStr = minDate.toISOString().split("T")[0]

  // Calculate maximum date (1 year from now)
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 1)
  const maxDateStr = maxDate.toISOString().split("T")[0]

  return (
    <div className={`customize-modal-overlay ${isSubmitting ? "submitting" : ""}`}>
      {toast.show && <Toast message={toast.message} type={toast.type} />}

      {isSubmitting && (
        <div className="submission-animation">
          <div className="animation-content">
            <div className="spinner-container">
              <div className="spinner-circle"></div>
              <div className="spinner-circle-outer"></div>
            </div>
            <p>Sending your request...</p>
          </div>
        </div>
      )}

      <div className="customize-modal" ref={modalRef}>
        {isSuccess ? (
          <div className="success-message">
            <button className="close-success-btn" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Thank You!</h3>
            <p>Your custom package request has been submitted successfully.</p>
            <p>Our travel experts will contact you shortly.</p>
            <div className="success-timer">
              <div className="timer-bar"></div>
              <p className="timer-text">Closing in 5 seconds...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2>
                <i className="fas fa-magic"></i> Customize Your Dream Trip
              </h2>
              <button className="close-btn" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="progress-bar">
              <div className="progress-steps">
                <div className={`step ${activeTab >= 1 ? "active" : ""}`}>
                  <div className="step-number">1</div>
                  <div className="step-label">Personal Info</div>
                </div>
                <div className={`step ${activeTab >= 2 ? "active" : ""}`}>
                  <div className="step-number">2</div>
                  <div className="step-label">Trip Details</div>
                </div>
                <div className={`step ${activeTab >= 3 ? "active" : ""}`}>
                  <div className="step-number">3</div>
                  <div className="step-label">Preferences</div>
                </div>
              </div>
              <div className="progress-line">
                <div className="progress-line-fill" style={{ width: `${((activeTab - 1) / 2) * 100}%` }}></div>
              </div>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                {/* Tab 1: Personal Information */}
                <div className={`tab-content ${activeTab === 1 ? "active" : ""}`}>
                  <h3 className="tab-title">
                    <i className="fas fa-user"></i> Personal Information
                  </h3>

                  <div className="form-group">
                    <label htmlFor="fullName">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={errors.fullName ? "error" : ""}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && <div className="error-message">{errors.fullName}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "error" : ""}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? "error" : ""}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <div className="error-message">{errors.phone}</div>}
                  </div>
                </div>

                {/* Tab 2: Trip Details */}
                <div className={`tab-content ${activeTab === 2 ? "active" : ""}`}>
                  <h3 className="tab-title">
                    <i className="fas fa-map-marked-alt"></i> Trip Details
                  </h3>

                  <div className="form-group">
                    <label htmlFor="origin">
                      From <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="origin"
                      name="origin"
                      value={formData.origin}
                      onChange={handleChange}
                      className={errors.origin ? "error" : ""}
                      placeholder="Where are you traveling from?"
                    />
                    {errors.origin && <div className="error-message">{errors.origin}</div>}
                  </div>

                  <div className="form-group destination-group">
                    <label htmlFor="destination">
                      To <span className="required">*</span>
                    </label>
                    <div className="destination-input-wrapper">
                      <input
                        type="text"
                        id="destination"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        onFocus={() => setShowSuggestions(true)}
                        className={errors.destination ? "error" : ""}
                        placeholder="Where do you want to go?"
                        autoComplete="off"
                      />
                      {showSuggestions && suggestions.length > 0 && (
                        <div className="destination-suggestions">
                          <ul>
                            {suggestions.slice(0, 5).map((suggestion, index) => (
                              <li key={index} onClick={() => handleSelectSuggestion(suggestion)}>
                                <i className="fas fa-map-marker-alt"></i> {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {errors.destination && <div className="error-message">{errors.destination}</div>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="startDate">
                        Start Date <span className="required">*</span>
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        min={minDateStr}
                        max={maxDateStr}
                        className={errors.startDate ? "error" : ""}
                      />
                      {errors.startDate && <div className="error-message">{errors.startDate}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="duration">
                        Duration <span className="required">*</span>
                      </label>
                      <select
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className={errors.duration ? "error" : ""}
                      >
                        <option value="">Select duration</option>
                        <option value="1-3">1-3 days</option>
                        <option value="4-7">4-7 days</option>
                        <option value="8-14">8-14 days</option>
                        <option value="15+">15+ days</option>
                      </select>
                      {errors.duration && <div className="error-message">{errors.duration}</div>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="budget">
                        Budget (per person) <span className="required">*</span>
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className={errors.budget ? "error" : ""}
                      >
                        <option value="">Select budget range</option>
                        <option value="0-20000">₹0 - ₹20,000</option>
                        <option value="20000-50000">₹20,000 - ₹50,000</option>
                        <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                        <option value="100000+">₹1,00,000+</option>
                      </select>
                      {errors.budget && <div className="error-message">{errors.budget}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="travelers">Number of Travelers</label>
                      <select id="travelers" name="travelers" value={formData.travelers} onChange={handleChange}>
                        {[...Array(10)].map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1} {i === 0 ? "traveler" : "travelers"}
                          </option>
                        ))}
                        <option value="10+">10+ travelers</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tab 3: Preferences */}
                <div className={`tab-content ${activeTab === 3 ? "active" : ""}`}>
                  <h3 className="tab-title">
                    <i className="fas fa-heart"></i> Preferences
                  </h3>

                  <div className="form-group">
                    <label>Preferred Activities</label>
                    <div className="activities-grid">
                      {activityOptions.map((activity) => (
                        <div className="activity-checkbox" key={activity.id}>
                          <input
                            type="checkbox"
                            id={`modal-activity-${activity.id}`}
                            name="activities"
                            value={activity.id}
                            checked={formData.activities.includes(activity.id)}
                            onChange={handleActivityChange}
                          />
                          <label htmlFor={`modal-activity-${activity.id}`}>{activity.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="accommodation">Accommodation Preference</label>
                      <select
                        id="accommodation"
                        name="accommodation"
                        value={formData.accommodation}
                        onChange={handleChange}
                      >
                        <option value="budget">Budget (2-3 star)</option>
                        <option value="standard">Standard (3-4 star)</option>
                        <option value="luxury">Luxury (4-5 star)</option>
                        <option value="ultra-luxury">Ultra Luxury (5 star+)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="transportation">Transportation Preference</label>
                      <select
                        id="transportation"
                        name="transportation"
                        value={formData.transportation}
                        onChange={handleChange}
                      >
                        <option value="public">Public Transportation</option>
                        <option value="private">Private Vehicle</option>
                        <option value="luxury">Luxury Transportation</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="specialRequests">Special Requests or Additional Information</label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      placeholder="Tell us about any special requirements, dietary restrictions, accessibility needs, or anything else we should know..."
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              {activeTab > 1 && (
                <button type="button" className="prev-btn" onClick={handlePrev}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
              )}

              {activeTab < 3 ? (
                <button type="button" className="next-btn" onClick={handleNext}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button type="button" className="submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div> Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Submit Request
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CustomizePackageModal
