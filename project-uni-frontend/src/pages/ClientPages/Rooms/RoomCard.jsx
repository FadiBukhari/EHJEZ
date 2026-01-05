import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../../services/api";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import AlertModal from "../../../components/AlertModal/AlertModal";
import "./RoomCard.scss";

const RoomCard = ({ 
  id, 
  type, 
  description, 
  price, 
  capacity, 
  status,
  hasWhiteboard,
  hasWifi,
  hasProjector,
  hasTV,
  hasAC,
  onDelete 
}) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "info",
  });
  const [showBookingConfirm, setShowBookingConfirm] = useState(false);
  const [bookingErrorMsg, setBookingErrorMsg] = useState("");

  const handleEdit = () => {
    navigate(`/client/rooms/edit/${id}`);
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/rooms/${id}`);
      setAlertConfig({
        title: "Success",
        message: "Room deleted successfully!",
        type: "success",
      });
      setShowAlert(true);
      if (onDelete) onDelete(id);
    } catch (error) {
      console.error("Error deleting room:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete room";
      const activeBookings = error.response?.data?.activeBookings;

      if (activeBookings) {
        setBookingErrorMsg(errorMsg);
        setShowBookingConfirm(true);
      } else {
        setAlertConfig({
          title: "Error",
          message: errorMsg,
          type: "error",
        });
        setShowAlert(true);
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleViewBookings = () => {
    navigate("/client/bookings");
  };

  return (
    <>
      <div className="roomcard-admin">
        <img src="/small1.png" className="img-roomcard" alt={type} />
        <div className="room-card-details">
          <div className="room-header">
            <h3 className="room-card-type">{type.replace(/_/g, " ")}</h3>
            <span className={`room-status-badge status-${status}`}>
              {status === "available" && "✅ Available"}
              {status === "maintenance" && "🔧 Maintenance"}
              {status === "inactive" && "⏸️ Inactive"}
            </span>
          </div>
          {description && (
            <p className="room-card-description">{description}</p>
          )}
          <div className="room-card-info-container">
            <div className="info-item">
              <span className="info-icon">💵</span>
              <div className="info-content">
                <span className="info-label">Price</span>
                <span className="info-value">${parseFloat(price) || 0}/hour</span>
              </div>
            </div>
            <div className="info-divider">•</div>
            <div className="info-item">
              <span className="info-icon">👥</span>
              <div className="info-content">
                <span className="info-label">Capacity</span>
                <span className="info-value">
                  {capacity} {capacity === 1 ? "Person" : "People"}
                </span>
              </div>
            </div>
          </div>
          
          {/* Room Features */}
          <div className="room-features">
            {hasWifi && (
              <span className="feature-badge" title="WiFi Available">
                📶 WiFi
              </span>
            )}
            {hasTV && (
              <span className="feature-badge" title="TV Available">
                📺 TV
              </span>
            )}
            {hasProjector && (
              <span className="feature-badge" title="Projector Available">
                📽️ Projector
              </span>
            )}
            {hasWhiteboard && (
              <span className="feature-badge" title="Whiteboard Available">
                📋 Whiteboard
              </span>
            )}
            {hasAC && (
              <span className="feature-badge" title="Air Conditioning">
                ❄️ AC
              </span>
            )}
          </div>
        </div>
        <div className="room-card-actions">
          <button onClick={handleEdit} className="roomcard-button edit-btn">
            ✏️ Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className="roomcard-button delete-btn"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "🗑️ Delete"}
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Room"
        message="Are you sure you want to delete this room? If there are active bookings, you must delete them first."
        confirmText="Delete"
        type="danger"
      />

      <ConfirmModal
        isOpen={showBookingConfirm}
        onClose={() => setShowBookingConfirm(false)}
        onConfirm={handleViewBookings}
        title="Cannot Delete Room"
        message={`${bookingErrorMsg}\n\nWould you like to view and delete the bookings for this room?`}
        confirmText="View Bookings"
        cancelText="Cancel"
        type="warning"
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
export default RoomCard;
