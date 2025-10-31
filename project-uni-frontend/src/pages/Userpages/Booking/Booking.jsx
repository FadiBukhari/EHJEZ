import { useEffect, useState, useCallback } from "react";
import RoomCard from "../../../components/RoomCard/RoomCard";
import "./Booking.scss";
import API from "../../../services/api";

const Booking = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [priceFilter, setPriceFilter] = useState("none");
  const [studyHouseFilter, setStudyHouseFilter] = useState("all");
  const [studyHouses, setStudyHouses] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await API.get("/rooms/all");
      setRooms(res.data);
      setFilteredRooms(res.data);

      // Extract unique study house names (owner usernames)
      const uniqueHouses = [
        ...new Set(
          res.data.map((room) => room.owner?.username).filter(Boolean)
        ),
      ];
      setStudyHouses(uniqueHouses.sort());
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...rooms];

    // Filter by study house
    if (studyHouseFilter !== "all") {
      filtered = filtered.filter(
        (room) => room.owner?.username === studyHouseFilter
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
  }, [rooms, priceFilter, studyHouseFilter]);

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
            <label htmlFor="studyHouseFilter">Study House:</label>
            <select
              id="studyHouseFilter"
              value={studyHouseFilter}
              onChange={(e) => setStudyHouseFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Study Houses</option>
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
        {filteredRooms.length > 0 ? (
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
