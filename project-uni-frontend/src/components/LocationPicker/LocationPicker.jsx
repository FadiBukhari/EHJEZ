import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./LocationPicker.scss";
import PropTypes from "prop-types";

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom marker icon for selected location
const locationIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234C4DDC'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

MapClickHandler.propTypes = {
  onLocationSelect: PropTypes.func.isRequired,
};

const LocationPicker = ({
  initialLat,
  initialLng,
  onLocationChange,
  onClose,
}) => {
  const [position, setPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([31.9454, 35.9284]); // Default: Amman, Jordan
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    // If initial coordinates provided, use them
    if (initialLat && initialLng) {
      const lat = parseFloat(initialLat);
      const lng = parseFloat(initialLng);
      if (!isNaN(lat) && !isNaN(lng)) {
        setPosition({ lat, lng });
        setMapCenter([lat, lng]);
      }
    }
  }, [initialLat, initialLng]);

  const handleLocationSelect = (latlng) => {
    setPosition(latlng);
  };

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setPosition({ lat, lng });
        setMapCenter([lat, lng]);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(
          "Unable to get your current location. Please select manually on the map."
        );
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const handleSave = () => {
    if (!position) {
      alert("Please select a location on the map");
      return;
    }
    onLocationChange(position.lat, position.lng);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="location-picker-overlay">
      <div className="location-picker-container">
        <div className="location-picker-header">
          <h3>📍 Select Your Location</h3>
          <button className="close-btn" onClick={handleCancel}>
            ✕
          </button>
        </div>

        <div className="location-picker-instructions">
          <p>
            Click on the map to set your study house location, or use your
            current location.
          </p>
          <button
            className="current-location-btn"
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
          >
            {isGettingLocation
              ? "Getting location..."
              : "📍 Use My Current Location"}
          </button>
        </div>

        <div className="location-picker-map">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ width: "100%", height: "100%" }}
            ref={mapRef}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onLocationSelect={handleLocationSelect} />
            {position && (
              <Marker
                position={[position.lat, position.lng]}
                icon={locationIcon}
              />
            )}
          </MapContainer>
        </div>

        {position && (
          <div className="location-picker-coordinates">
            <div className="coordinate-item">
              <span className="label">Latitude:</span>
              <span className="value">{position.lat.toFixed(6)}</span>
            </div>
            <div className="coordinate-item">
              <span className="label">Longitude:</span>
              <span className="value">{position.lng.toFixed(6)}</span>
            </div>
          </div>
        )}

        <div className="location-picker-actions">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={!position}
          >
            Save Location
          </button>
        </div>
      </div>
    </div>
  );
};

LocationPicker.propTypes = {
  initialLat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialLng: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onLocationChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LocationPicker;
