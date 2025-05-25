import { useEffect, useState } from "react";
import RoomCard from "../../../components/RoomCard/RoomCard";
import "./Booking.scss";
import API from "../../../services/api";
const Booking = () => {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    try {
      API.get("/rooms/all").then((res) => {
        console.log("Rooms fetched:", res.data);
        setRooms(res.data);
      });
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  }, []);
  console.log("Rooms state:", rooms);
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
            <option value="single">Single</option>
            <option value="suite">Suite</option>
          </select>
        </div>
      </div>
      <div className="booking-container">
        {rooms.length > 0 ? (
          rooms.map((room) => <RoomCard room={room} />)
        ) : (
          <div className="no-rooms">No rooms available</div>
        )}
      </div>
    </div>
  );
};
export default Booking;
