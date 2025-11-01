import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../services/api";
import LocationPicker from "../../../components/LocationPicker/LocationPicker";
import "./ClientForm.scss";

const EditClient = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    openingHours: "",
    closingHours: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await API.get(`/admin/clients/${id}`);
        const client = response.data;
        setFormData({
          username: client.username || "",
          email: client.email || "",
          phoneNumber: client.phoneNumber || "",
          openingHours: client.clientProfile?.openingHours || "",
          closingHours: client.clientProfile?.closingHours || "",
          latitude: client.clientProfile?.latitude || "",
          longitude: client.clientProfile?.longitude || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching client:", error);
        setError("Failed to load client details");
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleLocationChange = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    setShowLocationPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.username ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.openingHours ||
      !formData.closingHours ||
      !formData.latitude ||
      !formData.longitude
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.openingHours >= formData.closingHours) {
      setError("Opening hours must be before closing hours");
      return;
    }

    setSubmitting(true);

    try {
      await API.put(`/admin/clients/${id}`, formData);
      alert("Client updated successfully!");
      navigate("/admin/clients");
    } catch (error) {
      console.error("Error updating client:", error);
      setError(error.response?.data?.message || "Failed to update client");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="client-form-page">
        <div className="loading">Loading client details...</div>
      </div>
    );
  }

  return (
    <div className="client-form-page">
      {showLocationPicker && (
        <LocationPicker
          onLocationChange={handleLocationChange}
          onClose={() => setShowLocationPicker(false)}
          initialLat={formData.latitude || 0}
          initialLng={formData.longitude || 0}
        />
      )}

      <div className="form-container">
        <div className="form-header">
          <h1>Edit Client</h1>
          <button
            className="back-btn"
            onClick={() => navigate("/admin/clients")}
          >
            ← Back to Clients
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="client-form">
          <div className="form-group">
            <label htmlFor="username">
              Study House Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter study house name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">
              Phone Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="openingHours">
                Opening Hours <span className="required">*</span>
              </label>
              <input
                type="time"
                id="openingHours"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="closingHours">
                Closing Hours <span className="required">*</span>
              </label>
              <input
                type="time"
                id="closingHours"
                name="closingHours"
                value={formData.closingHours}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              📍 Location <span className="required">*</span>
            </label>
            {/* Hidden inputs for browser validation */}
            <input
              type="hidden"
              name="latitude"
              value={formData.latitude}
              required
            />
            <input
              type="hidden"
              name="longitude"
              value={formData.longitude}
              required
            />
            <div className="location-display">
              {formData.latitude && formData.longitude ? (
                <div className="location-info">
                  <span>
                    Lat: {parseFloat(formData.latitude).toFixed(6)}, Lng:{" "}
                    {parseFloat(formData.longitude).toFixed(6)}
                  </span>
                </div>
              ) : (
                <div className="location-info no-location">
                  <span>No location selected</span>
                </div>
              )}
              <button
                type="button"
                className="btn-select-location"
                onClick={() => setShowLocationPicker(true)}
              >
                {formData.latitude && formData.longitude
                  ? "Change Location"
                  : "Select Location"}
              </button>
            </div>
          </div>

          <div className="form-note">
            <strong>Note:</strong> Password cannot be changed through this form.
            If the client needs to reset their password, they should use the
            password recovery feature.
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/admin/clients")}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? "Updating..." : "Update Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClient;
