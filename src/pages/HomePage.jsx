"use client";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import SearchBar from "../components/SearchBar";
import PopularPackages from "../components/PopularPackages";
import PopularDestinations from "../components/PopularDestinations";
import MonthlyDestinations from "../components/MonthlyPackages";
import AnimatedElement from "../components/AnimatedElement";
import CustomizePackageButton from "../components/CustomizePackageButton";
import SEOHead from "../components/SEOHead";

import "../styles/HomePage.css";

function HomePage() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Check if we need to scroll to a specific section
    if (location.state && location.state.scrollToId) {
      const id = location.state.scrollToId;
      const element = document.getElementById(id);

      if (element) {
        // Wait for page to fully load before scrolling
        setTimeout(() => {
          const yOffset = -80; // Navbar height offset
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.state]);

  // For mobile, don't use animations
  if (isMobile) {
    return (
      <div className="home-page">
        <SEOHead
          title="TripEasy - Best Travel & Holiday Packages | Domestic & International Tours"
          description="Discover amazing travel packages with TripEasy. Book affordable domestic & international tours to Goa, Kerala, Manali, Bali, Thailand, Vietnam & more destinations. Best prices guaranteed with 24/7 support."
          keywords="travel packages, holiday packages, tour packages, vacation packages, domestic tours, international tours, India travel, Goa packages, Kerala tours, Manali trips, Bali tours, Thailand packages, Vietnam tours, affordable travel, best travel deals, holiday booking, travel agency India, family vacation packages, honeymoon packages, adventure tours"
          canonical="https://tripeasy.in/"
          structuredData={{
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            name: "TripEasy",
            description:
              "Best travel agency offering domestic and international tour packages",
            url: "https://tripeasy.in",
            logo: "https://tripeasy.in/tripeasy-logo.png",
            image: "https://tripeasy.in/tripeasy-logo.png",
            telephone: "+91-9157450389",
            email: "contact.us.tripeasy@gmail.com",
            address: {
              "@type": "PostalAddress",
              streetAddress:
                "Shop No 16, 2nd Floor, VED TransCube opposite the Main Railway Station",
              addressLocality: "Vadodara",
              addressRegion: "Gujarat",
              postalCode: "390002",
              addressCountry: "IN",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: "22.3072",
              longitude: "73.1812",
            },
            openingHours: "Mo-Fr 09:00-18:00, Sa 10:00-16:00",
            priceRange: "₹₹",
            serviceArea: {
              "@type": "Country",
              name: "India",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Travel Packages",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "TouristTrip",
                    name: "Domestic Tour Packages",
                    description: "Explore beautiful destinations within India",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "TouristTrip",
                    name: "International Tour Packages",
                    description: "Discover amazing international destinations",
                  },
                },
              ],
            },
            sameAs: [
              "https://www.instagram.com/flyanytripindia",
              "https://x.com/flyanytripindia",
              "https://www.linkedin.com/company/flyanytripindia/",
            ],
          }}
        />
        <div id="home">
          <HeroSection />
          <div className="search-bar-wrapper">
            <SearchBar />
          </div>
        </div>

        <div id="packages">
          <PopularPackages />
        </div>

        <div id="destinations">
          <PopularDestinations />
        </div>

        <div id="monthly-destinations">
          <MonthlyDestinations />
        </div>
        <CustomizePackageButton />
      </div>
    );
  }

  // For desktop, use animations
  return (
    <div className="home-page">
      <SEOHead
        title="TripEasy - Best Travel & Holiday Packages | Domestic & International Tours"
        description="Discover amazing travel packages with TripEasy. Book affordable domestic & international tours to Goa, Kerala, Manali, Bali, Thailand, Vietnam & more destinations. Best prices guaranteed with 24/7 support."
        keywords="travel packages, holiday packages, tour packages, vacation packages, domestic tours, international tours, India travel, Goa packages, Kerala tours, Manali trips, Bali tours, Thailand packages, Vietnam tours, affordable travel, best travel deals, holiday booking, travel agency India, family vacation packages, honeymoon packages, adventure tours"
        canonical="https://tripeasy.in/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          name: "TripEasy",
          description:
            "Best travel agency offering domestic and international tour packages",
          url: "https://tripeasy.in",
          logo: "https://tripeasy.in/tripeasy-logo.png",
          image: "https://tripeasy.in/tripeasy-logo.png",
          telephone: "+91-9157450389",
          email: "contact.us.tripeasy@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress:
              "Shop No 16, 2nd Floor, VED TransCube opposite the Main Railway Station",
            addressLocality: "Vadodara",
            addressRegion: "Gujarat",
            postalCode: "390002",
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: "22.3072",
            longitude: "73.1812",
          },
          openingHours: "Mo-Fr 09:00-18:00, Sa 10:00-16:00",
          priceRange: "₹₹",
          serviceArea: {
            "@type": "Country",
            name: "India",
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Travel Packages",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "TouristTrip",
                  name: "Domestic Tour Packages",
                  description: "Explore beautiful destinations within India",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "TouristTrip",
                  name: "International Tour Packages",
                  description: "Discover amazing international destinations",
                },
              },
            ],
          },
          sameAs: [
            "https://www.instagram.com/flyanytripindia",
            "https://x.com/flyanytripindia",
            "https://www.linkedin.com/company/flyanytripindia/",
          ],
        }}
      />
      <div id="home">
        <HeroSection />
        <div className="search-bar-wrapper">
          <AnimatedElement animation="fade-up">
            <SearchBar />
          </AnimatedElement>
        </div>
      </div>

      <div id="packages">
        <AnimatedElement animation="fade-up">
          <PopularPackages />
        </AnimatedElement>
      </div>

      <div id="destinations">
        <AnimatedElement animation="fade-up">
          <PopularDestinations />
        </AnimatedElement>
      </div>

      <div id="monthly-destinations">
        <AnimatedElement animation="fade-up">
          <MonthlyDestinations />
        </AnimatedElement>
      </div>
      <CustomizePackageButton />
    </div>
  );
}

export default HomePage;
