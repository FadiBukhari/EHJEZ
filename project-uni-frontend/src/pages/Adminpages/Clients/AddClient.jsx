import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import LocationPicker from "../../../components/LocationPicker/LocationPicker";
import "./ClientForm.scss";

const AddClient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    openingHours: "",
    closingHours: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle phone number input separately to restrict to digits only
    if (name === "phoneNumber") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError(""); // Clear error on input change
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
      !formData.password ||
      !formData.phoneNumber ||
      !formData.openingHours ||
      !formData.closingHours ||
      !formData.latitude ||
      !formData.longitude
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    if (formData.openingHours >= formData.closingHours) {
      setError("Opening hours must be before closing hours");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      };
      await API.post("/admin/clients", payload);
      alert("Client created successfully!");
      navigate("/admin/clients");
    } catch (error) {
      console.error("Error creating client:", error);
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create client"
      );
      setLoading(false);
    }
  };

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
          <h1>Add New Client</h1>
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
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password (min 6 characters)"
                minLength={6}
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '0',
                  color: '#666'
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
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
              placeholder="Enter 10-digit phone number"
              pattern="\d{10}"
              maxLength="10"
              title="Phone number must be exactly 10 digits"
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
                step="3600"
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
                step="3600"
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

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/admin/clients")}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Creating..." : "Create Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClient;
