import { useNavigate } from "react-router-dom";
import "./RoomCard.scss";
import { getRoomLogo } from "../../utils/StudyhouseLogos";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const handleBookNow = () => {
    navigate(`/book/${room.id}`, { state: { room } });
  };

  // Get the study house logo for this room
  const roomLogo = getRoomLogo(room);

  // Format room type for better display
  const formatRoomType = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get room features
  const getFeatures = () => {
    const features = [];
    if (room.hasWhiteboard) features.push("Whiteboard");
    if (room.hasWifi) features.push("Wi-Fi");
    if (room.hasProjector) features.push("Projector");
    if (room.hasTV) features.push("TV");
    if (room.hasAC) features.push("AC");
    return features;
  };

  const features = getFeatures();

  return (
    <>
      <div className="room-card-user">
        <img
          className="room-card-user-img"
          src={roomLogo}
          alt={`${room.client?.user?.username || "Study House"} logo`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/small1.png";
          }}
        />
        <div className="room-card-user-details">
          <h3 className="room-card-title">
            {room.client?.user?.username || "Study House"}
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
          {room.client?.openingHours && room.client?.closingHours && (
            <div className="room-info hours">
              <span className="info-label">🕐 Hours:</span>
              <span className="info-value">
                {room.client.openingHours} - {room.client.closingHours}
              </span>
            </div>
          )}
          {features.length > 0 && (
            <div className="room-features">
              {features.map((feature, index) => (
                <span key={index} className="feature-tag">
                  ✓ {feature}
                </span>
              ))}
            </div>
          )}
          <div className="room-price">
            <span className="price-label">Price:</span>
            <span className="price-value">${parseFloat(room.basePrice) || 0}</span>
            <span className="price-period">/hour</span>
          </div>
        </div>
        <button onClick={handleBookNow}>Book Now</button>
      </div>
    </>
  );
};

export default RoomCard;
