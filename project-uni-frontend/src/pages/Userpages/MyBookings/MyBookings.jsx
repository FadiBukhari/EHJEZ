import { useEffect, useState } from "react";
import "./MyBookings.scss";
import API from "../../../services/api";
import { toast } from "react-toastify";

const MyBookings = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await API.get("/bookings/my");
        setRooms(res.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        if (error.response?.status !== 401 && error.response?.status !== 403) {
          toast.error("Failed to load bookings. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="mybooking-container">
      <div className="mybooking-title">
        <h1>My Bookings</h1>
      </div>
      <div className="mybooking-content">
        {loading ? (
          <p className="loading-text">Loading bookings...</p>
        ) : rooms.length > 0 ? (
          rooms.map((room) => (
            <div className="booking-card" key={room.id}>
              <img src="/small1.png" alt="Room" className="booked-img-room" />
              <div className="booking-card-content">
                <h3 className="booking-room-title">
                  {room.room?.roomType?.replace(/_/g, " ") || "Study Room"}
                </h3>
                {room.room?.owner?.username && (
                  <p className="study-house-name">
                    <strong>📍 Study House:</strong> {room.room.owner.username}
                  </p>
                )}
                <div className="booking-info-grid">
                  <div className="booking-info">
                    <span className="info-icon">📅</span>
                    <div>
                      <span className="info-label">Date</span>
                      <span className="info-value">
                        {new Date(room.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="booking-info">
                    <span className="info-icon">🕐</span>
                    <div>
                      <span className="info-label">Check-in</span>
                      <span className="info-value">{room.checkInTime}</span>
                    </div>
                  </div>
                  <div className="booking-info">
                    <span className="info-icon">🕐</span>
                    <div>
                      <span className="info-label">Check-out</span>
                      <span className="info-value">{room.checkOutTime}</span>
                    </div>
                  </div>
                  <div className="booking-info highlight">
                    <span className="info-icon">💵</span>
                    <div>
                      <span className="info-label">Total Price</span>
                      <span className="info-value price">
                        ${room.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
                {room.status && (
                  <div className={`booking-status status-${room.status}`}>
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-bookings">
            <p>No bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default MyBookings;
