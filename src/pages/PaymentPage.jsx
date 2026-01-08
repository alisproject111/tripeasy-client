"use client"

import { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate, Link } from "react-router-dom"
import "../styles/PaymentPage.css"
import AnimatedElement from "../components/AnimatedElement"
import Toast from "../components/Toast"
import { apiEndpoints } from "../config/api"

function PaymentPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  // Get booking details from location state
  const { bookingDetails, packageDetails, totalPrice } = location.state || {}

  // Payment status
  const [paymentStatus, setPaymentStatus] = useState({
    processing: false,
    success: false,
    error: false,
    message: "",
  })

  // Toast notification
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("info")

  // Booking reference
  const [bookingReference, setBookingReference] = useState("")

  // Payment session data
  const [paymentSessionData, setPaymentSessionData] = useState(null)

  // Add state for customer details modal
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)

  // Add state to track if we're redirecting to payment gateway
  const [redirectingToGateway, setRedirectingToGateway] = useState(false)

  // Add toggleCustomerDetails function
  const toggleCustomerDetails = () => {
    setShowCustomerDetails(!showCustomerDetails)
  }

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" })

    // Redirect if no booking details
    if (!bookingDetails || !packageDetails) {
      navigate(`/package/${id}`)
      return
    }

    // Check if we're coming back from payment gateway (detect browser back button)
    const isReturningFromGateway = redirectingToGateway

    // If we're returning from payment gateway, reset the payment status
    if (isReturningFromGateway) {
      console.log("Detected return from payment gateway, resetting payment status")
      setRedirectingToGateway(false)
      setPaymentStatus({
        processing: false,
        success: false,
        error: false,
        message: "",
      })
      document.body.classList.remove("pp-body-blur")
    }

    // Check for payment success in URL parameters (for return from Cashfree)
    const urlParams = new URLSearchParams(window.location.search)
    const orderId = urlParams.get("order_id")

    if (orderId) {
      verifyPaymentFromRedirect(orderId)
    }

    return () => {
      // Make sure to remove the blur class when component unmounts
      document.body.classList.remove("pp-body-blur")
    }
  }, [bookingDetails, packageDetails, id, navigate, redirectingToGateway])

  // Add event listener for popstate (back button)
  useEffect(() => {
    const handlePopState = () => {
      // Reset payment status when user navigates back
      setPaymentStatus({
        processing: false,
        success: false,
        error: false,
        message: "",
      })
      document.body.classList.remove("pp-body-blur")
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  // Update the createCashfreeOrder function to show a better loader
  const createCashfreeOrder = async () => {
    setPaymentStatus({
      processing: true,
      success: false,
      error: false,
      message: "Creating payment order...",
    })

    try {
      // Generate a booking reference
      const bookingRef = `TP${id}B${Math.floor(Math.random() * 10000)}`
      setBookingReference(bookingRef)

      // Create order on your server
      const response = await fetch(
        `${apiEndpoints.createBookingRequest.replace("/api/booking-requests", "/api/create-order")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totalPrice,
            currency: "INR",
            customerDetails: {
              customer_id: `cust_${Date.now()}`,
              customer_name: bookingDetails.fullName,
              customer_email: bookingDetails.email,
              customer_phone: bookingDetails.phone,
            },
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        console.error("[v0] Server error details:", data)
        document.body.classList.remove("pp-body-blur")
        throw new Error(data.message || "Failed to create order")
      }

      setPaymentSessionData(data)
      return data
    } catch (error) {
      console.error("[v0] Error creating order:", error)
      document.body.classList.remove("pp-body-blur")
      setPaymentStatus({
        processing: false,
        success: false,
        error: true,
        message: "Failed to create payment order. Please try again.",
      })

      setToastMessage("Failed to create payment order. Please try again.")
      setToastType("error")
      setShowToast(true)

      return null
    }
  }

  // Function to verify payment after redirect
  const verifyPaymentFromRedirect = async (orderId) => {
    document.body.classList.add("pp-body-blur")
    setPaymentStatus({
      processing: true,
      success: false,
      error: false,
      message: "Verifying payment...",
    })

    try {
      const response = await fetch(
        `${apiEndpoints.createBookingRequest.replace("/api/booking-requests", "/api/verify-payment")}/${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-version": "2023-08-01",
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        console.error("[v0] Payment verification error:", data)
        document.body.classList.remove("pp-body-blur")
        throw new Error("Payment verification failed")
      }

      // Check payment status
      if (data.status === "PAID") {
        // Generate a booking reference if not already set
        if (!bookingReference) {
          const bookingRef = `TP${id}B${Math.floor(Math.random() * 10000)}`
          setBookingReference(bookingRef)
        }

        // Store booking and package details in sessionStorage for receipt email
        if (bookingDetails && packageDetails) {
          console.log("[v0] Storing booking details in sessionStorage before redirect")
          sessionStorage.setItem("currentPackageId", id)
          sessionStorage.setItem(`bookingDetails_${id}`, JSON.stringify(bookingDetails))
          sessionStorage.setItem(`packageDetails_${id}`, JSON.stringify(packageDetails))
          sessionStorage.setItem(`totalPrice_${id}`, JSON.stringify(totalPrice))
        }

        // Payment verified successfully
        document.body.classList.remove("pp-body-blur")
        setPaymentStatus({
          processing: false,
          success: true,
          error: false,
          message: "Payment successful! Your booking is confirmed.",
        })

        setToastMessage("Payment successful! Your booking is confirmed.")
        setToastType("success")
        setShowToast(true)

        // Add URL parameters with booking and package details
        const bookingDataParam = encodeURIComponent(JSON.stringify(bookingDetails))
        const packageDataParam = encodeURIComponent(JSON.stringify(packageDetails))

        // Redirect to payment status page after a short delay
        setTimeout(() => {
          navigate(
            `/payment-status?order_id=${orderId}&bookingData=${bookingDataParam}&packageData=${packageDataParam}`,
          )
        }, 1500)
      } else {
        // Payment not successful
        document.body.classList.remove("pp-body-blur")
        setPaymentStatus({
          processing: false,
          success: false,
          error: true,
          message: `Payment not successful. Status: ${data.status}`,
        })

        setToastMessage(`Payment not successful. Status: ${data.status}`)
        setToastType("error")
        setShowToast(true)
      }
    } catch (error) {
      console.error("[v0] Error verifying payment:", error)
      document.body.classList.remove("pp-body-blur")
      setPaymentStatus({
        processing: false,
        success: false,
        error: true,
        message: "Payment verification failed. Please contact support.",
      })

      setToastMessage("Payment verification failed. Please contact support.")
      setToastType("error")
      setShowToast(true)
    }
  }

  // Function to handle payment initiation
  const handlePayment = async () => {
    // Show the loader immediately when Pay Now is clicked
    document.body.classList.add("pp-body-blur")
    setPaymentStatus({
      processing: true,
      success: false,
      error: false,
      message: "Preparing your payment...",
    })

    // Store the current package ID in sessionStorage
    sessionStorage.setItem("currentPackageId", id)

    // Store booking and package details in sessionStorage as backup
    sessionStorage.setItem(`bookingDetails_${id}`, JSON.stringify(bookingDetails))
    sessionStorage.setItem(`packageDetails_${id}`, JSON.stringify(packageDetails))
    sessionStorage.setItem(`totalPrice_${id}`, JSON.stringify(totalPrice))

    // Create Cashfree order
    const orderData = await createCashfreeOrder()

    if (!orderData) {
      document.body.classList.remove("pp-body-blur")
      return
    }

    // Set redirecting flag before redirecting to payment gateway
    setRedirectingToGateway(true)

    // Initialize Cashfree checkout using the correct method
    // The SDK exposes Cashfree as a global variable with different methods
    if (window.Cashfree) {
      const cf = new window.Cashfree(orderData.payment_session_id)

      // Add booking and package data to the return URL
      const bookingDataParam = encodeURIComponent(JSON.stringify(bookingDetails))
      const packageDataParam = encodeURIComponent(JSON.stringify(packageDetails))

      // Set callback functions
      cf.redirect({
        params: {
          bookingData: bookingDataParam,
          packageData: packageDataParam,
        },
      })
    } else {
      console.error("Cashfree SDK not loaded")
      document.body.classList.remove("pp-body-blur")
      setPaymentStatus({
        processing: false,
        success: false,
        error: true,
        message: "Payment gateway not available. Please try again later.",
      })

      setToastMessage("Payment gateway not available. Please try again later.")
      setToastType("error")
      setShowToast(true)

      // Reset redirecting flag if there's an error
      setRedirectingToGateway(false)
    }
  }

  if (!bookingDetails || !packageDetails) {
    return (
      <div className="pp-loading-container">
        <div className="pp-loading-spinner"></div>
        <p>Loading payment page...</p>
      </div>
    )
  }

  return (
    <div className="pp-payment-page">
      {/* Updated header with inline background image */}
      <div 
        className="pp-payment-header"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/assets/hero/payment-header.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '60px 0',
          textAlign: 'center'
        }}
      >
        <div className="container">
          <AnimatedElement animation="fade-up">
            <h1 className="pp-page-title">Payment</h1>
            <p className="pp-page-subtitle">Complete your booking for {packageDetails.name}</p>
          </AnimatedElement>
        </div>
      </div>

      <div className="container">
        {paymentStatus.success ? (
          <div className="pp-payment-success">
            <div className="pp-success-icon pp-animated-success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Booking Confirmed!</h2>
            <p>Your payment of ₹{totalPrice.toLocaleString("en-IN")} has been processed successfully.</p>
            <p>A confirmation email has been sent to {bookingDetails.email}.</p>
            <p>
              Your booking reference: <strong>{bookingReference}</strong>
            </p>
            <div className="pp-success-actions">
              <Link to="/" className="pp-home-button">
                <i className="fas fa-home"></i> Return to Home
              </Link>
              <Link to="/packages" className="pp-browse-button">
                <i className="fas fa-search"></i> Browse More Packages
              </Link>
            </div>
          </div>
        ) : (
          <div className="pp-payment-container">
            <AnimatedElement animation="fade-up" delay={100}>
              <div className="pp-order-summary">
                <div className="pp-order-summary-header">
                  <i className="fas fa-receipt pp-summary-icon"></i>
                  <h2 className="pp-summary-title">Order Summary</h2>
                </div>
                <div className="pp-summary-details">
                  <div className="pp-summary-item">
                    <div className="pp-summary-item-icon-wrapper">
                      <i className="fas fa-map-marked-alt pp-summary-item-icon"></i>
                      <span className="pp-summary-label">Package:</span>
                    </div>
                    <span className="pp-summary-value">{packageDetails.name}</span>
                  </div>
                  <div className="pp-summary-item">
                    <div className="pp-summary-item-icon-wrapper">
                      <i className="fas fa-map-marker-alt pp-summary-item-icon"></i>
                      <span className="pp-summary-label">Destination:</span>
                    </div>
                    <span className="pp-summary-value">{packageDetails.location}</span>
                  </div>
                  <div className="pp-summary-item">
                    <div className="pp-summary-item-icon-wrapper">
                      <i className="fas fa-calendar-alt pp-summary-item-icon"></i>
                      <span className="pp-summary-label">Duration:</span>
                    </div>
                    <span className="pp-summary-value">{packageDetails.duration} Days</span>
                  </div>
                  <div className="pp-summary-item">
                    <div className="pp-summary-item-icon-wrapper">
                      <i className="fas fa-calendar-day pp-summary-item-icon"></i>
                      <span className="pp-summary-label">Travel Date:</span>
                    </div>
                    <span className="pp-summary-value">{bookingDetails.travelDate}</span>
                  </div>
                  <div className="pp-summary-item">
                    <div className="pp-summary-item-icon-wrapper">
                      <i className="fas fa-users pp-summary-item-icon"></i>
                      <span className="pp-summary-label">Travelers:</span>
                    </div>
                    <span className="pp-summary-value">{bookingDetails.travelers}</span>
                  </div>
                  <div className="pp-summary-item">
                    <div className="pp-summary-item-icon-wrapper">
                      <i className="fas fa-tag pp-summary-item-icon"></i>
                      <span className="pp-summary-label">Price per person:</span>
                    </div>
                    <span className="pp-summary-value">₹{packageDetails.price.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="pp-summary-item pp-total">
                    <div className="pp-summary-item-icon-wrapper">
                      <i className="fas fa-money-bill-wave pp-summary-item-icon"></i>
                      <span className="pp-summary-label">Total Amount:</span>
                    </div>
                    <span className="pp-summary-value">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="pp-customer-details">
                  <h3>
                    <i className="fas fa-user-circle pp-customer-icon"></i> Customer Details
                  </h3>
                  <div className="pp-customer-info">
                    <div className="pp-customer-info-item">
                      <i className="fas fa-user"></i>
                      <span>{bookingDetails.fullName}</span>
                    </div>
                    <div className="pp-customer-info-item">
                      <i className="fas fa-envelope"></i>
                      <span>{bookingDetails.email}</span>
                    </div>
                    <div className="pp-customer-info-item">
                      <i className="fas fa-phone"></i>
                      <span>{bookingDetails.phone}</span>
                    </div>
                    <button className="pp-view-details-button" onClick={toggleCustomerDetails}>
                      <i className="fas fa-users"></i> View All Travelers
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={200}>
              <div className="pp-payment-form-container">
                <h2 className="pp-form-title">
                  <i className="fas fa-credit-card pp-form-icon"></i> Payment Method
                </h2>

                <div className="pp-cashfree-info">
                  <div className="pp-cashfree-logo">
                    <img src="/assets/logos/cashfree-logo.png" alt="Cashfree" className="pp-cashfree-logo-img" /> {/* Updated path */}
                    <span>Cashfree Payments</span>
                  </div>
                  <p>
                    Secure payments powered by Cashfree. You'll be redirected to Cashfree's secure payment page to
                    complete your transaction.
                  </p>
                  <div className="pp-payment-methods-supported">
                    <p>Supported payment methods:</p>
                    <div className="pp-payment-icons">
                      <div className="pp-payment-icon">
                        <i className="fas fa-credit-card" title="Credit/Debit Cards"></i>
                        <span>Cards</span>
                      </div>
                      <div className="pp-payment-icon">
                        <i className="fas fa-mobile-alt" title="UPI"></i>
                        <span>UPI</span>
                      </div>
                      <div className="pp-payment-icon">
                        <i className="fas fa-university" title="Net Banking"></i>
                        <span>Net Banking</span>
                      </div>
                      <div className="pp-payment-icon">
                        <i className="fas fa-wallet" title="Wallets"></i>
                        <span>Wallets</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pp-secure-payment-info">
                  <i className="fas fa-shield-alt"></i>
                  <div>
                    <h4>Secure Payment</h4>
                    <p>Your payment information is secure. We use industry-standard encryption to protect your data.</p>
                  </div>
                </div>

                <div className="pp-form-actions">
                  <Link to={`/booking/${id}`} className="pp-back-link">
                    <i className="fas fa-arrow-left"></i> Back to Booking
                  </Link>
                  <button
                    type="button"
                    className="pp-pay-button"
                    onClick={handlePayment}
                    disabled={paymentStatus.processing}
                  >
                    {paymentStatus.processing ? "Processing..." : `Pay ₹${totalPrice.toLocaleString("en-IN")}`}
                    {!paymentStatus.processing && <i className="fas fa-lock"></i>}
                  </button>
                </div>
              </div>
            </AnimatedElement>
          </div>
        )}
      </div>

      {/* Toast notification */}
      {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}

      {/* Centered loader overlay */}
      {paymentStatus.processing && (
        <div className="pp-centered-loader-overlay">
          <div className="pp-centered-loader-container">
            <div className="pp-centered-loader-spinner">
              <div className="pp-spinner-inner"></div>
            </div>
            <p>{paymentStatus.message}</p>
          </div>
        </div>
      )}

      {showCustomerDetails && (
        <div className="pp-customer-details-modal">
          <div className="pp-modal-content">
            <div
              className="pp-modal-header"
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "white",
                zIndex: 10,
              }}
            >
              <h3>
                <i className="fas fa-users"></i> All Travelers
              </h3>
              <button className="pp-modal-close" onClick={toggleCustomerDetails}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="pp-modal-body">
              <div className="pp-traveler-cards">
                {/* Primary Traveler Card - Show all details except travel date */}
                <div className="pp-traveler-card pp-primary-traveler">
                  <div className="pp-traveler-card-header">
                    <i className="fas fa-user-circle"></i>
                    <h4>Primary Traveler</h4>
                  </div>
                  <div className="pp-traveler-card-body">
                    <div className="pp-traveler-detail">
                      <i className="fas fa-user"></i>
                      <span>{bookingDetails.fullName}</span>
                    </div>
                    <div className="pp-traveler-detail">
                      <i className="fas fa-envelope"></i>
                      <span>{bookingDetails.email}</span>
                    </div>
                    <div className="pp-traveler-detail">
                      <i className="fas fa-phone"></i>
                      <span>{bookingDetails.phone}</span>
                    </div>
                    <div className="pp-traveler-detail">
                      <i className="fas fa-venus-mars"></i>
                      <span>{bookingDetails.gender}</span>
                    </div>
                    <div className="pp-traveler-detail">
                      <i className="fas fa-birthday-cake"></i>
                      <span>{bookingDetails.age} years</span>
                    </div>
                  </div>
                </div>

                {/* Additional Travelers Cards - Show only name, gender and age */}
                {bookingDetails.additionalTravelers &&
                  bookingDetails.additionalTravelers.map((traveler, index) => (
                    <div key={index} className="pp-traveler-card">
                      <div className="pp-traveler-card-header">
                        <i className="fas fa-user"></i>
                        <h4>Traveler {index + 2}</h4>
                      </div>
                      <div className="pp-traveler-card-body">
                        <div className="pp-traveler-detail">
                          <i className="fas fa-user"></i>
                          <span>{traveler.fullName}</span>
                        </div>
                        <div className="pp-traveler-detail">
                          <i className="fas fa-venus-mars"></i>
                          <span>{traveler.gender}</span>
                        </div>
                        <div className="pp-traveler-detail">
                          <i className="fas fa-birthday-cake"></i>
                          <span>{traveler.age} years</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentPage