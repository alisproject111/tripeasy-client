import { useLocation, Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import SEOHead from "../components/SEOHead"
import "../styles/SocialMediaComingSoon.css"

function SocialMediaComingSoon() {
  const location = useLocation()
  const navigate = useNavigate()
  const [platform, setPlatform] = useState("facebook")

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const p = params.get("platform") || "facebook"
    setPlatform(p.toLowerCase())
  }, [location.search])

  const getPlatformDetails = () => {
    switch (platform) {
      case "instagram":
        return {
          name: "Instagram",
          icon: "fab fa-instagram",
          colorClass: "instagram",
          accentColor: "#e1306c",
        }
      case "facebook":
      default:
        return {
          name: "Facebook",
          icon: "fab fa-facebook-f",
          colorClass: "facebook",
          accentColor: "#1877f2",
        }
    }
  }

  const details = getPlatformDetails()

  return (
    <div className={`coming-soon-container ${details.colorClass}`}>
      <SEOHead
        title={`${details.name} Coming Soon | TripEasy`}
        description={`We are building an interactive ${details.name} integration. Discover more exciting features coming soon!`}
        keywords={`tripeasy ${details.name}, travel agency, coming soon, interactive trip planning`}
        canonical={`https://tripeasy.in/social-media-coming-soon?platform=${platform}`}
      />

      <div className="coming-soon-card">
        <div className="platform-badge">
          <i className={details.icon}></i>
          <span>{details.name} Channel</span>
        </div>

        <div className="icon-container">
          <i className={details.icon}></i>
        </div>

        <h1>Under Construction</h1>
        <p className="subtitle">
          We are working to create something like this in an interactive way for our{" "}
          <strong>{details.name}</strong> page! Stay tuned for a highly tailored social experience.
        </p>

        <div className="coming-soon-actions">
          <Link to="/packages" className="action-btn-primary">
            <i className="fas fa-compass"></i> Explore Packages
          </Link>
          <button onClick={() => navigate(-1)} className="action-btn-secondary">
            <i className="fas fa-arrow-left"></i> Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default SocialMediaComingSoon
