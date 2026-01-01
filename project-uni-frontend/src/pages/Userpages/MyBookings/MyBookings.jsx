import { useEffect, useState } from "react";
import "./MyBookings.scss";
import API from "../../../services/api";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import ReviewModal from "../../../components/ReviewModal";

const MyBookings = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewableBookings, setReviewableBookings] = useState({});

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/bookings/my");
      setRooms(res.data);

      // Check which bookings can be reviewed
      const reviewableStatus = {};
      for (const booking of res.data) {
        try {
          const canReviewRes = await API.get(`/reviews/can-review/${booking.id}`);
          reviewableStatus[booking.id] = canReviewRes.data;
        } catch {
          reviewableStatus[booking.id] = { canReview: false };
        }
      }
      setReviewableBookings(reviewableStatus);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error("Failed to load bookings. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleReviewClick = (booking) => {
    setSelectedBooking(booking);
    setReviewModalOpen(true);
  };

  const handleReviewSubmitted = () => {
    // Refresh the reviewable status
    fetchBookings();
  };

  const canReview = (bookingId) => {
    return reviewableBookings[bookingId]?.canReview === true;
  };

  const hasReviewed = (bookingId) => {
    return reviewableBookings[bookingId]?.review !== undefined;
  };

  const getExistingReview = (bookingId) => {
    return reviewableBookings[bookingId]?.review;
  };

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
                {room.room?.client?.user?.username && (
                  <p className="study-house-name">
                    <strong>📍 Study House:</strong>{" "}
                    {room.room.client.user.username}
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

                {/* Review Section */}
                <div className="review-section">
                  {canReview(room.id) && (
                    <button
                      className="review-btn"
                      onClick={() => handleReviewClick(room)}
                    >
                      <FaStar /> Leave a Review
                    </button>
                  )}
                  {hasReviewed(room.id) && (
                    <div className="reviewed-badge">
                      <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={star <= getExistingReview(room.id)?.rating ? "filled" : ""}
                          />
                        ))}
                      </div>
                      <span>Reviewed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-bookings">
            <p>No bookings found.</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        booking={selectedBooking}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};
export default MyBookings;
