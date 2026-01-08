import "../styles/ReceiptTemplate.css";

const ReceiptTemplate = ({ orderData, bookingDetails, packageDetails }) => {
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Ensure we have valid data by providing defaults
  const order = orderData || {
    order_id: "Unknown",
    order_amount: 0,
    order_status: "UNKNOWN",
  };

  const booking = bookingDetails || {
    fullName: "Customer",
    email: "customer@example.com",
    phone: "N/A",
    travelDate: formattedDate,
    travelers: 1,
  };

  const packageInfo = packageDetails || {
    name: "Travel Package",
    location: "Destination",
    duration: "N/A",
    price: order.order_amount || 0,
  };

  return (
    <div className="rt-receipt">
      <div className="rt-header">
        <div className="rt-logo-container">
          <div className="rt-logo">TripEasy</div>
          <div className="rt-logo-tagline">Explore. Experience. Enjoy.</div>
        </div>
        <div className="rt-company-info">
          <p>TripEasy Travel Services </p>
          <p>Shop No 16, 2nd Floor,</p>
          <p>VED TransCube opposite the Main Railway Station, Vadodara,</p>
          <p>GST: 07AABCT1234Z1ZL</p>
        </div>
        <div className="rt-receipt-title-container">
          <h1 className="rt-receipt-title">Booking Receipt</h1>
          <div className="rt-receipt-id">Receipt #{order.order_id}</div>
          <div className="rt-receipt-date">Date: {formattedDate}</div>
        </div>
      </div>

      <div className="rt-details">
        <div className="rt-section">
          <div className="rt-section-title">
            <i className="fas fa-user-circle"></i> Customer Information
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Name:</span>
            <span>{booking.fullName}</span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Email:</span>
            <span>{booking.email}</span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Phone:</span>
            <span>{booking.phone}</span>
          </div>
        </div>

        <div className="rt-section">
          <div className="rt-section-title">
            <i className="fas fa-map-marked-alt"></i> Package Details
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Package Name:</span>
            <span>{packageInfo.name}</span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Destination:</span>
            <span>{packageInfo.location}</span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Duration:</span>
            <span>{packageInfo.duration} Days</span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Travel Date:</span>
            <span>{booking.travelDate}</span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Number of Travelers:</span>
            <span>{booking.travelers}</span>
          </div>
        </div>

        {/* Travelers Section */}
        <div className="rt-section">
          <div className="rt-section-title">
            <i className="fas fa-users"></i> Traveler Details
          </div>

          {/* Lead Traveler */}
          <div className="rt-traveler-item">
            <div className="rt-traveler-header">Lead Traveler</div>
            <div className="rt-traveler-details">
              <div className="rt-traveler-detail">
                <span className="rt-detail-label">Name:</span>
                <span>{booking.fullName}</span>
              </div>
              <div className="rt-traveler-detail">
                <span className="rt-detail-label">Gender:</span>
                <span>{booking.gender || "Not specified"}</span>
              </div>
              <div className="rt-traveler-detail">
                <span className="rt-detail-label">Age:</span>
                <span>{booking.age || "Not specified"}</span>
              </div>
            </div>
          </div>

          {/* Additional Travelers */}
          {booking.additionalTravelers &&
            booking.additionalTravelers.length > 0 && (
              <div className="rt-additional-travelers">
                {booking.additionalTravelers.map((traveler, index) => (
                  <div key={index} className="rt-traveler-item">
                    <div className="rt-traveler-header">
                      Traveler {index + 2}
                    </div>
                    <div className="rt-traveler-details">
                      <div className="rt-traveler-detail">
                        <span className="rt-detail-label">Name:</span>
                        <span>{traveler.fullName}</span>
                      </div>
                      <div className="rt-traveler-detail">
                        <span className="rt-detail-label">Gender:</span>
                        <span>{traveler.gender || "Not specified"}</span>
                      </div>
                      <div className="rt-traveler-detail">
                        <span className="rt-detail-label">Age:</span>
                        <span>{traveler.age || "Not specified"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="rt-section">
          <div className="rt-section-title">
            <i className="fas fa-credit-card"></i> Payment Information
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Order ID:</span>
            <span>{order.order_id}</span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Payment Status:</span>
            <span className="rt-payment-success">
              {order.order_status || "PAID"}
            </span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-label">Price per Person:</span>
            <span>Rs {(packageInfo.price || 0).toLocaleString("en-IN")}</span>
          </div>
          <div className="rt-detail-row rt-total-row">
            <span className="rt-detail-label">Total Amount:</span>
            <span>Rs {(order.order_amount || 0).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Barcode section removed */}

      <div className="rt-ticket-note">
        <i className="fas fa-ticket-alt"></i>
        <p>
          Your original booking package tickets will be provided within a few
          hours.
        </p>
      </div>

      <div className="rt-footer">
        <div className="rt-terms">
          <h4>Terms & Conditions</h4>
          <ul>
            <li>This receipt is proof of payment only.</li>
            <li>
              Cancellation policy: 48 hours notice required for full refund.
            </li>
            <li>
              Please carry a valid ID proof for all travelers during the trip.
            </li>
            <li>
              Package inclusions are as per the itinerary shared at the time of
              booking.
            </li>
          </ul>
        </div>
        <div className="rt-contact">
          <p>Thank you for booking with TripEasy!</p>
          <p>
            For any queries, please contact us at{" "}
            <strong>booking.tripeasy@gmail.com</strong> or call{" "}
            <strong>+91 9157450389</strong>
          </p>
          <p>© {new Date().getFullYear()} TripEasy. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptTemplate;
