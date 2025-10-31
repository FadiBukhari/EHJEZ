import { useState } from "react";
import "./EditRoom.scss";
import API from "../../../services/api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditRoom = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const room = state?.room || {};
  const [price, setPrice] = useState(room.basePrice || "");
  const [capacity, setCapacity] = useState(room.capacity || "");
  const [description, setDescription] = useState(room.description || "");
  const [roomType, setRoomType] = useState(room.roomType || "single");
  const navigate = useNavigate();

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
      basePrice: parseFloat(price),
      capacity: parseInt(capacity),
      description,
    };
    API.put(`/rooms/${id}`, roomData)
      .then((response) => {
        console.log("Room updated successfully:", response.data);
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
      .then((response) => {
        console.log("Room removed successfully:", response.data);
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
          </select>
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
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
