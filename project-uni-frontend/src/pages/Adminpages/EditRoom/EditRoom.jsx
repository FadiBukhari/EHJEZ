import { useState } from "react";
import "./EditRoom.scss";
import API from "../../../services/api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
const EditRoom = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const room = state?.room || {};
  console.log("Room data:", state);
  const [price, setPrice] = useState(room.price || "");
  const [capacity, setCapacity] = useState(room.capacity || "");
  const [description, setDescription] = useState(room.description || "");
  const [roomType, setRoomType] = useState(room.roomType || "single");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const roomData = {
      roomType,
      basePrice: price,
      capacity,
      description,
    };
    API.put(`/rooms/${id}`, roomData)
      .then((response) => {
        console.log("Room updated successfully:", response.data);
        navigate("/admin/rooms");
      })
      .catch((error) => {
        console.error("Error updating room:", error);
      });
  };
  const handleRemove = () => {
    API.delete(`/rooms/${id}`)
      .then((response) => {
        console.log("Room removed successfully:", response.data);
        navigate("/admin/rooms");
      })
      .catch((error) => {
        console.error("Error removing room:", error);
      });
  };
  const handleCancel = () => {
    navigate("/admin/rooms");
  };
  return (
    <div className="edit-room-page">
      <div className="edit-room-header">
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
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <label>Capacity</label>
          <input
            type="number"
            id="price"
            name="price"
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
          <button
            type="submit"
            className="submit-button"
            onClick={handleCancel}
          >
            Update Room
          </button>
          <button className="submit-button">Cancel</button>
        </div>
      </form>
    </div>
  );
};
export default EditRoom;
