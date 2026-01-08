"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import "../styles/PaymentStatusPage.css"
import AnimatedElement from "../components/AnimatedElement"
import Toast from "../components/Toast"
import ReceiptTemplate from "../components/ReceiptTemplate"
import { apiEndpoints } from "../config/api"

function PaymentStatus() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const orderId = searchParams.get("order_id")

  // Payment status state
  const [paymentStatus, setPaymentStatus] = useState({
    loading: true,
    success: false,
    error: false,
    message: "",
    orderDetails: null,
  })

  // Booking details state
  const [bookingDetails, setBookingDetails] = useState(null)
  const [packageDetails, setPackageDetails] = useState(null)

  // Receipt state
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptSent, setReceiptSent] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSendProgress, setEmailSendProgress] = useState(0) // Add progress state for loader
  const [serverStatus, setServerStatus] = useState(true) // Track server connection status
  const [isEmailSendingComplete, setIsEmailSendingComplete] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Preparing your receipt...") // Dynamic loading message

  // Toast notification
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("info")

  // Add this at the top of the component with other state variables
  const [bookingSaved, setBookingSaved] = useState(false)

  // Add this new state variable to prevent duplicate payment verification
  const [paymentVerified, setPaymentVerified] = useState(false)

  // Use a ref to track if the effect has run
  const effectRan = useRef(false)

  // Check if server is running
  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${apiEndpoints.createBookingRequest.replace("/api/booking-requests", "/api/ha")}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setServerStatus(true)
        return true
      } else {
        setServerStatus(false)
        return false
      }
    } catch (error) {
      console.error("[v0] Server connection error:", error)
      setServerStatus(false)
      return false
    }
  }

  // Function to format date and time separately
  const formatDateOnly = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTimeOnly = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" })

    // In development, React.StrictMode causes effects to run twice
    // This check ensures we only run our main logic once
    if (effectRan.current === true && process.env.NODE_ENV !== "production") {
      return
    }

    effectRan.current = true

    // Check server status first
    checkServerStatus().then((isServerRunning) => {
      if (!isServerRunning) {
        setToastMessage("Server connection error. Please make sure the server is running.")
        setToastType("error")
        setShowToast(true)
      }

      // Verify payment if order ID exists and hasn't been verified yet
      if (orderId && !paymentVerified) {
        verifyPayment()

        // Try to retrieve booking details from sessionStorage
        try {
          // Get the package ID from sessionStorage if available
          const storedPackageId = sessionStorage.getItem("currentPackageId")

          if (storedPackageId) {
            const storedBookingDetails = JSON.parse(sessionStorage.getItem(`bookingDetails_${storedPackageId}`))
            const storedPackageDetails = JSON.parse(sessionStorage.getItem(`packageDetails_${storedPackageId}`))

            if (storedBookingDetails) setBookingDetails(storedBookingDetails)
            if (storedPackageDetails) setPackageDetails(storedPackageDetails)
          } else {
            // Try to get booking details from URL state if available
            const urlParams = new URLSearchParams(window.location.search)
            const bookingDataParam = urlParams.get("bookingData")
            const packageDataParam = urlParams.get("packageData")

            if (bookingDataParam && packageDataParam) {
              try {
                setBookingDetails(JSON.parse(decodeURIComponent(bookingDataParam)))
                setPackageDetails(JSON.parse(decodeURIComponent(packageDataParam)))
              } catch (err) {
                console.error("Error parsing URL parameters", err)
              }
            }
          }
        } catch (err) {
          console.error("Error retrieving booking details from sessionStorage", err)
        }
      } else if (!orderId) {
        setPaymentStatus({
          loading: false,
          success: false,
          error: true,
          message: "No order ID found",
          orderDetails: null,
        })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]) // We're intentionally excluding paymentVerified and verifyPayment from dependencies

  // FIXED: Modified the saveBookingToDatabase function to use correct data structure
  const saveBookingToDatabase = async (orderData, bookingDetailsToSave, packageDetailsToSave) => {
    try {
      // Check if booking has already been saved in this session
      if (bookingSaved) {
        console.log("[v0] Booking already saved in this session, skipping duplicate save")
        return { success: true, alreadyExists: true }
      }

      // Check server status first
      const isServerRunning = await checkServerStatus()
      if (!isServerRunning) {
        throw new Error("Server connection error. Please make sure the server is running.")
      }

      // Use provided details or fall back to state
      const finalOrderData = orderData || (paymentStatus.orderDetails ? paymentStatus.orderDetails : null)
      const finalBookingDetails = bookingDetailsToSave || bookingDetails
      const finalPackageDetails = packageDetailsToSave || packageDetails

      if (!finalOrderData) {
        console.error("Cannot save booking: missing order details")
        return null
      }

      if (!finalBookingDetails || !finalPackageDetails) {
        console.error("Cannot save booking: missing booking or package details")
        return null
      }

      // Set the flag to indicate booking save attempt is in progress - BEFORE the API call
      // This prevents multiple simultaneous calls
      setBookingSaved(true)

      console.log("[v0] Saving booking to database:", {
        orderId: finalOrderData.order_id,
        customerName: finalBookingDetails.fullName,
        packageName: finalPackageDetails.name,
      })

      // Add a unique request ID to help track duplicate requests
      const requestId = Date.now().toString()

      // FIXED: Use the correct endpoint and data structure
      const response = await fetch(
        `${apiEndpoints.createBookingRequest.replace("/api/booking-requests", "/api/save-booking")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Request-ID": requestId,
          },
          body: JSON.stringify({
            orderData: {
              order_id: finalOrderData.order_id,
              order_amount: finalOrderData.order_amount,
              order_status: finalOrderData.order_status || "PAID",
              payment_time: finalOrderData.payment_time || new Date().toISOString(),
              booking_date: finalOrderData.booking_date || new Date().toISOString(),
            },
            bookingDetails: {
              fullName: finalBookingDetails.fullName,
              email: finalBookingDetails.email,
              phone: finalBookingDetails.phone,
              gender: finalBookingDetails.gender || "Not specified",
              age: finalBookingDetails.age || "Not specified",
              travelDate: finalBookingDetails.travelDate,
              travelers: finalBookingDetails.travelers,
              additionalTravelers: finalBookingDetails.additionalTravelers || [],
              specialRequests: finalBookingDetails.specialRequests || "",
            },
            packageDetails: {
              id: finalPackageDetails.id || finalPackageDetails._id,
              name: finalPackageDetails.name,
              location: finalPackageDetails.location,
              duration: finalPackageDetails.duration,
              price: finalPackageDetails.price,
            },
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        // If the save failed, reset the bookingSaved flag to allow retries
        if (response.status !== 409) {
          // 409 = Conflict, which means it was already saved
          setBookingSaved(false)
        }
        throw new Error(data.message || "Failed to save booking")
      }

      console.log("[v0] Booking saved successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Error saving booking:", error)
      setToastMessage(error.message || "Failed to save booking. Please try again later.")
      setToastType("error")
      setShowToast(true)
      return null
    }
  }

  // Update the verifyPayment function to ensure it only runs once
  const verifyPayment = async () => {
    // Check if payment has already been verified in this session
    if (paymentVerified) {
      console.log("[v0] Payment already verified in this session, skipping duplicate verification")
      return
    }

    // Set flag BEFORE making the request to prevent race conditions
    setPaymentVerified(true)

    let data
    try {
      // Check server status first
      const isServerRunning = await checkServerStatus()
      if (!isServerRunning) {
        throw new Error("Server connection error. Please make sure the server is running.")
      }

      const response = await fetch(
        `${apiEndpoints.createBookingRequest.replace("/api/booking-requests", "/api/verify-payment")}/${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify payment")
      }

      // Get current date and time for payment time if not available
      const currentDate = new Date()

      // Update payment status based on response with formatted date
      const updatedOrderDetails = {
        ...data.data,
        // Use the payment_time from API if available, otherwise use current date
        payment_time: data.data && data.data.payment_time ? data.data.payment_time : currentDate.toISOString(),
        // Add booking date (using current date as fallback)
        booking_date: data.data && data.data.booking_date ? data.data.booking_date : currentDate.toISOString(),
      }

      setPaymentStatus({
        loading: false,
        success: data.status === "PAID",
        error: data.status !== "PAID",
        message: data.message,
        orderDetails: updatedOrderDetails,
      })

      // If payment is successful, try to retrieve booking details one more time if not already set
      if (data.status === "PAID") {
        let localBookingDetails = bookingDetails
        let localPackageDetails = packageDetails

        if (!bookingDetails || !packageDetails) {
          const storedPackageId = sessionStorage.getItem("currentPackageId")
          console.log("Trying to retrieve booking details from sessionStorage with packageId:", storedPackageId)

          if (storedPackageId) {
            try {
              const storedBookingDetails = JSON.parse(sessionStorage.getItem(`bookingDetails_${storedPackageId}`))
              const storedPackageDetails = JSON.parse(sessionStorage.getItem(`packageDetails_${storedPackageId}`))

              console.log("Retrieved from sessionStorage:", {
                hasBookingDetails: !!storedBookingDetails,
                hasPackageDetails: !!storedPackageDetails,
              })

              if (storedBookingDetails) {
                localBookingDetails = storedBookingDetails
                setBookingDetails(storedBookingDetails)
              }
              if (storedPackageDetails) {
                localPackageDetails = storedPackageDetails
                setPackageDetails(storedPackageDetails)
              }
            } catch (err) {
              console.error("Error retrieving booking details from sessionStorage", err)
            }
          } else {
            // Try to get booking details from URL state if available
            const urlParams = new URLSearchParams(window.location.search)
            const bookingDataParam = urlParams.get("bookingData")
            const packageDataParam = urlParams.get("packageData")

            console.log("Trying to retrieve booking details from URL params:", {
              hasBookingParam: !!bookingDataParam,
              hasPackageParam: !!packageDataParam,
            })

            if (bookingDataParam && packageDataParam) {
              try {
                const parsedBookingDetails = JSON.parse(decodeURIComponent(bookingDataParam))
                const parsedPackageDetails = JSON.parse(decodeURIComponent(packageDataParam))

                localBookingDetails = parsedBookingDetails
                localPackageDetails = parsedPackageDetails

                setBookingDetails(parsedBookingDetails)
                setPackageDetails(parsedPackageDetails)
              } catch (err) {
                console.error("Error parsing URL parameters", err)
              }
            }
          }
        }

        // After retrieving booking details, process only if we have all required data
        if (localBookingDetails && localPackageDetails && updatedOrderDetails) {
          // Use a single timeout to prevent multiple calls
          setTimeout(async () => {
            console.log("Processing successful payment with:", {
              hasBookingDetails: !!localBookingDetails,
              hasPackageDetails: !!localPackageDetails,
              hasOrderDetails: !!updatedOrderDetails,
            })

            try {
              // Save booking to database first with the updated order details
              // Use await to ensure we wait for the result before proceeding
              const saveResult = await saveBookingToDatabase(
                updatedOrderDetails,
                localBookingDetails,
                localPackageDetails,
              )

              // Only proceed with email sending if booking was saved or already exists
              if (saveResult && saveResult.success) {
                // Show loader for email sending
                setIsSendingEmail(true)
                setEmailSendProgress(0) // Start progress at 0%
                setIsEmailSendingComplete(false) // Reset email sending state
                setLoadingMessage("Preparing your receipt...") // Initial message

                // Create an array of loading messages to cycle through
                const loadingMessages = [
                  "Preparing your receipt...",
                  "Generating PDF document...",
                  "Adding booking details...",
                  "Formatting your receipt...",
                  "Sending to your email...",
                  "Almost done...",
                ]

                // Start progress animation with message changes
                let messageIndex = 0
                const progressInterval = setInterval(() => {
                  setEmailSendProgress((prev) => {
                    // Increase progress gradually up to 85% (reserve the rest for completion)
                    if (prev < 85) {
                      // Change message every ~20% progress
                      if (prev % 20 === 0 && messageIndex < loadingMessages.length - 1) {
                        messageIndex++
                        setLoadingMessage(loadingMessages[messageIndex])
                      }
                      return prev + 2
                    }
                    return prev
                  })
                }, 120) // Update more frequently for smoother animation

                try {
                  // Send the email
                  await sendReceiptEmail(updatedOrderDetails, localBookingDetails, localPackageDetails)

                  // Clear the interval when done
                  clearInterval(progressInterval)

                  // Set final message
                  setLoadingMessage("Receipt sent successfully!")

                  // Complete the progress
                  setEmailSendProgress(100)

                  // Set email sending complete after a delay to ensure the progress bar completes visually
                  setTimeout(() => {
                    setIsEmailSendingComplete(true)

                    // Show toast only after email is sent
                    setToastMessage("Receipt has been sent to your email")
                    setToastType("success")
                    setShowToast(true)
                  }, 500)
                } catch (emailError) {
                  clearInterval(progressInterval)
                  console.error("Error sending receipt email:", emailError)
                  setIsEmailSendingComplete(true)
                  setToastMessage("Could not send receipt email. Please try again later.")
                  setToastType("error")
                  setShowToast(true)
                }
              } else {
                console.error("Cannot proceed with email: booking save failed")
                setToastMessage("Could not save booking details. Please try again later.")
                setToastType("error")
                setShowToast(true)
              }
            } catch (error) {
              console.error("Error in payment processing:", error)
              setToastMessage("Error processing payment. Please try again later.")
              setToastType("error")
              setShowToast(true)
            }
          }, 1000) // Reduced timeout to 1 second for faster response
        } else if (data.status === "PAID") {
          console.error("Cannot process payment: missing required details")
          setToastMessage("Could not process payment: missing required details")
          setToastType("error")
          setShowToast(true)
        }
      }

      // Only show toast for errors, not for successful verification
      if (data.status !== "PAID") {
        setToastMessage(data.message)
        setToastType("error")
        setShowToast(true)
      }
    } catch (error) {
      // If verification fails, reset the flag to allow retries
      setPaymentVerified(false)

      console.error("Error verifying payment:", error)

      // Get current date and time as fallback
      const currentDate = new Date()
      const currentDateISOString = currentDate.toISOString()

      setPaymentStatus({
        loading: false,
        success: false,
        error: true,
        message: "Failed to verify payment. Please try again later.",
        orderDetails: {
          order_id: orderId || "Unknown",
          order_amount: 0,
          order_status: "FAILED",
          payment_time: currentDateISOString,
          booking_date: currentDateISOString,
        },
      })

      setToastMessage(error.message || "Failed to verify payment. Please try again later.")
      setToastType("error")
      setShowToast(true)
    }
  }

  // Function to send receipt email
  const sendReceiptEmail = async (orderData, bookingDetailsToUse = null, packageDetailsToUse = null) => {
    try {
      // Record the start time to ensure minimum 5 seconds display
      const startTime = Date.now()

      // Check server status first
      const isServerRunning = await checkServerStatus()
      if (!isServerRunning) {
        throw new Error("Server connection error. Please make sure the server is running.")
      }

      // Use provided details or fall back to state
      const finalBookingDetails = bookingDetailsToUse || bookingDetails
      const finalPackageDetails = packageDetailsToUse || packageDetails

      if (!finalBookingDetails || !finalPackageDetails) {
        console.error("Missing booking or package details for receipt email")
        return
      }

      console.log("[v0] Sending receipt email with details:", {
        hasOrderData: !!orderData,
        hasBookingDetails: !!finalBookingDetails,
        hasPackageDetails: !!finalPackageDetails,
      })

      setIsSendingEmail(true)
      setEmailSendProgress(50) // Update progress to 50%

      const response = await fetch(
        `${apiEndpoints.createBookingRequest.replace("/api/booking-requests", "/api/send-receipt")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderData,
            bookingDetails: finalBookingDetails,
            packageDetails: finalPackageDetails,
          }),
        },
      )

      const data = await response.json()

      // Calculate how much time has passed
      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, 5000 - elapsedTime)

      // If less than 5 seconds have passed, wait for the remaining time
      if (remainingTime > 0) {
        // Update progress to 85% while waiting
        setEmailSendProgress(85)
        setLoadingMessage("Finalizing your receipt...")
        await new Promise((resolve) => setTimeout(resolve, remainingTime))
      }

      if (data.success) {
        setReceiptSent(true)
        setIsSendingEmail(false)
        setEmailSendProgress(100) // Complete progress
        setLoadingMessage("Receipt sent successfully!")

        // We'll show the toast notification in the calling function
        // to ensure we only show it once after the email is sent
      } else {
        console.error("[v0] Failed to send receipt email:", data.message)
        setIsSendingEmail(false)
        setEmailSendProgress(0) // Reset progress

        // Show error toast
        setShowToast(false)
        setTimeout(() => {
          setToastMessage("Failed to send receipt email. Please try again.")
          setToastType("error")
          setShowToast(true)
        }, 300)
      }

      return data
    } catch (error) {
      console.error("[v0] Error sending receipt email:", error)
      setIsSendingEmail(false)
      setEmailSendProgress(0) // Reset progress

      // Show error toast
      setShowToast(false)
      setTimeout(() => {
        setToastMessage(error.message || "Error sending receipt email. Please try again.")
        setToastType("error")
        setShowToast(true)
      }, 300)

      throw error
    }
  }

  // Function to download receipt
  const downloadReceipt = async () => {
    try {
      // Check server status first
      const isServerRunning = await checkServerStatus()
      if (!isServerRunning) {
        throw new Error("Server connection error. Please make sure the server is running.")
      }

      if (!paymentStatus.orderDetails) {
        setToastMessage("Cannot generate receipt: missing order details")
        setToastType("error")
        setShowToast(true)
        return
      }

      if (!bookingDetails || !packageDetails) {
        // Try to retrieve booking details one more time
        const storedPackageId = sessionStorage.getItem("currentPackageId")
        let retrievedBookingDetails = bookingDetails
        let retrievedPackageDetails = packageDetails

        if (storedPackageId) {
          try {
            const storedBookingDetails = JSON.parse(sessionStorage.getItem(`bookingDetails_${storedPackageId}`))
            const storedPackageDetails = JSON.parse(sessionStorage.getItem(`packageDetails_${storedPackageId}`))

            if (storedBookingDetails) retrievedBookingDetails = storedBookingDetails
            if (storedPackageDetails) retrievedPackageDetails = storedPackageDetails
          } catch (err) {
            console.error("[v0] Error retrieving booking details", err)
          }
        }

        if (!retrievedBookingDetails || !retrievedPackageDetails) {
          setToastMessage("Cannot generate receipt: missing booking details")
          setToastType("error")
          setShowToast(true)
          return
        }

        // Update state with retrieved details
        if (!bookingDetails) setBookingDetails(retrievedBookingDetails)
        if (!packageDetails) setPackageDetails(retrievedPackageDetails)
      }

      // Show loading state
      setIsDownloading(true)
      setToastMessage("Generating receipt PDF...")
      setToastType("info")
      setShowToast(true)

      // Direct approach - fetch the PDF as a blob
      const response = await fetch(
        `${apiEndpoints.createBookingRequest.replace("/api/booking-requests", "/api/generate-receipt")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderData: paymentStatus.orderDetails,
            bookingDetails: bookingDetails,
            packageDetails: packageDetails,
          }),
          // Add timeout to prevent hanging requests
          signal: AbortSignal.timeout(30000), // 30 second timeout
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to generate receipt: ${response.statusText}`)
      }

      // Get the blob from the response
      const blob = await response.blob()

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob)

      // Create a temporary link element
      const link = document.createElement("a")
      link.href = url
      link.download = `TripEasy_Receipt_${paymentStatus.orderDetails.order_id}.pdf`

      // Append to the document, click it, and remove it
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the URL
      window.URL.revokeObjectURL(url)

      // Reset downloading state
      setIsDownloading(false)

      // Show success toast
      setShowToast(false)
      setTimeout(() => {
        setToastMessage("Receipt downloaded successfully")
        setToastType("success")
        setShowToast(true)
      }, 300)
    } catch (error) {
      console.error("[v0] Error downloading receipt:", error)
      setIsDownloading(false)

      setShowToast(false)
      setTimeout(() => {
        setToastMessage(error.message || "Failed to download receipt. Please try again.")
        setToastType("error")
        setShowToast(true)
      }, 300)
    }
  }

  // Function to toggle receipt view
  const toggleReceiptView = () => {
    setShowReceipt(!showReceipt)
  }

  if (paymentStatus.loading) {
    return (
      <div className="ps-payment-status-container">
        <div className="ps-loading-container">
          <div className="ps-loading-spinner"></div>
          <p>Verifying payment status...</p>
        </div>
      </div>
    )
  }

  // Show email sending loader if payment is successful and email is being sent
  if (paymentStatus.success && isSendingEmail && !isEmailSendingComplete) {
    return (
      <div className="ps-payment-status-container" style={{ backgroundColor: "white" }}>
        <div className="ps-email-sending-fullscreen">
          <div className="ps-email-animation-container">
            <div className="ps-email-icon">
              <div className="ps-envelope">
                <div className="ps-envelope-top"></div>
                <div className="ps-envelope-body"></div>
                <div className="ps-envelope-paper"></div>
              </div>
              <div className="ps-email-waves">
                <div className="ps-wave ps-wave1"></div>
                <div className="ps-wave ps-wave2"></div>
                <div className="ps-wave ps-wave3"></div>
              </div>
            </div>
          </div>

          <div className="ps-email-progress-container">
            <div className="ps-email-progress-bar" style={{ width: `${emailSendProgress}%` }}></div>
            <div className="ps-email-progress-percentage">{emailSendProgress}%</div>
          </div>

          <div className="ps-email-message">
            <p>{loadingMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ps-payment-status-container">
      <div className="container">
        <AnimatedElement animation="fade-up">
          <div className={`ps-status-card ${paymentStatus.success ? "ps-success" : "ps-error"}`}>
            <div className="ps-status-icon">
              {paymentStatus.success ? (
                <i className="fas fa-check-circle ps-animated-success"></i>
              ) : (
                <i className="fas fa-times-circle"></i>
              )}
            </div>

            <h2 className="ps-status-title">{paymentStatus.success ? "Payment Successful!" : "Payment Failed"}</h2>

            <p className="ps-status-message">{paymentStatus.message}</p>

            {!serverStatus && (
              <div className="ps-server-error">
                <i className="fas fa-exclamation-triangle"></i>
                <p>Server connection error. Please make sure the server is running.</p>
              </div>
            )}

            {paymentStatus.success && (
              <div className="ps-ticket-info">
                <i className="fas fa-ticket-alt"></i>
                <p>Your original booking package tickets will be provided within a few hours.</p>
              </div>
            )}

            {paymentStatus.orderDetails && (
              <div className="ps-order-details">
                <h3>
                  <i className="fas fa-receipt ps-details-icon"></i> Order Details
                </h3>
                <div className="ps-details-grid">
                  <div className="ps-detail-item">
                    <span className="ps-detail-label">
                      <i className="fas fa-hashtag"></i> Order ID:
                    </span>
                    <span className="ps-detail-value">{paymentStatus.orderDetails.order_id}</span>
                  </div>
                  <div className="ps-detail-item">
                    <span className="ps-detail-label">
                      <i className="fas fa-rupee-sign"></i> Amount:
                    </span>
                    <span className="ps-detail-value">
                      ₹{paymentStatus.orderDetails.order_amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="ps-detail-item">
                    <span className="ps-detail-label">
                      <i className="fas fa-info-circle"></i> Status:
                    </span>
                    <span className="ps-detail-value ps-status-badge">{paymentStatus.orderDetails.order_status}</span>
                  </div>
                  <div className="ps-detail-item">
                    <span className="ps-detail-label">
                      <i className="fas fa-calendar-check"></i> Booking Date:
                    </span>
                    <span className="ps-detail-value">{formatDateOnly(paymentStatus.orderDetails.booking_date)}</span>
                  </div>
                  <div className="ps-detail-item">
                    <span className="ps-detail-label">
                      <i className="fas fa-clock"></i> Payment Time:
                    </span>
                    <span className="ps-detail-value">{formatTimeOnly(paymentStatus.orderDetails.payment_time)}</span>
                  </div>
                </div>
              </div>
            )}

            {paymentStatus.success && receiptSent && (
              <div className="ps-receipt-info">
                <p>
                  <i className="fas fa-envelope-open-text"></i> A receipt has been sent to your email address.
                </p>
              </div>
            )}

            <div className="ps-action-buttons">
              <Link to="/" className="ps-home-button">
                <i className="fas fa-home"></i> Return to Home
              </Link>
              {paymentStatus.success && (
                <>
                  <button
                    className="ps-download-button"
                    onClick={downloadReceipt}
                    disabled={isDownloading || !serverStatus}
                  >
                    <i className="fas fa-download"></i>
                    {isDownloading ? "Downloading..." : "Download Receipt"}
                  </button>
                  <button
                    className="ps-view-button"
                    onClick={toggleReceiptView}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "50px",
                      fontSize: "16px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      backgroundColor: "rgb(108,117,125)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    <i className="fas fa-eye" style={{ marginRight: "8px" }}></i> View Receipt
                  </button>
                </>
              )}
              {!paymentStatus.success && (
                <button className="ps-retry-button" onClick={() => navigate(-1)}>
                  <i className="fas fa-redo"></i> Try Again
                </button>
              )}
            </div>
          </div>
        </AnimatedElement>

        {/* Receipt Modal */}
        {showReceipt && paymentStatus.orderDetails && bookingDetails && packageDetails && (
          <div className="ps-receipt-modal">
            <div className="ps-receipt-modal-content">
              <div className="ps-receipt-modal-header">
                <h3>Booking Receipt</h3>
                <button className="ps-modal-close" onClick={toggleReceiptView}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="ps-receipt-modal-body">
                <ReceiptTemplate
                  orderData={paymentStatus.orderDetails}
                  bookingDetails={bookingDetails}
                  packageDetails={packageDetails}
                />
              </div>
              <div className="ps-receipt-modal-footer">
                <button
                  className="ps-download-button"
                  onClick={downloadReceipt}
                  disabled={isDownloading || !serverStatus}
                >
                  <i className="fas fa-download"></i>
                  {isDownloading ? "Downloading..." : "Download PDF"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast notification */}
      {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
    </div>
  )
}

export default PaymentStatus