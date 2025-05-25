// pages/BookRoom/BookRoom.jsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookRoom.scss";
import { toast } from "react-toastify";
import API from "../../../services/api";

const BookRoom = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [checkIn, setCheckIn] = useState("14:00");
  const [checkOut, setCheckOut] = useState("11:00");
  const { state } = useLocation();
  const room = state?.room || {};
  console.log("Room details:", room);
  if (!room) navigate("/");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/bookings", {
        roomId,
        date: selectedDate,
        checkIn,
        checkOut,
      });
      toast.success("Room booked successfully!");
      navigate("/my-bookings");
    } catch (err) {
      console.error(err);
      toast.error("Booking failed.");
    }
  };

  return (
    <div className="booking-form">
      <h2>Book Room #{roomId}</h2>
      <div className="book-room-details">
        <img
          src="/profile.svg"
          alt="Logoz"
          width={300}
          className="booking-logo"
        />
        <p className="book-description">
          <strong>Room Type:</strong> {room.roomType || "Single"}
          <br />
          <strong>Description:</strong>{" "}
          {room.description || "No description available."}
          <br />
          <strong>Base Price:</strong> ${room.basePrice || "0"}
          <br />
          <strong>Capacity:</strong> {room.capacity || "1 person"}
          <br />
          <strong>Status:</strong> {room.status || "Available"}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="booking-form-fields">
        <div className="input-book-box">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="input-book"
          />
        </div>
        <div className="input-book-box">
          <label>Check-in Time:</label>
          <input
            type="time"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
            className="input-book"
          />
        </div>
        <div className="input-book-box">
          {" "}
          <label>Check-out Time:</label>
          <input
            type="time"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
            className="input-book"
          />
        </div>

        <button type="submit">Book</button>
      </form>
    </div>
  );
};

export default BookRoom;
