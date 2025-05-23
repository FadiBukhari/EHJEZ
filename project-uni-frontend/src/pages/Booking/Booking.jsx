import RoomCard from "../../components/RoomCard/RoomCard";
import "./Booking.scss";
const Booking = () => {
  const room1 = {
    name: "Room 1",
    price: 100,
    img: "small1.png",
    available: true,
    capacity: 2,
    type: "Deluxe",
  };
  return (
    <div className="booking-page">
      <div className="search-container">
        <div className="search-container-input">
          <input type="text" placeholder="Search" className="search" />
          <button className="search-button">Search</button>
        </div>
        <div className="search-container-filters">
          <select>
            <option value="all">All</option>
            <option value="deluxe">Deluxe</option>
            <option value="standard">Standard</option>
          </select>
          <select>
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="not-available">Not Available</option>
          </select>
        </div>
      </div>
      <div className="booking-container">
        <RoomCard room={room1} />
        <RoomCard room={room1} />
        <RoomCard room={room1} />
        <RoomCard room={room1} />
        <RoomCard room={room1} />
        <RoomCard room={room1} />
        <RoomCard room={room1} />
        <RoomCard room={room1} />
        <RoomCard room={room1} />
        <RoomCard room={room1} />
        <RoomCard room={room1} />
        <RoomCard room={room1} />
        <RoomCard room={room1} />
        <RoomCard room={room1} />
      </div>
    </div>
  );
};
export default Booking;
