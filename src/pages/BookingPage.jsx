"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import "../styles/BookingPage.css"
import AnimatedElement from "../components/AnimatedElement"
import { apiEndpoints } from "../config/api"

function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [packageData, setPackageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [activeCustomer, setActiveCustomer] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    travelDate: "",
    travelers: 1,
    specialRequests: "",
    termsAccepted: false,
    additionalTravelers: [],
  })

  // Form errors
  const [formErrors, setFormErrors] = useState({})

  // Calculate total price
  const totalPrice = packageData ? packageData.price * formData.travelers : 0

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" })

    const fetchPackageData = async () => {
      try {
        const fetchUrl = apiEndpoints.getPackageById(id)
        console.log("[v0] Booking: Fetching package from:", fetchUrl)

        const response = await fetch(fetchUrl)

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.package) {
          setPackageData(data.package)
          console.log("[v0] Booking: Package loaded successfully")
          setLoading(false)
        } else {
          setError("Package not found")
          setLoading(false)
        }
      } catch (err) {
        console.error("[v0] Error fetching package for booking:", err)
        setError("Error loading package details")
        setLoading(false)
      }
    }

    fetchPackageData()
  }, [id])

  // Update additional travelers when traveler count changes
  useEffect(() => {
    const currentTravelers = formData.additionalTravelers || []
    const newTravelerCount = Math.max(0, formData.travelers - 1)

    if (currentTravelers.length < newTravelerCount) {
      // Add more traveler slots
      const newTravelers = [...currentTravelers]
      for (let i = currentTravelers.length; i < newTravelerCount; i++) {
        newTravelers.push({ fullName: "", gender: "", age: "" })
      }
      setFormData((prev) => ({
        ...prev,
        additionalTravelers: newTravelers,
      }))
    } else if (currentTravelers.length > newTravelerCount) {
      // Remove excess traveler slots
      setFormData((prev) => ({
        ...prev,
        additionalTravelers: currentTravelers.slice(0, newTravelerCount),
      }))
    }
  }, [formData.travelers])

  // Set minimum date for travel date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 3)
  const minDate = tomorrow.toISOString().split("T")[0]

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    // Use the checked value for checkboxes, otherwise use the value
    const newValue = type === "checkbox" ? checked : value

    // Validation for phone number (numbers only, not starting with 0, and max 10 digits)
    if (name === "phone") {
      // Only allow digits
      if (!/^\d*$/.test(value)) {
        return // Don't update if non-digit characters
      }
      // Don't allow starting with 0
      if (value.length > 0 && value[0] === "0") {
        return // Don't update if starts with 0
      }
      // Limit to 10 digits
      if (value.length > 10) {
        return // Don't update if more than 10 digits
      }
    }

    // Validation for age (numbers only)
    if (name === "age") {
      if (!/^\d*$/.test(value)) {
        return // Don't update if non-digit characters
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  // Handle additional traveler form changes
  const handleTravelerChange = (index, field, value) => {
    // Validation for age (numbers only)
    if (field === "age" && !/^\d*$/.test(value)) {
      return // Don't update if non-digit characters
    }

    const updatedTravelers = [...formData.additionalTravelers]
    updatedTravelers[index] = {
      ...updatedTravelers[index],
      [field]: value,
    }

    setFormData((prev) => ({
      ...prev,
      additionalTravelers: updatedTravelers,
    }))

    // Clear error if exists
    if (formErrors[`traveler_${index}_${field}`]) {
      setFormErrors((prev) => ({
        ...prev,
        [`traveler_${index}_${field}`]: undefined,
      }))
    }
  }

  // Toggle active customer details section
  const toggleCustomerDetails = (index) => {
    if (activeCustomer === index) {
      setActiveCustomer(null)
    } else {
      setActiveCustomer(index)
      // Remove scrolling behavior when opening traveler details
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}

    // Validate primary traveler
    if (!formData.fullName.trim()) errors.fullName = "Full name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Email is invalid"

    if (!formData.phone.trim()) errors.phone = "Phone number is required"
    else if (!/^\d{10}$/.test(formData.phone)) errors.phone = "Phone must be 10 digits"

    if (!formData.gender) errors.gender = "Gender is required"
    if (!formData.age) errors.age = "Age is required"
    else if (isNaN(formData.age) || formData.age <= 0 || formData.age > 120) errors.age = "Please enter a valid age"

    if (formData.travelers < 1) errors.travelers = "At least 1 traveler is required"
    if (formData.travelers > 20) errors.travelers = "Maximum 20 travelers allowed"

    if (!formData.travelDate) errors.travelDate = "Travel date is required"

    if (!formData.termsAccepted) errors.termsAccepted = "You must accept the terms and conditions"

    // Validate additional travelers
    formData.additionalTravelers.forEach((traveler, index) => {
      if (!traveler.fullName.trim()) errors[`traveler_${index}_fullName`] = "Full name is required"

      if (!traveler.gender) errors[`traveler_${index}_gender`] = "Gender is required"

      if (!traveler.age) errors[`traveler_${index}_age`] = "Age is required"
      else if (isNaN(traveler.age) || traveler.age <= 0 || traveler.age > 120)
        errors[`traveler_${index}_age`] = "Please enter a valid age"
    })

    return errors
  }

  // Add a function to handle traveler count changes with validation
  const handleTravelerCountChange = (e) => {
    const value = Number.parseInt(e.target.value)

    // Enforce the 20 traveler limit and minimum of 1
    if (value > 20) {
      setFormData((prev) => ({
        ...prev,
        travelers: 20,
      }))

      setFormErrors((prev) => ({
        ...prev,
        travelers: "Maximum 20 travelers allowed",
      }))
    } else if (value < 1) {
      setFormData((prev) => ({
        ...prev,
        travelers: 1,
      }))

      // Clear error message when value is valid
      setFormErrors((prev) => ({
        ...prev,
        travelers: undefined,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        travelers: value,
      }))

      // Clear error message when value is valid
      setFormErrors((prev) => ({
        ...prev,
        travelers: undefined,
      }))
    }
  }

  // Prevent scroll from changing number input value
  const preventScrollChange = (e) => {
    e.target.blur()
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)

      // Find the first error and scroll to it
      const firstErrorKey = Object.keys(errors)[0]

      // Handle different types of errors
      if (firstErrorKey.includes("traveler_")) {
        // Extract the traveler index from the error key
        const travelerIndex = Number.parseInt(firstErrorKey.split("_")[1]) + 1
        setActiveCustomer(travelerIndex)

        // Wait for the content to expand before scrolling
        setTimeout(() => {
          const element = document.querySelector(`.bp-traveler-card:nth-child(${travelerIndex + 2})`)
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 300)
      } else if (firstErrorKey === "termsAccepted") {
        const element = document.querySelector(".bp-terms-group")
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      } else if (
        firstErrorKey === "fullName" ||
        firstErrorKey === "email" ||
        firstErrorKey === "phone" ||
        firstErrorKey === "gender" ||
        firstErrorKey === "age" ||
        firstErrorKey === "travelDate"
      ) {
        setActiveCustomer(0)

        // Wait for the content to expand before scrolling
        setTimeout(() => {
          const element = document.getElementById(firstErrorKey)
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 300)
      } else {
        // For other errors like travelers count
        const element = document.getElementById(firstErrorKey)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }

      return
    }

    // Show confirmation modal
    setShowConfirmation(true)
  }

  const handleContinueToPayment = () => {
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)

      // Find the first error and scroll to it
      const firstErrorKey = Object.keys(errors)[0]

      // Handle different types of errors
      if (firstErrorKey.includes("traveler_")) {
        // Extract the traveler index from the error key
        const travelerIndex = Number.parseInt(firstErrorKey.split("_")[1]) + 1
        setActiveCustomer(travelerIndex)

        // Wait for the content to expand before scrolling
        setTimeout(() => {
          const element = document.querySelector(`.bp-traveler-card:nth-child(${travelerIndex + 2})`)
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 300)
      } else if (firstErrorKey === "termsAccepted") {
        const element = document.querySelector(".bp-terms-group")
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      } else if (
        firstErrorKey === "fullName" ||
        firstErrorKey === "email" ||
        firstErrorKey === "phone" ||
        firstErrorKey === "gender" ||
        firstErrorKey === "age" ||
        firstErrorKey === "travelDate"
      ) {
        setActiveCustomer(0)

        // Wait for the content to expand before scrolling
        setTimeout(() => {
          const element = document.getElementById(firstErrorKey)
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 300)
      } else {
        // For other errors like travelers count
        const element = document.getElementById(firstErrorKey)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }

      return
    }

    // Navigate to payment page with booking data
    navigate(`/payment/${id}`, {
      state: {
        bookingDetails: formData,
        packageDetails: packageData,
        totalPrice: totalPrice,
        packageId: id,
      },
    })
  }

  // Handle confirmation
  const handleConfirm = async () => {
    try {
      setShowConfirmation(false)
      setIsSending(true)

      // Submit booking request to backend using apiEndpoints
      const response = await fetch(apiEndpoints.createBookingRequest, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingDetails: formData,
          packageDetails: packageData,
          totalPrice: totalPrice,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Clear form data from localStorage
        localStorage.removeItem(`bookingFormData_${id}`)

        setIsSending(false)
        setShowSuccess(true)

        // Navigate back after showing success message
        setTimeout(() => {
          navigate(`/package/${id}`)
        }, 3000)
      } else {
        throw new Error(result.message || "Failed to submit booking request")
      }
    } catch (error) {
      console.error("[v0] Error submitting booking request:", error)
      setIsSending(false)
      alert("Failed to submit booking request. Please try again.")
    }
  }

  useEffect(() => {
    // Restore form data from localStorage if available
    const savedFormData = localStorage.getItem(`bookingFormData_${id}`)
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData)
        setFormData(parsedData)
      } catch (err) {
        console.error("Error parsing saved form data", err)
      }
    }
  }, [id])

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (formData.fullName || formData.email || formData.phone) {
      localStorage.setItem(`bookingFormData_${id}`, JSON.stringify(formData))
    }
  }, [formData, id])

  if (loading) {
    return (
      <div className="bp-loading-container">
        <div className="bp-loading-spinner"></div>
        <p>Loading booking form...</p>
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="bp-error-container">
        <i className="fas fa-exclamation-circle fa-3x"></i>
        <h2>Error</h2>
        <p>{error || "Package not found"}</p>
        <Link to="/packages" className="bp-back-button">
          <i className="fas fa-arrow-left"></i> Back to Packages
        </Link>
      </div>
    )
  }

  return (
    <div className="bp-booking-page">
      {isSending && (
        <div className="bp-sending-overlay">
          <div className="bp-sending-content">
            <div className="bp-sending-spinner"></div>
            <h3>Sending Your Request...</h3>
            <p>Please wait while we process your booking request</p>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="bp-success-overlay">
          <div className="bp-success-content">
            <div className="bp-success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Booking Request Sent Successfully!</h3>
            <p>We will contact you soon to confirm your booking details.</p>
            <div className="bp-success-checkmark">✓</div>
          </div>
        </div>
      )}

      {/* Updated header with inline background image */}
      <div 
        className="bp-booking-header"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/assets/hero/booking-header.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '60px 0',
          textAlign: 'center'
        }}
      >
        <div className="container">
          <AnimatedElement animation="fade-up">
            <h1 className="bp-page-title">Book Your Trip</h1>
            <p className="bp-page-subtitle">
              {packageData.name} - {packageData.location}
            </p>
          </AnimatedElement>
        </div>
      </div>

      <div className="container">
        <div className="bp-booking-container">
          <AnimatedElement animation="fade-up" delay={100}>
            <div className="bp-booking-summary">
              <h2 className="bp-summary-title">
                <i className="fas fa-suitcase bp-summary-icon"></i> Trip Summary
              </h2>
              <div className="bp-summary-details">
                <div className="bp-summary-item">
                  <div className="bp-summary-item-icon-wrapper">
                    <i className="fas fa-map-marked-alt bp-summary-item-icon"></i>
                    <span className="bp-summary-label">Package:</span>
                  </div>
                  <span className="bp-summary-value">{packageData.name}</span>
                </div>
                <div className="bp-summary-item">
                  <div className="bp-summary-item-icon-wrapper">
                    <i className="fas fa-map-marker-alt bp-summary-item-icon"></i>
                    <span className="bp-summary-label">Destination:</span>
                  </div>
                  <span className="bp-summary-value">{packageData.location}</span>
                </div>
                <div className="bp-summary-item">
                  <div className="bp-summary-item-icon-wrapper">
                    <i className="fas fa-calendar-alt bp-summary-item-icon"></i>
                    <span className="bp-summary-label">Duration:</span>
                  </div>
                  <span className="bp-summary-value">{packageData.duration} Days</span>
                </div>
                <div className="bp-summary-item">
                  <div className="bp-summary-item-icon-wrapper">
                    <i className="fas fa-tag bp-summary-item-icon"></i>
                    <span className="bp-summary-label">Price per person:</span>
                  </div>
                  <span className="bp-summary-value">₹{packageData.price.toLocaleString("en-IN")}</span>
                </div>
                <div className="bp-summary-item">
                  <div className="bp-summary-item-icon-wrapper">
                    <i className="fas fa-users bp-summary-item-icon"></i>
                    <span className="bp-summary-label">Number of travelers:</span>
                  </div>
                  <span className="bp-summary-value">{formData.travelers}</span>
                </div>
                <div className="bp-summary-item bp-total">
                  <div className="bp-summary-item-icon-wrapper">
                    <i className="fas fa-money-bill-wave bp-summary-item-icon"></i>
                    <span className="bp-summary-label">Total Price:</span>
                  </div>
                  <span className="bp-summary-value">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="bp-summary-features">
                <div className="bp-summary-feature">
                  <i className="fas fa-check-circle"></i>
                  <span>Instant Confirmation</span>
                </div>
                <div className="bp-summary-feature">
                  <i className="fas fa-check-circle"></i>
                  <span>Free Cancellation</span>
                </div>
                <div className="bp-summary-feature">
                  <i className="fas fa-check-circle"></i>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </AnimatedElement>

          <AnimatedElement animation="fade-up" delay={200}>
            <div className="bp-booking-form-container">
              <h2 className="bp-form-title">
                <i className="fas fa-user-circle bp-form-icon"></i> Traveler Information
              </h2>
              <form className="bp-booking-form" onSubmit={handleSubmit}>
                {/* Number of travelers selector */}
                <div className="bp-travelers-selector">
                  <label htmlFor="travelers" className="bp-travelers-label">
                    Number of Travelers <span className="bp-required">*</span>
                  </label>
                  <div className="bp-travelers-input-group">
                    <input
                      type="number"
                      id="travelers"
                      name="travelers"
                      min="1"
                      max="20"
                      value={formData.travelers}
                      onChange={handleTravelerCountChange}
                      onWheel={preventScrollChange}
                      className={formErrors.travelers ? "bp-error" : ""}
                    />
                    {formErrors.travelers && <div className="bp-error-message">{formErrors.travelers}</div>}
                  </div>
                </div>

                {/* Primary traveler details */}
                <div className="bp-traveler-card bp-primary-traveler">
                  <div
                    className={`bp-traveler-header ${activeCustomer === 0 ? "bp-active" : ""}`}
                    onClick={() => toggleCustomerDetails(0)}
                  >
                    <h3>
                      <i className="fas fa-user"></i> Lead Traveler
                      <span className="bp-traveler-subtitle">{formData.fullName ? ` - ${formData.fullName}` : ""}</span>
                    </h3>
                    <i
                      className={`fas ${activeCustomer === 0 ? "fa-chevron-up" : "fa-chevron-down"} bp-toggle-icon`}
                    ></i>
                  </div>

                  <div className={`bp-traveler-content ${activeCustomer === 0 ? "bp-traveler-content-active" : ""}`}>
                    <div className="bp-form-row">
                      <div className="bp-form-group">
                        <label htmlFor="fullName">
                          <i className="fas fa-user bp-field-icon"></i> Full Name <span className="bp-required">*</span>
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className={formErrors.fullName ? "bp-error" : ""}
                        />
                        {formErrors.fullName && <div className="bp-error-message">{formErrors.fullName}</div>}
                      </div>

                      <div className="bp-form-group">
                        <label htmlFor="email">
                          <i className="fas fa-envelope bp-field-icon"></i> Email <span className="bp-required">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={formErrors.email ? "bp-error" : ""}
                        />
                        {formErrors.email && <div className="bp-error-message">{formErrors.email}</div>}
                      </div>
                    </div>

                    <div className="bp-form-row">
                      <div className="bp-form-group">
                        <label htmlFor="phone">
                          <i className="fas fa-phone bp-field-icon"></i> Phone Number{" "}
                          <span className="bp-required">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={formErrors.phone ? "bp-error" : ""}
                        />
                        {formErrors.phone && <div className="bp-error-message">{formErrors.phone}</div>}
                      </div>

                      <div className="bp-form-group">
                        <label htmlFor="gender">
                          <i className="fas fa-venus-mars bp-field-icon"></i> Gender{" "}
                          <span className="bp-required">*</span>
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className={formErrors.gender ? "bp-error" : ""}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {formErrors.gender && <div className="bp-error-message">{formErrors.gender}</div>}
                      </div>
                    </div>

                    <div className="bp-form-row">
                      <div className="bp-form-group">
                        <label htmlFor="age">
                          <i className="fas fa-birthday-cake bp-field-icon"></i> Age{" "}
                          <span className="bp-required">*</span>
                        </label>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          min="1"
                          max="120"
                          value={formData.age}
                          onChange={handleChange}
                          onWheel={preventScrollChange}
                          className={formErrors.age ? "bp-error" : ""}
                        />
                        {formErrors.age && <div className="bp-error-message">{formErrors.age}</div>}
                      </div>

                      <div className="bp-form-group">
                        <label htmlFor="travelDate">
                          <i className="fas fa-calendar-alt bp-field-icon"></i> Travel Date{" "}
                          <span className="bp-required">*</span>
                        </label>
                        <input
                          type="date"
                          id="travelDate"
                          name="travelDate"
                          min={minDate}
                          value={formData.travelDate}
                          onChange={handleChange}
                          className={formErrors.travelDate ? "bp-error" : ""}
                        />
                        {formErrors.travelDate && <div className="bp-error-message">{formErrors.travelDate}</div>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional travelers */}
                {formData.additionalTravelers.map((traveler, index) => (
                  <div key={index} className="bp-traveler-card bp-additional-traveler">
                    <div
                      className={`bp-traveler-header ${activeCustomer === index + 1 ? "bp-active" : ""}`}
                      onClick={() => toggleCustomerDetails(index + 1)}
                    >
                      <h3>
                        <i className="fas fa-user-friends"></i> Traveler {index + 2}
                        <span className="bp-traveler-subtitle">
                          {traveler.fullName ? ` - ${traveler.fullName}` : ""}
                        </span>
                      </h3>
                      <i
                        className={`fas ${
                          activeCustomer === index + 1 ? "fa-chevron-up" : "fa-chevron-down"
                        } bp-toggle-icon`}
                      ></i>
                    </div>

                    <div
                      className={`bp-traveler-content ${
                        activeCustomer === index + 1 ? "bp-traveler-content-active" : ""
                      }`}
                    >
                      <div className="bp-form-row">
                        <div className="bp-form-group">
                          <label>
                            <i className="fas fa-user bp-field-icon"></i> Full Name{" "}
                            <span className="bp-required">*</span>
                          </label>
                          <input
                            type="text"
                            value={traveler.fullName}
                            onChange={(e) => handleTravelerChange(index, "fullName", e.target.value)}
                            className={formErrors[`traveler_${index}_fullName`] ? "bp-error" : ""}
                          />
                          {formErrors[`traveler_${index}_fullName`] && (
                            <div className="bp-error-message">{formErrors[`traveler_${index}_fullName`]}</div>
                          )}
                        </div>

                        <div className="bp-form-group">
                          <label>
                            <i className="fas fa-venus-mars bp-field-icon"></i> Gender{" "}
                            <span className="bp-required">*</span>
                          </label>
                          <select
                            value={traveler.gender}
                            onChange={(e) => handleTravelerChange(index, "gender", e.target.value)}
                            className={formErrors[`traveler_${index}_gender`] ? "bp-error" : ""}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                          {formErrors[`traveler_${index}_gender`] && (
                            <div className="bp-error-message">{formErrors[`traveler_${index}_gender`]}</div>
                          )}
                        </div>
                      </div>

                      <div className="bp-form-row">
                        <div className="bp-form-group">
                          <label>
                            <i className="fas fa-birthday-cake bp-field-icon"></i> Age{" "}
                            <span className="bp-required">*</span>
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="120"
                            value={traveler.age}
                            onChange={(e) => handleTravelerChange(index, "age", e.target.value)}
                            onWheel={preventScrollChange}
                            className={formErrors[`traveler_${index}_age`] ? "bp-error" : ""}
                          />
                          {formErrors[`traveler_${index}_age`] && (
                            <div className="bp-error-message">{formErrors[`traveler_${index}_age`]}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Special Requests - Moved outside traveler details */}
                <div className="bp-special-requests-section">
                  <h3 className="bp-special-requests-title">
                    <i className="fas fa-comment-alt"></i> Special Requests
                  </h3>
                  <div className="bp-form-group">
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      rows="3"
                      placeholder="Any special requirements or preferences? Let us know here."
                      value={formData.specialRequests}
                      onChange={handleChange}
                      className="bp-special-requests-textarea"
                    ></textarea>
                  </div>
                </div>

                <div className="bp-form-group bp-terms-group">
                  <div className="bp-terms-container">
                    <div className="bp-checkbox-container">
                      <input
                        type="checkbox"
                        id="termsAccepted"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className={formErrors.termsAccepted ? "bp-error" : ""}
                      />
                      <label htmlFor="termsAccepted" className="bp-terms-label">
                        I accept the{" "}
                        <a href="https://tripeasy.in/terms-and-conditions" target="_blank" rel="noopener noreferrer">
                          terms and conditions
                        </a>{" "}
                        <span className="bp-required">*</span>
                      </label>
                    </div>
                    {formErrors.termsAccepted && (
                      <div className="bp-error-message bp-terms-error">{formErrors.termsAccepted}</div>
                    )}
                  </div>
                </div>

                <div className="bp-form-actions">
                  <Link to={`/package/${id}`} className="bp-back-link">
                    <i className="fas fa-arrow-left"></i> Back to Package
                  </Link>
                  <button type="button" onClick={handleContinueToPayment} className="bp-continue-button">
                    Continue to Payment <i className="fas fa-arrow-right"></i>
                  </button>
                  <button type="submit" className="bp-send-request-button">
                    Send Request <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </form>
            </div>
          </AnimatedElement>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="bp-confirmation-modal">
          <div className="bp-confirmation-content">
            <div className="bp-confirmation-header">
              <i className="fas fa-check-circle bp-confirmation-icon"></i>
              <h2>Confirm Your Booking Request</h2>
              <p>Please review your booking details before sending the request</p>
            </div>

            <div className="bp-confirmation-details">
              <div className="bp-confirmation-info-grid">
                <div className="bp-confirmation-item">
                  <i className="fas fa-map-marked-alt bp-confirmation-item-icon"></i>
                  <div>
                    <span className="bp-confirmation-label">Package</span>
                    <span className="bp-confirmation-value">{packageData.name}</span>
                  </div>
                </div>
                <div className="bp-confirmation-item">
                  <i className="fas fa-map-marker-alt bp-confirmation-item-icon"></i>
                  <div>
                    <span className="bp-confirmation-label">Destination</span>
                    <span className="bp-confirmation-value">{packageData.location}</span>
                  </div>
                </div>
                <div className="bp-confirmation-item">
                  <i className="fas fa-users bp-confirmation-item-icon"></i>
                  <div>
                    <span className="bp-confirmation-label">Travelers</span>
                    <span className="bp-confirmation-value">{formData.travelers}</span>
                  </div>
                </div>
                <div className="bp-confirmation-item">
                  <i className="fas fa-calendar-alt bp-confirmation-item-icon"></i>
                  <div>
                    <span className="bp-confirmation-label">Travel Date</span>
                    <span className="bp-confirmation-value">{formData.travelDate}</span>
                  </div>
                </div>
                <div className="bp-confirmation-item">
                  <i className="fas fa-money-bill-wave bp-confirmation-item-icon"></i>
                  <div>
                    <span className="bp-confirmation-label">Total Amount</span>
                    <span className="bp-confirmation-value">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <div className="bp-confirmation-item">
                  <i className="fas fa-user bp-confirmation-item-icon"></i>
                  <div>
                    <span className="bp-confirmation-label">Lead Traveler</span>
                    <span className="bp-confirmation-value">{formData.fullName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bp-confirmation-actions">
              <button className="bp-cancel-button" onClick={() => setShowConfirmation(false)}>
                <i className="fas fa-times"></i> Edit Details
              </button>
              <button className="bp-confirm-button" onClick={handleConfirm}>
                <i className="fas fa-check"></i> Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingPage