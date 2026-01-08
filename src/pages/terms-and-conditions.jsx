"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/policy-styles.css";

function TermsAndConditions() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Set document title
    document.title = "Terms & Conditions - TripEasy";
  }, []);

  // Background image URL - assuming the image is in public folder
  const headerBackground = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/assets/hero/policy-header.jpg")`,
  };

  return (
    <div className="policy-page">
      <div className="policy-header" style={headerBackground}>
        <div className="container">
          <h1 className="policy-title">Terms & Conditions</h1>
          <p className="policy-subtitle">Last Updated: April 18, 2025</p>
        </div>
      </div>

      <div className="container policy-container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>
              These terms and conditions outline the rules and regulations for
              the use of FlyAnyTrip's website. By accessing this website, we
              assume you accept these terms and conditions in full. Do not
              continue to use FlyAnyTrip's website if you do not accept all of
              the terms and conditions stated on this page.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. Booking and Payments</h2>
            <p>
              When making a booking with FlyAnyTrip, you agree to provide
              accurate and complete information for all travelers. Payment terms
              are as follows:
            </p>
            <ul className="policy-list">
              <li>
                A deposit of 30% of the total package price is required at the
                time of booking.
              </li>
              <li>
                Full payment must be made at least 30 days prior to the
                departure date.
              </li>
              <li>
                For bookings made within 30 days of departure, full payment is
                required at the time of booking.
              </li>
              <li>
                All payments are processed securely through our payment gateway.
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Cancellation Policy</h2>
            <p>
              Cancellation of bookings must be made in writing. The following
              cancellation charges apply:
            </p>
            <ul className="policy-list">
              <li>
                More than 30 days before departure: 10% of total package price
              </li>
              <li>15-30 days before departure: 30% of total package price</li>
              <li>7-14 days before departure: 50% of total package price</li>
              <li>
                Less than 7 days before departure: 100% of total package price
              </li>
            </ul>
            <p>
              We strongly recommend purchasing travel insurance to cover any
              unforeseen circumstances.
            </p>
          </section>

          <section className="policy-section">
            <h2>4. Package Changes</h2>
            <p>
              FlyAnyTrip reserves the right to make changes to any of the
              facilities, services or prices described in our brochures or
              website. We will advise you of any changes known at the time of
              booking.
            </p>
            <p>
              If a major change becomes necessary, we will inform you as soon as
              reasonably possible if there is time before your departure.
            </p>
          </section>

          <section className="policy-section">
            <h2>5. Travel Documents</h2>
            <p>
              It is your responsibility to ensure that you have valid travel
              documents, including:
            </p>
            <ul className="policy-list">
              <li>
                Passport with minimum 6 months validity from the date of return
              </li>
              <li>Necessary visas for all destinations on your itinerary</li>
              <li>Travel insurance documentation</li>
              <li>Any required health certificates or vaccination records</li>
            </ul>
            <p>
              FlyAnyTrip is not responsible for any issues arising from
              incomplete or invalid travel documentation.
            </p>
          </section>

          <section className="policy-section">
            <h2>6. Liability</h2>
            <p>
              FlyAnyTrip acts as an intermediary between you and the various
              service providers such as airlines, hotels, transport companies,
              and other suppliers. While we select these providers with
              reasonable care, we cannot be held responsible for any acts or
              omissions of these third parties.
            </p>
            <p>
              Our liability is limited to the provisions of services as
              described in the package details. We are not liable for any
              injury, damage, loss, accident, delay, or irregularity that may be
              caused by defect or default of any company or person engaged in
              conveying passengers or carrying out travel arrangements.
            </p>
          </section>

          <section className="policy-section">
            <h2>7. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in
              accordance with the laws of India, and you submit to the
              non-exclusive jurisdiction of the courts located in Gujarat,
              India.
            </p>
          </section>

          <section className="policy-section">
            <h2>8. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please
              contact us at:
            </p>
            <div className="policy-contact-info">
              <p>
                <strong>Email:</strong> contact.us.tripeasy@gmail.com
              </p>
              <p>
                <strong>Phone:</strong> +91 9157450389
              </p>
              <p>
                <strong>Address:</strong> Shop No 16, 2nd Floor, VED TransCube
                opposite the Main Railway Station, Vadodara, Gujarat 390002
                India
              </p>
            </div>
          </section>
        </div>

        <div className="policy-navigation">
          <Link to="/" className="policy-back-button">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;