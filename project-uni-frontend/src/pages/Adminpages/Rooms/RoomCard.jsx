import { Link } from "react-router-dom";
import "./RoomCard.scss";
const RoomCard = ({ id, type, description }) => {
  return (
    <div className="roomcard-admin">
      <img src="/profile.svg" />
      <div>{type}</div>
      {/* <div>{Owner}</div> */}
      <div>{description}</div>
      <Link to={`admins/rooms/edit/${id}`}>Edit</Link>
    </div>
  );
};
export default RoomCard;
