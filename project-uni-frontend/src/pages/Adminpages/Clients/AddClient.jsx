import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error on input change
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
      !formData.closingHours
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.openingHours >= formData.closingHours) {
      setError("Opening hours must be before closing hours");
      return;
    }

    setLoading(true);

    try {
      await API.post("/admin/clients", formData);
      alert("Client created successfully!");
      navigate("/admin/clients");
    } catch (error) {
      console.error("Error creating client:", error);
      setError(error.response?.data?.message || "Failed to create client");
      setLoading(false);
    }
  };

  return (
    <div className="client-form-page">
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
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password (min 6 characters)"
              minLength={6}
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
