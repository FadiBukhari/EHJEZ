import { Link, useNavigate } from "react-router-dom";
import "./RoomCard.scss";
const RoomCard = ({ id, type, description, price, capacity }) => {
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate(`/admins/rooms/edit/${id}`, {
      state: { room: { id, type, description, price, capacity } },
    });
  };
  return (
    <div className="roomcard-admin">
      <img src="/small1.png" className="img-roomcard" />
      <div className="room-card-details">
        <div className="room-card-type">{type}</div>
        <div className="room-card-description">
          {description}asdfasdfasdfaasdgasdgasdgasd afhashfasfhadhfad
          ahashasdgasdfasdf
        </div>
      </div>
      <div>
        <button onClick={handleEdit} className="roomcard-button">
          Edit
        </button>
      </div>
    </div>
  );
};
export default RoomCard;
