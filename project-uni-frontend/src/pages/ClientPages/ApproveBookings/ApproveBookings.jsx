import { useEffect, useState } from "react";
import API from "../../../services/api";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import AlertModal from "../../../components/AlertModal/AlertModal";
import "./ApproveBookings.scss";

const ApproveBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [action, setAction] = useState(null); // 'approve' or 'decline'
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const fetchPendingBookings = async () => {
    try {
      const res = await API.get("rooms/bookedowned");
      // Filter only pending bookings
      const pendingBookings = res.data.filter(
        (booking) => booking.status === "pending"
      );
      setBookings(pendingBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setAlertConfig({
        title: "Error",
        message: "Failed to fetch pending bookings. Please try again.",
        type: "error",
      });
      setShowAlert(true);
    }
  };

  const handleApproveClick = (booking) => {
    setSelectedBooking(booking);
    setAction("approve");
    setShowConfirm(true);
  };

  const handleDeclineClick = (booking) => {
    setSelectedBooking(booking);
    setAction("decline");
    setShowConfirm(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedBooking || !action) return;

    setLoading(true);
    setShowConfirm(false);

    try {
      const newStatus = action === "approve" ? "approved" : "declined";
      await API.put(`/bookings/${selectedBooking.id}/status`, {
        status: newStatus,
      });

      setAlertConfig({
        title: "Success",
        message: `Booking ${
          action === "approve" ? "approved" : "declined"
        } successfully!`,
        type: "success",
      });
      setShowAlert(true);
      fetchPendingBookings();
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      setAlertConfig({
        title: "Error",
        message:
          error.response?.data?.message ||
          `Failed to ${action} booking. Please try again.`,
        type: "error",
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
      setSelectedBooking(null);
      setAction(null);
    }
  };

  const getConfirmModalConfig = () => {
    if (action === "approve") {
      return {
        title: "Approve Booking",
        message: `Are you sure you want to approve this booking request from ${
          selectedBooking?.customer?.username || "this customer"
        }?`,
        confirmText: "Approve",
        type: "success",
      };
    }
    return {
      title: "Decline Booking",
      message: `Are you sure you want to decline this booking request from ${
        selectedBooking?.customer?.username || "this customer"
      }?`,
      confirmText: "Decline",
      type: "danger",
    };
  };

  return (
    <>
      <div className="approve-bookings-container">
        <div className="header">
          <h1>Approve Booking Requests</h1>
          <p className="subtitle">
            Review and manage pending booking requests for your rooms
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h2>No Pending Bookings</h2>
            <p>There are currently no booking requests waiting for approval.</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3>Booking #{booking.id}</h3>
                  <span className="status-badge pending">Pending</span>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span className="label">Room:</span>
                    <span className="value">
                      {booking.room?.roomNumber || "N/A"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Customer:</span>
                    <span className="value">
                      {booking.customer?.username || "N/A"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Contact:</span>
                    <span className="value">
                      {booking.customer?.phoneNumber || "N/A"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">
                      {booking.customer?.email || "N/A"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Date:</span>
                    <span className="value">
                      {new Date(booking.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Time:</span>
                    <span className="value">
                      {booking.checkInTime} - {booking.checkOutTime}
                    </span>
                  </div>
                  {booking.room?.price && (
                    <div className="detail-row">
                      <span className="label">Price:</span>
                      <span className="value price">${booking.room.price}</span>
                    </div>
                  )}
                </div>

                <div className="booking-actions">
                  <button
                    className="approve-btn"
                    onClick={() => handleApproveClick(booking)}
                    disabled={loading}
                  >
                    ✓ Approve
                  </button>
                  <button
                    className="decline-btn"
                    onClick={() => handleDeclineClick(booking)}
                    disabled={loading}
                  >
                    ✕ Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmAction}
        {...getConfirmModalConfig()}
      />

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </>
  );
};

export default ApproveBookings;
