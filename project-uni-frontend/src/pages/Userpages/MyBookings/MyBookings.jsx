import { useEffect, useState } from "react";
import "./MyBookings.scss";
import API from "../../../services/api";
const MyBookings = () => {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    try {
      API.get("/bookings/my").then((res) => {
        console.log("My bookings fetched:", res.data);
        setRooms(res.data);
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, []);
  return (
    <div className="mybooking-container">
      <h2>My Bookings</h2>
      <div className="mybooking-content">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div className="booking-card" key={room.id}>
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

        <img src="/profile.svg" alt="No bookings" width={300} />
      </div>
    </div>
  );
};
export default MyBookings;
