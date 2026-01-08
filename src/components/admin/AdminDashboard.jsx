"use client"

import { useState, useEffect, createContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AdminLayout from "./AdminLayout"
import "../../styles/admin/AdminDashboard.css"
import { apiEndpoints } from "../../config/api"

// Create a context for refreshing data
export const RefreshContext = createContext(null)

function AdminDashboard() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const refreshData = () => {
    setLoading(true)
    fetchPackages()
  }

  useEffect(() => {
    refreshData()
  }, [])

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        navigate("/admin/login")
        return
      }

      const response = await fetch(apiEndpoints.adminPackages, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        localStorage.removeItem("adminToken")
        navigate("/admin/login")
        return
      }

      const data = await response.json()
      if (data.success) {
        setPackages(data.data.packages || [])
      } else {
        setError(data.message || "Failed to fetch packages")
      }
    } catch (error) {
      setError("Network error. Please try again.")
      console.error("[v0] Error fetching packages:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) {
      return
    }

    try {
      const token = localStorage.getItem("adminToken")

      const response = await fetch(apiEndpoints.adminPackageById(id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        refreshData()
        toast.success("Package deleted successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: "admin-toast-success",
        })
      } else {
        setError(data.message || "Failed to delete package")
      }
    } catch (error) {
      setError("Network error. Please try again.")
      console.error("[v0] Error deleting package:", error)
    }
  }

  if (loading) {
    return (
      <RefreshContext.Provider value={refreshData}>
        <AdminLayout>
          <div className="admin-loading-container">
            <div className="admin-loading-spinner"></div>
            <p>Loading packages...</p>
          </div>
        </AdminLayout>
      </RefreshContext.Provider>
    )
  }

  return (
    <RefreshContext.Provider value={refreshData}>
      <AdminLayout>
        <div className="admin-dashboard-container">
          <div className="admin-dashboard-header">
            <h1 className="admin-dashboard-title">Package Management</h1>
            <Link to="/admin/edit/new" className="admin-add-btn">
              <i className="fas fa-plus"></i> Add New Package
            </Link>
          </div>

          {error && <div className="admin-error-message">{JSON.stringify(error, null, 2)}</div>}

          <div className="admin-packages-grid">
            {packages.map((pkg) => (
              <div key={pkg.id} className="admin-card-box">
                <div className="admin-card-header">
                  <div className="admin-package-info">
                    <h3 className="admin-package-name">{pkg.name}</h3>
                    <p className="admin-package-location">{pkg.location}</p>
                  </div>
                  <div className="admin-package-actions">
                    <Link to={`/admin/edit/${pkg.id}`} className="admin-edit-btn" title="Edit Package">
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button onClick={() => handleDelete(pkg.id)} className="admin-delete-btn" title="Delete Package">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div className="admin-card-body">
                  <div className="admin-package-details">
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Price:</span>
                      <span className="admin-detail-value">₹{pkg.price?.toLocaleString()}</span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Duration:</span>
                      <span className="admin-detail-value">{pkg.duration} days</span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Category:</span>
                      <span className="admin-category-badge">{pkg.category}</span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Rating:</span>
                      <span className="admin-rating-value">
                        ⭐ {pkg.rating} ({pkg.reviews} reviews)
                      </span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Featured:</span>
                      <span className={`admin-status ${pkg.featured ? "admin-featured" : "admin-not-featured"}`}>
                        {pkg.featured ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>

                  {pkg.description && (
                    <div className="admin-package-description">
                      <p>{pkg.description.substring(0, 100)}...</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {packages.length === 0 && (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                <i className="fas fa-box-open"></i>
              </div>
              <h3>No packages found</h3>
              <p>Get started by adding your first package</p>
              <Link to="/admin/edit/new" className="admin-add-btn">
                Add First Package
              </Link>
            </div>
          )}
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AdminLayout>
    </RefreshContext.Provider>
  )
}

export default AdminDashboard
