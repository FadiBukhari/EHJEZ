import { useEffect, useState } from "react";
import "./MyBookings.scss";
import API from "../../../services/api";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import ReviewModal from "../../../components/ReviewModal";
import { getStudyhouseLogo } from "../../../utils/StudyhouseLogos";

const MyBookings = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewableBookings, setReviewableBookings] = useState({});
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // New filter for status

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (roomTypeFilter) {
        params.roomType = roomTypeFilter;
      }
      const res = await API.get("/bookings/my", { params });
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
  }, [roomTypeFilter]);

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

  // Check if booking has ended
  const hasBookingEnded = (booking) => {
    const bookingDate = new Date(booking.date);
    const [hours, minutes] = booking.checkOutTime.split(':');
    bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const now = new Date();
    return now > bookingDate;
  };

  // Filter bookings by status
  const filteredBookings = rooms.filter((booking) => {
    if (statusFilter === "all") return true;
    return booking.status === statusFilter;
  });

  // Group bookings by status for display
  const pendingBookings = filteredBookings.filter((b) => b.status === "pending");
  const approvedBookings = filteredBookings.filter((b) => b.status === "approved");
  const declinedBookings = filteredBookings.filter((b) => b.status === "declined");
  const cancelledBookings = filteredBookings.filter((b) => b.status === "cancelled");

  return (
    <div className="mybooking-container">
      <div className="mybooking-title">
        <h1>My Bookings</h1>
      </div>
      
      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="roomType">Filter by Room Type:</label>
          <select
            id="roomType"
            value={roomTypeFilter}
            onChange={(e) => setRoomTypeFilter(e.target.value)}
            className="room-type-filter"
          >
            <option value="">All Room Types</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
            <option value="classroom">Classroom</option>
            <option value="meeting_room">Meeting Room</option>
            <option value="private_office">Private Office</option>
            <option value="coworking">Coworking</option>
          </select>
        </div>
      </div>

      {/* Booking Summary Stats */}
      {!loading && statusFilter === "all" && (
        <div className="booking-stats">
          <div className="stat-card pending-stat">
            <span className="stat-number">{pendingBookings.length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card approved-stat">
            <span className="stat-number">{approvedBookings.length}</span>
            <span className="stat-label">Approved</span>
          </div>
          <div className="stat-card declined-stat">
            <span className="stat-number">{declinedBookings.length}</span>
            <span className="stat-label">Declined</span>
          </div>
          <div className="stat-card cancelled-stat">
            <span className="stat-number">{cancelledBookings.length}</span>
            <span className="stat-label">Cancelled</span>
          </div>
        </div>
      )}

      <div className="mybooking-content">
        {loading ? (
          <p className="loading-text">Loading bookings...</p>
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map((room) => (
            <div className="booking-card" key={room.id}>
              <img 
                src={getStudyhouseLogo(room.room?.client?.user?.username)} 
                alt={room.room?.client?.user?.username || "Room"} 
                className="booked-img-room"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = "/small1.png"; // Fallback to default image
                }}
              />
              <div className="booking-card-content">
                <h3 className="booking-room-title">
                  {room.room?.roomType?.replace(/_/g, " ") || "Room"}
                </h3>
                {room.room?.client?.user?.username && (
                  <p className="study-house-name">
                    <strong>📍</strong> {room.room.client.user.username}
                  </p>
                )}
                
                {/* Room Amenities */}
                {room.room && (
                  <div className="room-amenities">
                    {room.room.hasWifi && <span className="amenity">📶 WiFi</span>}
                    {room.room.hasAC && <span className="amenity">❄️ AC</span>}
                    {room.room.hasProjector && <span className="amenity">📽️ Projector</span>}
                    {room.room.hasWhiteboard && <span className="amenity">📋 Whiteboard</span>}
                    {room.room.hasTV && <span className="amenity">📺 TV</span>}
                  </div>
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
                  {room.status === "approved" && !hasBookingEnded(room) && (
                    <div className="review-pending-message">
                      <span className="clock-icon">🕐</span>
                      <span>You can leave a review after your booking ends</span>
                    </div>
                  )}
                  {room.status === "approved" && hasBookingEnded(room) && canReview(room.id) && (
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
