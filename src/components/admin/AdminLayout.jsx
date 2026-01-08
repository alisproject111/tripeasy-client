"use client";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../Toast";
import "../../styles/admin/AdminLayout.css";

const AdminLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { success, info } = useToast();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Clear all admin-related data
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminLoginTime");

      success("Logged out successfully!");
      navigate("/admin/login");
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-brand">
            <h1>
              <i className="fas fa-cogs"></i>
              TripEasy Admin Panel
            </h1>
          </div>
          <nav className="admin-nav">
            <Link
              to="/admin/dashboard"
              className={`nav-link ${
                isActiveRoute("/admin/dashboard") ? "active" : ""
              }`}
            >
              <i className="fas fa-tachometer-alt"></i>
              Dashboard
            </Link>
            <Link
              to="/admin/edit/new"
              className={`nav-link ${
                isActiveRoute("/admin/edit/new") ? "active" : ""
              }`}
            >
              <i className="fas fa-plus-circle"></i>
              Add Package
            </Link>
            <Link to="/" className="nav-link view-site">
              <i className="fas fa-external-link-alt"></i>
              View Site
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-content">
          {title && (
            <div className="page-header">
              <h2 className="page-title">{title}</h2>
              <div className="breadcrumb">
                <Link to="/admin/dashboard">Dashboard</Link>
                {title && title !== "Dashboard" && (
                  <>
                    <span className="separator">/</span>
                    <span className="current">{title}</span>
                  </>
                )}
              </div>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
