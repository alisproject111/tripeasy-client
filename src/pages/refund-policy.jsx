"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/policy-styles.css";

function RefundPolicy() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Set document title
    document.title = "Refund Policy - TripEasy";
  }, []);

  // Background image URL - assuming the image is in public folder
  const headerBackground = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/assets/hero/policy-header.jpg")`,
  };

  return (
    <div className="policy-page">
      <div className="policy-header" style={headerBackground}>
        <div className="container">
          <h1 className="policy-title">Refund Policy</h1>
          <p className="policy-subtitle">Last Updated: April 18, 2025</p>
        </div>
      </div>

      <div className="container policy-container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>
              At FlyAnyTrip, we strive to ensure that our customers are
              completely satisfied with their travel experiences. This Refund
              Policy outlines the terms and conditions for refunds on bookings
              made through our website or directly with our customer service
              team.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. Cancellation and Refund Schedule</h2>
            <p>
              Refunds are processed according to the following schedule, based
              on when the cancellation request is received:
            </p>
            <ul className="policy-list">
              <li>
                <strong>More than 30 days before departure:</strong> 90% refund
                of the total amount paid
              </li>
              <li>
                <strong>15-30 days before departure:</strong> 70% refund of the
                total amount paid
              </li>
              <li>
                <strong>7-14 days before departure:</strong> 50% refund of the
                total amount paid
              </li>
              <li>
                <strong>Less than 7 days before departure:</strong> No refund
              </li>
            </ul>
            <p>
              All cancellation requests must be submitted in writing via email
              to booking.tripeasy@gmail.com or through our contact form on the
              website.
            </p>
          </section>

          <section className="policy-section">
            <h2>3. Special Circumstances</h2>
            <p>
              In certain special circumstances, we may offer more flexible
              refund terms:
            </p>
            <ul className="policy-list">
              <li>
                <strong>Medical Emergencies:</strong> With proper documentation
                from a medical professional, we may offer a more generous refund
                or the option to reschedule your trip without additional fees.
              </li>
              <li>
                <strong>Natural Disasters or Civil Unrest:</strong> If your
                destination becomes unsafe due to natural disasters or civil
                unrest, we will work with you to either reschedule your trip or
                provide a refund as appropriate.
              </li>
              <li>
                <strong>COVID-19 Related Issues:</strong> If travel restrictions
                are imposed due to COVID-19 that directly affect your trip, we
                will offer the option to reschedule or receive a credit for
                future travel.
              </li>
            </ul>
            <p>
              All special circumstances will be evaluated on a case-by-case
              basis and require supporting documentation.
            </p>
          </section>

          <section className="policy-section">
            <h2>4. Refund Processing Time</h2>
            <p>
              Once a refund is approved, the processing time depends on your
              payment method:
            </p>
            <ul className="policy-list">
              <li>
                <strong>Credit/Debit Cards:</strong> 7-14 business days
              </li>
              <li>
                <strong>Bank Transfers:</strong> 5-7 business days
              </li>
              <li>
                <strong>UPI Payments:</strong> 3-5 business days
              </li>
              <li>
                <strong>Digital Wallets:</strong> 2-3 business days
              </li>
            </ul>
            <p>
              Please note that while we process refunds promptly on our end, the
              actual time for the funds to appear in your account may vary
              depending on your financial institution.
            </p>
          </section>

          <section className="policy-section">
            <h2>5. Non-Refundable Items</h2>
            <p>The following items are generally non-refundable:</p>
            <ul className="policy-list">
              <li>Travel insurance premiums</li>
              <li>Visa application fees</li>
              <li>Service fees for changes to bookings</li>
              <li>
                Any third-party charges that are non-refundable to FlyAnyTrip
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>6. Partial Services Used</h2>
            <p>
              If you have already begun your trip and used a portion of the
              services booked, refunds will be calculated based on the unused
              portion, minus any applicable cancellation fees.
            </p>
          </section>

          <section className="policy-section">
            <h2>7. Contact Information</h2>
            <p>
              For any questions regarding our refund policy or to request a
              refund, please contact us at:
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

export default RefundPolicy;