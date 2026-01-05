import { useState, useEffect } from "react";
import "./EditRoom.scss";
import API from "../../../services/api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [roomType, setRoomType] = useState("single");
  const [status, setStatus] = useState("available");
  const [features, setFeatures] = useState({
    hasWhiteboard: false,
    hasWifi: false,
    hasProjector: false,
    hasTV: false,
    hasAC: false,
  });

  // Fetch room data on mount
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await API.get(`/rooms/${id}`);
        const room = response.data;
        setPrice(parseFloat(room.basePrice) || "");
        setCapacity(room.capacity || "");
        setDescription(room.description || "");
        setRoomType(room.roomType || "single");
        setStatus(room.status || "available");
        setFeatures({
          hasWhiteboard: room.hasWhiteboard || false,
          hasWifi: room.hasWifi || false,
          hasProjector: room.hasProjector || false,
          hasTV: room.hasTV || false,
          hasAC: room.hasAC || false,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching room:", error);
        toast.error("Failed to load room data");
        navigate("/client/rooms");
      }
    };
    fetchRoom();
  }, [id, navigate]);

  const handleFeatureChange = (e) => {
    const { name, checked } = e.target;
    setFeatures({ ...features, [name]: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!price || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!capacity || capacity <= 0) {
      toast.error("Please enter a valid capacity");
      return;
    }

    const roomData = {
      roomType,
      status,
      basePrice: parseFloat(price),
      capacity: parseInt(capacity),
      description,
      ...features,
    };
    API.put(`/rooms/${id}`, roomData)
      .then(() => {
        toast.success("Room updated successfully");
        navigate("/client/rooms");
      })
      .catch((error) => {
        console.error("Error updating room:", error);
      });
  };
  const handleRemove = () => {
    if (!window.confirm("Are you sure you want to remove this room?")) {
      return;
    }
    API.delete(`/rooms/${id}`)
      .then(() => {
        toast.success("Room removed successfully");
        navigate("/client/rooms");
      })
      .catch((error) => {
        console.error("Error removing room:", error);
      });
  };
  const handleCancel = () => {
    navigate("/client/rooms");
  };

  if (loading) {
    return (
      <div className="edit-room-page">
        <div className="loading">Loading room data...</div>
      </div>
    );
  }

  return (
    <div className="edit-room-page">
      <div className="edit-room-header">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/client/rooms")}
        >
          ← Back
        </button>
        <h1>Edit Room</h1>
        <button onClick={handleRemove}>Remove Room</button>
      </div>
      <form className="edit-room-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Room Type</label>
          <select
            id="roomType"
            name="roomType"
            required
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
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
        <div className="form-group">
          <label>Room Status</label>
          <select
            id="status"
            name="status"
            required
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            id="price"
            name="price"
            step="1"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <label>Capacity</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            min="1"
            required
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </div>
        <div className="form-group desc">
          <label>Description</label>
          <textarea
            type="text"
            id="description"
            name="description"
            className="desc-input"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group features">
          <label>Room Features</label>
          <div className="features-grid">
            <label className="feature-checkbox">
              <input
                type="checkbox"
                name="hasWhiteboard"
                checked={features.hasWhiteboard}
                onChange={handleFeatureChange}
              />
              <span>Whiteboard</span>
            </label>
            <label className="feature-checkbox">
              <input
                type="checkbox"
                name="hasWifi"
                checked={features.hasWifi}
                onChange={handleFeatureChange}
              />
              <span>Wi-Fi</span>
            </label>
            <label className="feature-checkbox">
              <input
                type="checkbox"
                name="hasProjector"
                checked={features.hasProjector}
                onChange={handleFeatureChange}
              />
              <span>Projector</span>
            </label>
            <label className="feature-checkbox">
              <input
                type="checkbox"
                name="hasTV"
                checked={features.hasTV}
                onChange={handleFeatureChange}
              />
              <span>TV</span>
            </label>
            <label className="feature-checkbox">
              <input
                type="checkbox"
                name="hasAC"
                checked={features.hasAC}
                onChange={handleFeatureChange}
              />
              <span>AC</span>
            </label>
          </div>
        </div>
        <div className="last-buttons">
          <button type="submit" className="submit-button">
            Update Room
          </button>
          <button
            type="button"
            className="submit-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditRoom;
