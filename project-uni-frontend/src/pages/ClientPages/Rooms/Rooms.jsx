// pages/Client/MyRooms.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../services/api";
import "./Rooms.scss";
import RoomCard from "./RoomCard";
function Rooms() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    API.get("/rooms/owned")
      .then((res) => setRooms(res.data))
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  };

  const handleRoomDeleted = (deletedRoomId) => {
    // Remove the deleted room from the list
    setRooms(rooms.filter((room) => room.id !== deletedRoomId));
  };

  return (
    <div className="adminrooms">
      <div className="newroom">
        <span className="newroom-title">Rooms</span>
        <button
          className="newroom-button"
          onClick={() => navigate("/client/rooms/new")}
        >
          + New Room
        </button>
      </div>
      <div className="rooms-table">
        {rooms.length === 0 ? (
          <div className="no-rooms">No rooms found</div>
        ) : (
          rooms.map((room) => (
            <RoomCard
              key={room.id}
              id={room.id}
              type={room.roomType}
              description={room.description}
              price={room.basePrice}
              capacity={room.capacity}
              status={room.status}
              hasWhiteboard={room.hasWhiteboard}
              hasWifi={room.hasWifi}
              hasProjector={room.hasProjector}
              hasTV={room.hasTV}
              hasAC={room.hasAC}
              onDelete={handleRoomDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Rooms;
