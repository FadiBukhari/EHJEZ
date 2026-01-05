import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import RoomCard from "../../../components/RoomCard/RoomCard";
import "./Booking.scss";
import API from "../../../services/api";

const Booking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [priceFilter, setPriceFilter] = useState("none");
  const [studyHouseFilter, setStudyHouseFilter] = useState(
    searchParams.get("studyhouse") || "all"
  );
  const [roomTypeFilter, setRoomTypeFilter] = useState("all");
  const [studyHouses, setStudyHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await API.get("/rooms/all");
      setRooms(res.data);
      setFilteredRooms(res.data);

      // Extract unique study house names (client usernames)
      const uniqueHouses = [
        ...new Set(
          res.data.map((room) => room.client?.user?.username).filter(Boolean)
        ),
      ];
      setStudyHouses(uniqueHouses.sort());
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setError("Failed to load rooms. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...rooms];

    // Filter by study house
    if (studyHouseFilter !== "all") {
      filtered = filtered.filter(
        (room) => room.client?.user?.username === studyHouseFilter
      );
    }

    // Filter by room type
    if (roomTypeFilter !== "all") {
      filtered = filtered.filter(
        (room) => room.roomType === roomTypeFilter
      );
    }

    // Sort by price
    if (priceFilter === "low-to-high") {
      filtered.sort(
        (a, b) => parseFloat(a.basePrice) - parseFloat(b.basePrice)
      );
    } else if (priceFilter === "high-to-low") {
      filtered.sort(
        (a, b) => parseFloat(b.basePrice) - parseFloat(a.basePrice)
      );
    }

    setFilteredRooms(filtered);

    // Update URL params
    if (studyHouseFilter !== "all") {
      setSearchParams({ studyhouse: studyHouseFilter });
    } else {
      setSearchParams({});
    }
  }, [rooms, priceFilter, studyHouseFilter, roomTypeFilter, setSearchParams]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="booking-page">
      <div className="search-container">
        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="priceFilter">Sort by Price:</label>
            <select
              id="priceFilter"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="filter-select"
            >
              <option value="none">Default</option>
              <option value="low-to-high">Low to High</option>
              <option value="high-to-low">High to Low</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="roomTypeFilter">Room Type:</label>
            <select
              id="roomTypeFilter"
              value={roomTypeFilter}
              onChange={(e) => setRoomTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
              <option value="classroom">Classroom</option>
              <option value="meeting_room">Meeting Room</option>
              <option value="private_office">Private Office</option>
              <option value="coworking">Coworking</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="studyHouseFilter">Venue:</label>
            <select
              id="studyHouseFilter"
              value={studyHouseFilter}
              onChange={(e) => setStudyHouseFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Venues</option>
              {studyHouses.map((house) => (
                <option key={house} value={house}>
                  {house}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-stats">
            <span className="results-count">
              {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""}{" "}
              found
            </span>
          </div>
        </div>
      </div>

      <div className="booking-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading rooms...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchRooms} className="retry-btn">
              Try Again
            </button>
          </div>
        ) : filteredRooms.length > 0 ? (
          filteredRooms.map((room) => <RoomCard key={room.id} room={room} />)
        ) : (
          <div className="no-rooms">
            {rooms.length === 0
              ? "No rooms available"
              : "No rooms match your filters"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
