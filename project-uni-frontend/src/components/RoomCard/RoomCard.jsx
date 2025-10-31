import { useNavigate } from "react-router-dom";
import "./RoomCard.scss";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const handleBookNow = () => {
    navigate(`/book/${room.id}`, { state: { room } });
  };

  // Format room type for better display
  const formatRoomType = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <div className="room-card-user">
        <img
          className="room-card-user-img"
          src="/small1.png"
          alt={`${room.roomType} room`}
        />
        <div className="room-card-user-details">
          <h3 className="room-card-title">
            {room.owner?.username || "Study House"}
          </h3>
          <div className="room-info">
            <span className="info-label">Room Type:</span>
            <span className="info-value">{formatRoomType(room.roomType)}</span>
          </div>
          <div className="room-info">
            <span className="info-label">Capacity:</span>
            <span className="info-value">
              {room.capacity} {room.capacity === 1 ? "Person" : "People"}
            </span>
          </div>
          {room.owner?.address && (
            <div className="room-info location">
              <span className="info-label">📍</span>
              <span className="info-value">{room.owner.address}</span>
            </div>
          )}
          {room.owner?.openingHours && room.owner?.closingHours && (
            <div className="room-info hours">
              <span className="info-label">🕐 Hours:</span>
              <span className="info-value">
                {room.owner.openingHours} - {room.owner.closingHours}
              </span>
            </div>
          )}
          <div className="room-price">
            <span className="price-label">Price:</span>
            <span className="price-value">${room.basePrice}</span>
            <span className="price-period">/hour</span>
          </div>
        </div>
        <button onClick={handleBookNow}>Book Now</button>
      </div>
    </>
  );
};

export default RoomCard;
