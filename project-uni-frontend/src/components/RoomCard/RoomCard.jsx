import { useNavigate } from "react-router-dom";
import "./RoomCard.scss";
const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const handleBookNow = () => {
    navigate(`/book/${room.id}`, { state: { room } });
  };
  return (
    <>
      <div className="room-card">
        <img className="room-card-img" src="/profile.svg" />
        <div className="room-card-details">
          <span className="room-card-title">{`${room.roomType}`}</span>
          <span>Price:{`${room.basePrice}`}</span>
          <span>Room capacity:{`${room.capacity}`}</span>
        </div>
        <button onClick={handleBookNow}>Book now</button>
      </div>
    </>
  );
};
export default RoomCard;
