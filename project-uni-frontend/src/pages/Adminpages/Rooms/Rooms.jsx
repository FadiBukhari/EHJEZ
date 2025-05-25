// pages/Admin/MyRooms.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../services/api";
import "./Rooms.scss";
import RoomCard from "./RoomCard";
function Rooms() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    API.get("/rooms/owned").then((res) => setRooms(res.data));
  }, []);
  console.log("Rooms fetched:", rooms);

  return (
    <div className="adminrooms">
      <div className="newroom">
        <span className="newroom-title">Rooms</span>
        <button
          className="newroom-button"
          onClick={() => navigate("/admin/rooms/new")}
        >
          + New Room
        </button>
      </div>
      <div className="rooms-table">
        {!rooms ? (
          <div>No rooms found</div>
        ) : (
          rooms?.map((room) => (
            <RoomCard
              key={room.id}
              id={room.id}
              type={room.roomType}
              description={room.description}
              price={room.basePrice}
              capacity={room.capacity}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Rooms;
