import { useEffect, useState } from "react";
import API from "../../../services/api";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import AlertModal from "../../../components/AlertModal/AlertModal";

import "./Bookings.scss";
const Bookings = () => {
  const [bookings, setbookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    API.get("rooms/bookedowned").then((res) => {
      setbookings(res.data);
    });
  };

  const handleDeleteClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await API.delete(`/bookings/${selectedBookingId}`);
      setAlertConfig({
        title: "Success",
        message: "Booking deleted successfully!",
        type: "success",
      });
      setShowAlert(true);
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      setAlertConfig({
        title: "Error",
        message:
          error.response?.data?.message ||
          "Failed to delete booking. Please try again.",
        type: "error",
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bookings-container">
        <h1>Manage Bookings</h1>
        <table className="booking-table">
          <thead className="booking-table-header">
            <tr>
              <th style={{ padding: "10px 30px" }}>Booking ID</th>
              <th style={{ padding: "10px 30px" }}>Room</th>
              <th style={{ padding: "10px 30px" }}>Date</th>
              <th style={{ padding: "10px 30px" }}>Check-in Time</th>
              <th style={{ padding: "10px 30px" }}>Check-out Time</th>
              <th style={{ padding: "10px 30px" }}>Status</th>
              <th style={{ padding: "10px 30px" }}>Customer</th>
              <th style={{ padding: "10px 30px" }}>Contact</th>
              <th style={{ padding: "10px 30px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="booking-record">
                  <td>{booking.id}</td>
                  <td>{booking.room?.roomNumber || "N/A"}</td>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>{booking.checkInTime}</td>
                  <td>{booking.checkOutTime}</td>
                  <td>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>{booking.customer?.username || "N/A"}</td>
                  <td>{booking.customer?.phoneNumber || "N/A"}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(booking.id)}
                      disabled={loading}
                      title="Delete Booking"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        confirmText="Delete"
        type="danger"
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
export default Bookings;
