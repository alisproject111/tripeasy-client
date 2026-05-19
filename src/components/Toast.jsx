import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "../styles/Toast.css";

function Toast({ message, type = "success", duration = 3000, onClose }) {
  const [isExiting, setIsExiting] = useState(false);
  const [wrapperElement, setWrapperElement] = useState(null);

  useEffect(() => {
    // Dynamically find or create the toast-wrapper element in client-side document body
    let wrapper = document.getElementById("toast-wrapper");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.id = "toast-wrapper";
      wrapper.className = "toast-wrapper";
      document.body.appendChild(wrapper);
    }
    setWrapperElement(wrapper);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300); // Match the animation duration
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // SSR safety guard
  if (!wrapperElement) return null;

  // Render the toast inside our single shared toast-wrapper portal
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
    wrapperElement
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

    // Toast components will dynamically portal themselves to our shared #toast-wrapper
    return (
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
      </>
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
