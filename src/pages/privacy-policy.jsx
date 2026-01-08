"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/policy-styles.css";

function PrivacyPolicy() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Set document title
    document.title = "Privacy Policy - TripEasy";
  }, []);

  // Background image URL - assuming the image is in public folder
  const headerBackground = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/assets/hero/policy-header.jpg")`,
  };

  return (
    <div className="policy-page">
      <div className="policy-header" style={headerBackground}>
        <div className="container">
          <h1 className="policy-title">Privacy Policy</h1>
          <p className="policy-subtitle">Last Updated: April 18, 2025</p>
        </div>
      </div>

      <div className="container policy-container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to FlyAnyTrip. We respect your privacy and are committed
              to protecting your personal data. This privacy policy will inform
              you about how we look after your personal data when you visit our
              website and tell you about your privacy rights and how the law
              protects you.
            </p>
            <p>
              This privacy policy aims to give you information on how FlyAnyTrip
              collects and processes your personal data through your use of this
              website, including any data you may provide through this website
              when you sign up for our newsletter, purchase a product or
              service, or take part in a competition.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. The Data We Collect About You</h2>
            <p>
              Personal data, or personal information, means any information
              about an individual from which that person can be identified. It
              does not include data where the identity has been removed
              (anonymous data).
            </p>
            <p>
              We may collect, use, store and transfer different kinds of
              personal data about you which we have grouped together as follows:
            </p>
            <ul className="policy-list">
              <li>
                <strong>Identity Data</strong> includes first name, last name,
                username or similar identifier, title, date of birth and gender.
              </li>
              <li>
                <strong>Contact Data</strong> includes billing address, delivery
                address, email address and telephone numbers.
              </li>
              <li>
                <strong>Financial Data</strong> includes bank account and
                payment card details.
              </li>
              <li>
                <strong>Transaction Data</strong> includes details about
                payments to and from you and other details of products and
                services you have purchased from us.
              </li>
              <li>
                <strong>Technical Data</strong> includes internet protocol (IP)
                address, your login data, browser type and version, time zone
                setting and location, browser plug-in types and versions,
                operating system and platform, and other technology on the
                devices you use to access this website.
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. How We Use Your Personal Data</h2>
            <p>
              We will only use your personal data when the law allows us to.
              Most commonly, we will use your personal data in the following
              circumstances:
            </p>
            <ul className="policy-list">
              <li>
                Where we need to perform the contract we are about to enter into
                or have entered into with you.
              </li>
              <li>
                Where it is necessary for our legitimate interests (or those of
                a third party) and your interests and fundamental rights do not
                override those interests.
              </li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your
              personal data from being accidentally lost, used or accessed in an
              unauthorized way, altered or disclosed. In addition, we limit
              access to your personal data to those employees, agents,
              contractors and other third parties who have a business need to
              know. They will only process your personal data on our
              instructions and they are subject to a duty of confidentiality.
            </p>
          </section>

          <section className="policy-section">
            <h2>5. Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection
              laws in relation to your personal data, including the right to:
            </p>
            <ul className="policy-list">
              <li>Request access to your personal data.</li>
              <li>Request correction of your personal data.</li>
              <li>Request erasure of your personal data.</li>
              <li>Object to processing of your personal data.</li>
              <li>Request restriction of processing your personal data.</li>
              <li>Request transfer of your personal data.</li>
              <li>Right to withdraw consent.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>6. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy
              practices, please contact us at:
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

export default PrivacyPolicy;