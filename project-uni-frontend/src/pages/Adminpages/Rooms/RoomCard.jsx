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
      <img src="/profile.svg" />
      <div>{type}</div>
      <div>{description}</div>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};
export default RoomCard;
