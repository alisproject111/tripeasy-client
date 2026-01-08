"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { RefreshContext } from "./AdminDashboard";
import "../../styles/admin/AdminPackageForm.css";
import { useToast } from "../Toast";

function AdminPackageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id !== "new";
  const refreshData = useContext(RefreshContext);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    image: "",
    location: "",
    highlights: [""],
    description: "",
    pdfUrl: "",
    itinerary: [{ day: 1, title: "", description: "", activities: [""] }],
    rating: "",
    reviews: "",
    category: "",
    featured: false,
  });

  const [loading, setLoading] = useState(false);

  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (isEdit && id && id !== "new") {
      fetchPackage();
    }
  }, [id, isEdit, navigate]);

  const fetchPackage = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/packages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        const pkg = data.data.package;
        setFormData({
          ...pkg,
          price: pkg.price?.toString() || "",
          duration: pkg.duration?.toString() || "",
          rating: pkg.rating?.toString() || "",
          reviews: pkg.reviews?.toString() || "",
          highlights:
            pkg.highlights && pkg.highlights.length > 0 ? pkg.highlights : [""],
          itinerary:
            pkg.itinerary && pkg.itinerary.length > 0
              ? pkg.itinerary
              : [{ day: 1, title: "", description: "", activities: [""] }],
          image: pkg.image || "",
          pdfUrl: pkg.pdfUrl || "",
        });
      } else {
        showToast(data.message || "Package not found", "error", 5000);
      }
    } catch (error) {
      showToast("Failed to fetch package data", "error", 5000);
      console.error("Error fetching package:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    const requiredFields = [
      "name",
      "price",
      "duration",
      "location",
      "category",
      "description",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].trim() === ""
    );

    if (missingFields.length > 0) {
      showToast(
        `Please fill in all required fields: ${missingFields.join(", ")}`,
        "error",
        5000
      );
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const processedData = {
        ...formData,
        price: Number(formData.price) || 0,
        duration: Number(formData.duration) || 0,
        rating: Number(formData.rating) || 0,
        reviews: Number(formData.reviews) || 0,
        highlights: formData.highlights.filter((h) => h.trim() !== ""),
        itinerary: formData.itinerary
          .map((item) => ({
            ...item,
            activities: item.activities
              ? item.activities.filter((a) => a.trim() !== "")
              : [],
          }))
          .filter(
            (item) =>
              item.title.trim() !== "" ||
              item.description.trim() !== "" ||
              (item.activities && item.activities.length > 0)
          ),
      };

      // Validate numeric fields
      if (isNaN(processedData.price) || processedData.price <= 0) {
        showToast("Please enter a valid price", "error", 4000);
        setLoading(false);
        return;
      }
      if (isNaN(processedData.duration) || processedData.duration <= 0) {
        showToast("Please enter a valid duration", "error", 4000);
        setLoading(false);
        return;
      }

      // Determine if this is a new package or an edit
      const isNewPackage = id === "new" || !id;
      const url = isNewPackage
        ? "/api/admin/packages"
        : `/api/admin/packages/${id}`;
      const method = isNewPackage ? "POST" : "PUT";

      console.log(`Submitting package data: ${method} ${url}`, processedData);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(processedData),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok && data.success) {
        showToast(
          isNewPackage
            ? "Package created successfully!"
            : "Package updated successfully!",
          "success",
          4000
        );
        if (refreshData) {
          refreshData();
        }
        navigate("/admin/dashboard");
      } else {
        showToast(data.message || "Failed to save package", "error", 5000);
      }
    } catch (error) {
      console.error("Error saving package:", error);
      showToast(
        error.message || "Network error. Please try again.",
        "error",
        5000
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field, defaultValue = "") => {
    setFormData({
      ...formData,
      [field]: [...formData[field], defaultValue],
    });
  };

  const removeArrayItem = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const handleItineraryActivityChange = (
    itineraryIndex,
    activityIndex,
    value
  ) => {
    const newItinerary = [...formData.itinerary];
    if (!newItinerary[itineraryIndex].activities) {
      newItinerary[itineraryIndex].activities = [];
    }
    newItinerary[itineraryIndex].activities[activityIndex] = value;
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const addItineraryDay = () => {
    const newDay = {
      day: formData.itinerary.length + 1,
      title: "",
      description: "",
      activities: [""],
    };
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, newDay],
    });
  };

  const removeItineraryDay = (index) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index);
    // Renumber days
    const renumberedItinerary = newItinerary.map((item, i) => ({
      ...item,
      day: i + 1,
    }));
    setFormData({ ...formData, itinerary: renumberedItinerary });
  };

  const addItineraryActivity = (itineraryIndex) => {
    const newItinerary = [...formData.itinerary];
    if (!newItinerary[itineraryIndex].activities) {
      newItinerary[itineraryIndex].activities = [];
    }
    newItinerary[itineraryIndex].activities.push("");
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const removeItineraryActivity = (itineraryIndex, activityIndex) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[itineraryIndex].activities = newItinerary[
      itineraryIndex
    ].activities.filter((_, i) => i !== activityIndex);
    setFormData({ ...formData, itinerary: newItinerary });
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="admin-package-form">
        <div className="form-header">
          <h1>{isEdit ? "Edit Package" : "Add New Package"}</h1>
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="btn btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="package-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Package Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (₹) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="duration">Duration (days) *</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Beach">Beach</option>
                  <option value="Hill Station">Hill Station</option>
                  <option value="International">International</option>
                  <option value="Pilgrimage">Pilgrimage</option>
                  <option value="Heritage">Heritage</option>
                  <option value="Nature & Culture">Nature & Culture</option>
                  <option value="Weekend Trip">Weekend Trip</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Spiritual">Spiritual</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="image">Image URL (Optional)</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="/src/assets/packages/example.jpg"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="rating">Rating (1-5)</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="1"
                  max="5"
                  step="0.1"
                />
              </div>
              <div className="form-group">
                <label htmlFor="reviews">Number of Reviews</label>
                <input
                  type="number"
                  id="reviews"
                  name="reviews"
                  value={formData.reviews}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pdfUrl">PDF URL (Optional)</label>
              <input
                type="text"
                id="pdfUrl"
                name="pdfUrl"
                value={formData.pdfUrl}
                onChange={handleChange}
                placeholder="/pdfs/package.pdf"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                Featured Package
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Highlights</h3>
            {formData.highlights.map((highlight, index) => (
              <div key={index} className="array-item">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, "highlights")
                  }
                  placeholder="Enter highlight"
                />
                {formData.highlights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, "highlights")}
                    className="btn btn-remove"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("highlights")}
              className="btn btn-add"
            >
              Add Highlight
            </button>
          </div>

          <div className="form-section">
            <h3>Itinerary</h3>
            {formData.itinerary.map((day, dayIndex) => (
              <div key={dayIndex} className="itinerary-day">
                <div className="day-header">
                  <h4>Day {day.day}</h4>
                  {formData.itinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItineraryDay(dayIndex)}
                      className="btn btn-remove"
                    >
                      Remove Day
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Day Title</label>
                  <input
                    type="text"
                    value={day.title}
                    onChange={(e) =>
                      handleItineraryChange(dayIndex, "title", e.target.value)
                    }
                    placeholder="Enter day title"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={day.description}
                    onChange={(e) =>
                      handleItineraryChange(
                        dayIndex,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Enter day description"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Activities</label>
                  {(day.activities || []).map((activity, activityIndex) => (
                    <div key={activityIndex} className="array-item">
                      <input
                        type="text"
                        value={activity}
                        onChange={(e) =>
                          handleItineraryActivityChange(
                            dayIndex,
                            activityIndex,
                            e.target.value
                          )
                        }
                        placeholder="Enter activity"
                      />
                      {day.activities.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeItineraryActivity(dayIndex, activityIndex)
                          }
                          className="btn btn-remove"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addItineraryActivity(dayIndex)}
                    className="btn btn-add"
                  >
                    Add Activity
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addItineraryDay}
              className="btn btn-add"
            >
              Add Day
            </button>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Package"
                : "Create Package"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AdminPackageForm;
