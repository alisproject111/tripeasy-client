"use client";

import { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { useToast } from "./components/Toast";
import "./styles/App.css";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const PackagesPage = lazy(() => import("./pages/PackagesPage"));
const PackageDetailPage = lazy(() => import("./pages/PackageDetailPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const PaymentStatus = lazy(() => import("./pages/PaymentStatusPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPolicy = lazy(() => import("./pages/privacy-policy"));
const TermsAndConditions = lazy(() => import("./pages/terms-and-conditions"));
const RefundPolicy = lazy(() => import("./pages/refund-policy"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Admin components
const AdminLogin = lazy(() => import("./components/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const AdminPackageForm = lazy(() =>
  import("./components/admin/AdminPackageForm")
);
const ProtectedRoute = lazy(() => import("./components/admin/ProtectedRoute"));

// ScrollToTop component to handle scrolling on route change
function ScrollToTopOnNavigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're navigating to home page and if we came from a package detail page
    const previousPath = sessionStorage.getItem("previousPath");

    if (
      pathname === "/" &&
      previousPath &&
      previousPath.startsWith("/package/")
    ) {
      // If returning to home from package detail, scroll to popular packages section
      setTimeout(() => {
        const popularPackagesSection =
          document.querySelector(".popular-packages");
        if (popularPackagesSection) {
          popularPackagesSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100); // Small delay to ensure the component is rendered
    } else {
      // For all other navigation, scroll to top
      window.scrollTo(0, 0);
    }

    // Store current path for next navigation
    sessionStorage.setItem("previousPath", pathname);
  }, [pathname]);

  return null;
}

// Component to conditionally render navbar and footer
function ConditionalLayout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main
        className={`main-content ${isAdminRoute ? "admin-main-content" : ""}`}
      >
        {children}
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <ScrollToTop />}
    </>
  );
}

function App() {
  const { ToastContainer } = useToast();

  return (
    <Router>
      <ScrollToTopOnNavigation />
      <div className="app">
        <ConditionalLayout>
          <Suspense
            fallback={
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
              </div>
            }
          >
            <Helmet>
              <link rel="icon" href="/tripeasy-logo.png" />
              <link rel="apple-touch-icon" href="/tripeasy-logo.png" />
            </Helmet>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/package/:id" element={<PackageDetailPage />} />
              <Route path="/booking/:id" element={<BookingPage />} />
              <Route path="/payment/:id" element={<PaymentPage />} />
              <Route path="/payment-status" element={<PaymentStatus />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route
                path="/terms-and-conditions"
                element={<TermsAndConditions />}
              />
              <Route path="/refund-policy" element={<RefundPolicy />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/edit/:id"
                element={
                  <ProtectedRoute>
                    <AdminPackageForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/edit/new"
                element={
                  <ProtectedRoute>
                    <AdminPackageForm />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ConditionalLayout>

        {/* Toast Container - Global */}
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
