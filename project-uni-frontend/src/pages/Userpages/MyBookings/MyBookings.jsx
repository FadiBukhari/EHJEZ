import { useEffect, useState } from "react";
import "./MyBookings.scss";
import API from "../../../services/api";
const MyBookings = () => {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    try {
      API.get("/bookings/my").then((res) => {
        setRooms(res.data);
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, []);
  return (
    <div className="mybooking-container">
      <h2 className="mybooking-title">My Bookings</h2>
      <div className="mybooking-content">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div className="booking-card" key={room.id}>
              <img src="/small1.png" width={300} className="booked-img-room" />
              <h3>Room #{room.id}</h3>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(room.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Check-in:</strong> {room.checkInTime}
              </p>
              <p>
                <strong>Check-out:</strong> {room.checkOutTime}
              </p>
              <p>
                <strong>Total Price:</strong> ${room.totalPrice}
              </p>
            </div>
          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </div>
  );
};
export default MyBookings;
