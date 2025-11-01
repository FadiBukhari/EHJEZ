import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./StudyHouseMap.scss";
import { toast } from "react-toastify";
import API from "../../../services/api";
import { getUserLocation } from "../../../utils/geolocation";
import { sortByDistance, formatDistance } from "../../../utils/distance";
import { useNavigate } from "react-router-dom";

// Fix Leaflet default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom icon for user location
const userIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234C4DDC'%3E%3Ccircle cx='12' cy='12' r='8'/%3E%3Ccircle cx='12' cy='12' r='4' fill='white'/%3E%3C/svg%3E",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

// Custom icon for study houses
const studyHouseIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E74C3C'%3E%3Cpath d='M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z'/%3E%3Ctext x='12' y='16' text-anchor='middle' fill='white' font-size='12' font-weight='bold'%3E📚%3C/text%3E%3C/svg%3E",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Component to recenter map when user location changes
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

const StudyHouseMap = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [studyHouses, setStudyHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [mapCenter, setMapCenter] = useState([31.9454, 35.9284]); // Default: Amman, Jordan
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("distance");
  const [radiusFilter, setRadiusFilter] = useState(100); // km
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHouse, setSelectedHouse] = useState(null);

  // Request user location on mount
  useEffect(() => {
    let isMounted = true;

    const requestLocation = async () => {
      try {
        const location = await getUserLocation();
        if (isMounted) {
          setUserLocation(location);
          // Keep map centered on Amman by default - don't auto-center on user
        }
      } catch (error) {
        console.error("Location error:", error);
      }
    };

    requestLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch study houses from API
  useEffect(() => {
    const fetchStudyHouses = async () => {
      try {
        setLoading(true);
        const response = await API.get("/rooms/all");

        // Extract unique clients (study house owners) with their locations
        const clientsMap = new Map();

        response.data.forEach((room) => {
          if (room.client && room.client.latitude && room.client.longitude) {
            const clientId = room.client.user?.id;

            if (!clientsMap.has(clientId)) {
              clientsMap.set(clientId, {
                id: clientId,
                username: room.client.user?.username || "Study House",
                latitude: parseFloat(room.client.latitude),
                longitude: parseFloat(room.client.longitude),
                openingHours: room.client.openingHours,
                closingHours: room.client.closingHours,
                roomCount: 1,
              });
            } else {
              // Increment room count
              const client = clientsMap.get(clientId);
              client.roomCount += 1;
            }
          }
        });

        const houses = Array.from(clientsMap.values());
        setStudyHouses(houses);
        setFilteredHouses(houses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching study houses:", error);
        toast.error("Failed to load study houses");
        setLoading(false);
      }
    };

    fetchStudyHouses();
  }, []);

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    let result = [...studyHouses];

    // Search filter
    if (searchQuery) {
      result = result.filter((house) =>
        house.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Calculate distances and sort if user location available
    if (userLocation) {
      result = sortByDistance(result, userLocation.lat, userLocation.lng);

      // Radius filter (100 means "All")
      if (radiusFilter < 100) {
        result = result.filter((house) => house.distance <= radiusFilter);
      }
      // If radiusFilter === 100, show all houses (no filtering)
    }

    // Apply sorting
    if (sortBy === "name") {
      result.sort((a, b) => a.username.localeCompare(b.username));
    }
    // distance sorting already applied above if userLocation exists

    setFilteredHouses(result);
  }, [studyHouses, userLocation, sortBy, radiusFilter, searchQuery]);

  const handleViewRooms = () => {
    navigate("/booking");
  };

  const isOpen = (openingHours, closingHours) => {
    if (!openingHours || !closingHours) return null;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const opening = openingHours.slice(0, 5);
    const closing = closingHours.slice(0, 5);

    return currentTime >= opening && currentTime < closing;
  };

  if (loading) {
    return (
      <div className="map-loading">
        <div className="spinner"></div>
        <p>Loading study houses...</p>
      </div>
    );
  }

  return (
    <div className="study-house-map-container">
      {/* Sidebar with filters and list */}
      <div className="map-sidebar">
        <div className="sidebar-header">
          <h2>📍 Find Study Houses</h2>
          <p className="subtitle">
            {filteredHouses.length}{" "}
            {filteredHouses.length === 1 ? "location" : "locations"} found
          </p>
        </div>

        {/* Search and Filters */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by study house name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="distance">Distance</option>
                <option value="name">Name</option>
              </select>
            </div>

            {userLocation && (
              <div className="filter-group">
                <label>
                  Radius: {radiusFilter < 100 ? `${radiusFilter}km` : "All"}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={radiusFilter}
                  onChange={(e) => setRadiusFilter(Number(e.target.value))}
                  className="radius-slider"
                />
              </div>
            )}
          </div>
        </div>

        {/* Study Houses List */}
        <div className="study-houses-list">
          {filteredHouses.length === 0 ? (
            <div className="no-results">
              <p>No study houses found matching your criteria.</p>
            </div>
          ) : (
            filteredHouses.map((house) => {
              const openStatus = isOpen(house.openingHours, house.closingHours);

              return (
                <div
                  key={house.id}
                  className={`study-house-card ${
                    selectedHouse?.id === house.id ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedHouse(house);
                    setMapCenter([house.latitude, house.longitude]);
                  }}
                >
                  <div className="card-header">
                    <h3>{house.username}</h3>
                    {openStatus !== null && (
                      <span
                        className={`status-badge ${
                          openStatus ? "open" : "closed"
                        }`}
                      >
                        {openStatus ? "🟢 Open" : "🔴 Closed"}
                      </span>
                    )}
                  </div>

                  <div className="card-info">
                    {house.distance && (
                      <span className="distance">
                        📏 {formatDistance(house.distance)}
                      </span>
                    )}
                    <span className="room-count">
                      🚪 {house.roomCount}{" "}
                      {house.roomCount === 1 ? "room" : "rooms"}
                    </span>
                  </div>

                  {house.openingHours && house.closingHours && (
                    <p className="hours">
                      🕐 {house.openingHours.slice(0, 5)} -{" "}
                      {house.closingHours.slice(0, 5)}
                    </p>
                  )}

                  <button
                    className="view-rooms-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewRooms();
                    }}
                  >
                    View Rooms
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Map View */}
      <div className="map-view">
        <MapContainer
          center={mapCenter}
          zoom={13}
          className="leaflet-map"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapRecenter center={mapCenter} />

          {/* User location marker */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            >
              <Popup>
                <div className="popup-content">
                  <strong>📍 You are here</strong>
                  <p>Your current location</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Study house markers */}
          {filteredHouses.map((house) => (
            <Marker
              key={house.id}
              position={[house.latitude, house.longitude]}
              icon={studyHouseIcon}
              eventHandlers={{
                click: () => setSelectedHouse(house),
              }}
            >
              <Popup>
                <div className="popup-content">
                  <h4>{house.username}</h4>
                  {house.distance && (
                    <p>📏 {formatDistance(house.distance)} away</p>
                  )}
                  <p>
                    🚪 {house.roomCount}{" "}
                    {house.roomCount === 1 ? "room" : "rooms"} available
                  </p>
                  {house.openingHours && house.closingHours && (
                    <p>
                      🕐 {house.openingHours.slice(0, 5)} -{" "}
                      {house.closingHours.slice(0, 5)}
                    </p>
                  )}
                  <button
                    className="popup-btn"
                    onClick={() => handleViewRooms()}
                  >
                    View Rooms →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {!userLocation && (
          <div className="location-prompt">
            <p>💡 Enable location to see distances and sort by proximity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyHouseMap;
