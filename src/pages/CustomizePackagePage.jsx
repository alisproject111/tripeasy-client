"use client";

import { useEffect } from "react";
import { Helmet } from "react-helmet";
import CustomizePackage from "../components/CustomizePackage";
import "../styles/CustomizePackagePage.css";

function CustomizePackagePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="customize-package-page">
      <Helmet>
        <title>Customize Your Travel Package | TravelPackages</title>
        <meta
          name="description"
          content="Create your own custom travel package tailored to your preferences. Tell us your dream destination, budget, and activities, and we'll design the perfect trip for you."
        />
      </Helmet>

      <div
        className="customize-package-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/mountain-lake-forest.png')`,
        }}
      >
        <div className="container">
          <h1 className="page-title">Customize Your Package</h1>
          <p className="page-subtitle">Create your dream travel experience</p>
        </div>
      </div>

      <div className="container">
        <CustomizePackage />
      </div>
    </div>
  );
}

export default CustomizePackagePage;
