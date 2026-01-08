"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/CustomizePackage.css"
import AnimatedElement from "./AnimatedElement"
import Toast from "./Toast"

function CustomizePackage() {
  const navigate = useNavigate()
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
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [allDestinations, setAllDestinations] = useState([])

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

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch("https://tripeasy-server.vercel.app/api/destinations")
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

  // Replace the handleChange function with this improved version
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
        setShowSuggestions(true)
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

    if (!formData.fullName.trim()) newErrors.fullName = "Name is required"

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address (e.g., name@example.com)"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (/[^0-9]/.test(formData.phone)) {
      newErrors.phone = "Phone number should contain only digits"
    } else if (formData.phone.startsWith("0")) {
      newErrors.phone = "Phone number should not start with 0"
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits"
    }

    if (!formData.origin.trim()) newErrors.origin = "Origin is required"
    if (!formData.destination.trim()) newErrors.destination = "Destination is required"
    if (!formData.startDate) newErrors.startDate = "Start date is required"
    if (!formData.duration) newErrors.duration = "Duration is required"
    if (!formData.budget) newErrors.budget = "Budget is required"

    return newErrors
  }

  // Replace the handleSubmit function to remove toast notifications for validation
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("https://tripeasy-server.vercel.app/api/submit-custom-package", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          origin: formData.origin,
          destination: formData.destination,
          startDate: formData.startDate,
          duration: formData.duration,
          budget: formData.budget,
          travelers: formData.travelers,
          activities: formData.activities,
          accommodation: formData.accommodation,
          transportation: formData.transportation,
          specialRequests: formData.specialRequests,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit request")
      }

      // Show success message
      setToastMessage("Your custom package request has been submitted successfully! Our team will contact you shortly.")
      setToastType("success")
      setShowToast(true)

      // Reset form after successful submission
      setFormData({
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

      // Scroll to top to show the toast
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      console.error("Error submitting form:", error)
      setToastMessage(error.message || "There was an error submitting your request. Please try again.")
      setToastType("error")
      setShowToast(true)
    } finally {
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

  // Add background image and enhanced UI elements at the top of the component
  return (
    <div className="customize-package-container">
      {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}

      <div className="customize-package-header">
        <AnimatedElement animation="fade-up">
          <h2 className="customize-package-title">
            <i className="fas fa-magic customize-icon"></i>
            Customize Your Dream Package
          </h2>
          <p className="customize-package-subtitle">
            Tell us what you're looking for and we'll create a personalized travel experience just for you
          </p>
        </AnimatedElement>
      </div>

      <div className="customize-package-content">
        <div
          className="customize-package-banner"
          style={{
            backgroundImage: "url('/src/assets/images/customize-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "200px",
            borderRadius: "15px 15px 0 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              padding: "20px",
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: "1.8rem",
                fontWeight: "bold",
                textAlign: "center",
                textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                marginBottom: "10px",
              }}
            >
              Your Journey, Your Way
            </div>
            <div
              style={{
                color: "white",
                fontSize: "1.1rem",
                textAlign: "center",
                maxWidth: "600px",
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              Get a custom travel package tailored to your preferences and budget
            </div>
          </div>
        </div>

        <AnimatedElement animation="fade-up" delay={200}>
          <form className="customize-package-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="section-title">
                <i className="fas fa-user section-icon"></i>
                Personal Information
              </h3>
              <div className="form-row">
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
            </div>

            <div className="form-section">
              <h3 className="section-title">
                <i className="fas fa-map-marked-alt section-icon"></i>
                Trip Details
              </h3>
              <div className="form-row">
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
                    {showSuggestions && allDestinations.length > 0 && (
                      <div className="destination-suggestions">
                        <ul>
                          {allDestinations.slice(0, 5).map((suggestion, index) => (
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

            <div className="form-section">
              <h3 className="section-title">
                <i className="fas fa-hiking section-icon"></i>
                Preferences
              </h3>

              <div className="form-group">
                <label>Preferred Activities</label>
                <div className="activities-grid">
                  {activityOptions.map((activity) => (
                    <div className="activity-checkbox" key={activity.id}>
                      <input
                        type="checkbox"
                        id={`activity-${activity.id}`}
                        name="activities"
                        value={activity.id}
                        checked={formData.activities.includes(activity.id)}
                        onChange={handleActivityChange}
                      />
                      <label htmlFor={`activity-${activity.id}`}>{activity.label}</label>
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
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="spinner-border"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </AnimatedElement>
      </div>
    </div>
  )
}

export default CustomizePackage