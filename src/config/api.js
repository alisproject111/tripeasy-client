// This allows the client to dynamically connect to the correct API URL based on environment

// Use REACT_APP prefix for Create React App environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

export const getApiUrl = () => API_BASE_URL

export const apiEndpoints = {
  // Public endpoints
  getAllPackages: `${API_BASE_URL}/api/packages`,
  getPackageById: (id) => `${API_BASE_URL}/api/packages/${id}`,
  createBooking: `${API_BASE_URL}/api/bookings`,
  createBookingRequest: `${API_BASE_URL}/api/booking-requests`,
  createCustomPackageRequest: `${API_BASE_URL}/api/submit-custom-package`,
  getDestinations: `${API_BASE_URL}/api/destinations`,

  // Payment endpoints
  createOrder: `${API_BASE_URL}/api/create-order`,
  verifyPayment: (orderId) => `${API_BASE_URL}/api/verify-payment/${orderId}`,

  // Receipt and booking management endpoints
  saveBooking: `${API_BASE_URL}/api/save-booking`,
  sendReceipt: `${API_BASE_URL}/api/send-receipt`,
  generateReceipt: `${API_BASE_URL}/api/generate-receipt`,
  healthCheck: `${API_BASE_URL}/api/ha`,

  // Admin endpoints
  getAllBookings: `${API_BASE_URL}/api/admin/bookings`,
  getBookingById: (id) => `${API_BASE_URL}/api/bookings/${id}`,
  adminPackages: `${API_BASE_URL}/api/admin/packages`,
  adminPackageById: (id) => `${API_BASE_URL}/api/admin/packages/${id}`,
}

export default API_BASE_URL
