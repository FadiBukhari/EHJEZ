// pages/Client/NewRoomPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import "./AddRoom.scss";
const AddRoom = () => {
  const navigate = useNavigate();
  const [room, setRoom] = useState({
    roomNumber: "",
    roomType: "single",
    capacity: "",
    basePrice: "",
    status: "available",
    description: "",
  });

  const handleChange = (e) =>
    setRoom({ ...room, [e.target.name]: e.target.value });

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
        <h2 className="text-xl font-bold">Add New Room</h2>
      </div>
      <input
        name="roomNumber"
        placeholder="Room Number"
        value={room.roomNumber}
        onChange={handleChange}
        required
        className="input"
      />

      <select
        name="roomType"
        value={room.roomType}
        onChange={handleChange}
        className="input"
      >
        <option value="single">Single</option>
        <option value="double">Double</option>
        <option value="suite">Suite</option>
      </select>

      <input
        name="capacity"
        type="number"
        placeholder="Capacity"
        min="1"
        value={room.capacity}
        onChange={handleChange}
        required
        className="input"
      />

      <input
        name="basePrice"
        type="number"
        step="0.01"
        min="0"
        placeholder="Base Price"
        value={room.basePrice}
        onChange={handleChange}
        required
        className="input"
      />

      <select
        name="status"
        value={room.status}
        onChange={handleChange}
        className="input"
      >
        <option value="available">Available</option>
        <option value="maintenance">Maintenance</option>
        <option value="inactive">Inactive</option>
      </select>

      <textarea
        name="description"
        placeholder="Description"
        value={room.description}
        onChange={handleChange}
        className="input"
      />

      <button className="btn-primary w-full">Create Room</button>
    </form>
  );
};
export default AddRoom;
