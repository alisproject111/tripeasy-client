import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";

// Suppress verbose console logs and external library warnings in the browser console
const originalLog = console.log;
console.log = (...args) => {
  const message = args[0];
  if (typeof message === "string") {
    if (
      message.startsWith("[v0]") ||
      message.startsWith("Trying to retrieve") ||
      message.startsWith("Processing successful") ||
      message.startsWith("Retrieved from sessionStorage") ||
      message.startsWith("Detected return") ||
      message.includes("API response") ||
      message.includes("API Response") ||
      message.includes("Loaded") ||
      message.includes("Fetching")
    ) {
      return;
    }
  }
  originalLog(...args);
};

const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (typeof message === "string" && (message.includes("UNSAFE_componentWillMount") || message.includes("componentWillMount"))) {
    return;
  }
  originalWarn(...args);
};

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
