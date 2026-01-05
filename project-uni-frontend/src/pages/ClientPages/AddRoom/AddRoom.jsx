// pages/Client/NewRoomPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import "./AddRoom.scss";
const AddRoom = () => {
  const navigate = useNavigate();
  const [room, setRoom] = useState({
    roomType: "single",
    capacity: "",
    basePrice: "",
    status: "available",
    description: "",
    hasWhiteboard: false,
    hasWifi: false,
    hasProjector: false,
    hasTV: false,
    hasAC: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoom({ ...room, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/rooms", {
        ...room,
        capacity: parseInt(room.capacity, 10),
        basePrice: parseFloat(room.basePrice),
      });
      navigate("/client/rooms");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="newroom-container">
      <div className="page-header-with-back">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/client/rooms")}
        >
          ← Back
        </button>
        <h2>Add New Room</h2>
      </div>

      <div className="form-group">
        <label htmlFor="roomType">Room Type *</label>
        <select
          id="roomType"
          name="roomType"
          value={room.roomType}
          onChange={handleChange}
          className="input"
        >
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="suite">Suite</option>
          <option value="classroom">Classroom</option>
          <option value="meeting_room">Meeting Room</option>
          <option value="private_office">Private Office</option>
          <option value="coworking">Coworking</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="capacity">Capacity (People) *</label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            placeholder="e.g., 10"
            min="1"
            value={room.capacity}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="basePrice">Base Price ($/hour) *</label>
          <input
            id="basePrice"
            name="basePrice"
            type="number"
            step="1"
            min="0"
            placeholder="e.g., 25"
            value={room.basePrice}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={room.status}
          onChange={handleChange}
          className="input"
        >
          <option value="available">Available</option>
          <option value="maintenance">Maintenance</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe the room features, location, or any special notes..."
          value={room.description}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="features-section">
        <h3>Room Features</h3>
        <div className="features-grid">
          <label className="feature-checkbox">
            <input
              type="checkbox"
              name="hasWhiteboard"
              checked={room.hasWhiteboard}
              onChange={handleChange}
            />
            <span>📋 Whiteboard</span>
          </label>
          <label className="feature-checkbox">
            <input
              type="checkbox"
              name="hasWifi"
              checked={room.hasWifi}
              onChange={handleChange}
            />
            <span>📶 Wi-Fi</span>
          </label>
          <label className="feature-checkbox">
            <input
              type="checkbox"
              name="hasProjector"
              checked={room.hasProjector}
              onChange={handleChange}
            />
            <span>📽️ Projector</span>
          </label>
          <label className="feature-checkbox">
            <input
              type="checkbox"
              name="hasTV"
              checked={room.hasTV}
              onChange={handleChange}
            />
            <span>📺 TV</span>
          </label>
          <label className="feature-checkbox">
            <input
              type="checkbox"
              name="hasAC"
              checked={room.hasAC}
              onChange={handleChange}
            />
            <span>❄️ AC</span>
          </label>
        </div>
      </div>

      <button type="submit" className="btn-primary">Create Room</button>
    </form>
  );
};
export default AddRoom;
