import "./RoomCard.scss";
const RoomCard = ({ room }) => {
  return (
    <>
      <div className="room-card">
        <img className="room-card-img" src={`${room.img}`} />
        <div className="room-card-details">
          <span className="room-card-title">{`${room.name}`}</span>
          <span>Price:{`${room.price}`}</span>
          <span>Room capacity:{`${room.capacity}`}</span>
          <span>Room type:{`${room.type}`}</span>
        </div>
        <button>Book now</button>
      </div>
    </>
  );
};
export default RoomCard;
