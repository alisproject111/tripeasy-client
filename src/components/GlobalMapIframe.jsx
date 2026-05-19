import React, { useState, useEffect } from "react";

export default function GlobalMapIframe() {
  const [position, setPosition] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.setGlobalMapPosition = (pos) => {
      setPosition(pos);
    };

    window.hideGlobalMap = () => {
      setPosition(null);
    };

    return () => {
      delete window.setGlobalMapPosition;
      delete window.hideGlobalMap;
    };
  }, []);

  // Compute styles
  const containerStyle = position
    ? {
        position: "absolute",
        top: position.top,
        left: position.left,
        width: position.width,
        height: position.height,
        zIndex: 10,
        pointerEvents: "auto",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.3s ease",
      }
    : {
        position: "absolute",
        top: "-9999px",
        left: "-9999px",
        width: "100%",
        height: "450px",
        zIndex: -100,
        pointerEvents: "none",
        opacity: 0,
      };

  return (
    <div style={containerStyle}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d461.38220708861104!2d73.18106761565096!3d22.31365911089673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc575c736f7db%3A0x2bd8a3c08cdad680!2sFlyAnyTrip.com!5e0!3m2!1sen!2sin!4v1742556553157!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{
          border: 0,
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
        allowFullScreen=""
        loading="eager"
        onLoad={() => setIsLoaded(true)}
        title="Office Location"
      />
    </div>
  );
}
