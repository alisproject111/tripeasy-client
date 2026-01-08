"use client";

import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "../styles/Toast.css";

function Toast({ message, type = "success", duration = 3000, onClose }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300); // Match the animation duration
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Create a portal to render the toast at the top level of the DOM
  return ReactDOM.createPortal(
    <div className={`toast-container ${type} ${isExiting ? "fade-out" : ""}`}>
      <div className="toast-content">
        <div className="toast-icon">
          {type === "success" && <i className="fas fa-check-circle"></i>}
          {type === "error" && <i className="fas fa-exclamation-circle"></i>}
          {type === "info" && <i className="fas fa-info-circle"></i>}
          {type === "warning" && (
            <i className="fas fa-exclamation-triangle"></i>
          )}
        </div>
        <div className="toast-message">{message}</div>
        <button
          className="toast-close"
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => {
              if (onClose) onClose();
            }, 300);
          }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div
        className="toast-progress"
        style={{ animationDuration: `${duration}ms` }}
      ></div>
    </div>,
    document.body
  );
}

// Create a toast manager to handle multiple toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
    return id;
  };

  const hideToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const ToastContainer = () => {
    if (toasts.length === 0) return null;

    return ReactDOM.createPortal(
      <>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </>,
      document.body
    );
  };

  return {
    showToast,
    hideToast,
    ToastContainer,
    success: (message, duration) => showToast(message, "success", duration),
    error: (message, duration) => showToast(message, "error", duration),
    info: (message, duration) => showToast(message, "info", duration),
    warning: (message, duration) => showToast(message, "warning", duration),
  };
};

export default Toast;
