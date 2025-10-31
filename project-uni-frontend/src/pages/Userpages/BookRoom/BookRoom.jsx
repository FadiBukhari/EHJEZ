// pages/BookRoom/BookRoom.jsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookRoom.scss";
import { toast } from "react-toastify";
import API from "../../../services/api";

const BookRoom = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [checkIn, setCheckIn] = useState("14:00");
  const [checkOut, setCheckOut] = useState("11:00");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // Used to force refresh
  const { state } = useLocation();
  const room = useMemo(() => state?.room || {}, [state?.room]);

  // Calculate hours and total price
  const calculateHoursAndPrice = () => {
    if (!checkIn || !checkOut || checkIn >= checkOut) {
      return { hours: 0, totalPrice: 0 };
    }

    const [inHour, inMin] = checkIn.split(":").map(Number);
    const [outHour, outMin] = checkOut.split(":").map(Number);

    const totalMinutes = outHour * 60 + outMin - (inHour * 60 + inMin);
    const hours = totalMinutes / 60;
    const totalPrice = hours * (room.basePrice || 0);

    return { hours, totalPrice };
  };

  const { hours, totalPrice } = calculateHoursAndPrice();

  // Fetch booked times for the selected date
  useEffect(() => {
    // Early return if no room data
    if (!room || !room.id) {
      toast.error("Room information not available");
      navigate("/booking");
      return;
    }

    const fetchBookedTimes = async () => {
      try {
        // Use the new availability endpoint instead of bookings
        const response = await API.get(`/rooms/${roomId}/availability`);
        // Backend returns { room, bookedSlots }
        const bookingsData = response.data.bookedSlots || [];

        console.log("All booked slots:", bookingsData); // Debug

        // Filter bookings for the selected date
        // Use local date string to avoid timezone issues
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const day = String(selectedDate.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;

        console.log("Selected date string:", dateString); // Debug

        const dayBookings = bookingsData.filter((booking) => {
          // booking.date is already in "YYYY-MM-DD" format from backend
          const bookingDate = booking.date.split("T")[0]; // Handle both "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ss"
          console.log("Comparing:", bookingDate, "with", dateString); // Debug
          return (
            bookingDate === dateString &&
            (booking.status === "pending" || booking.status === "approved")
          );
        });

        console.log("Bookings for selected date:", dayBookings); // Debug
        setBookedSlots(dayBookings);
      } catch (error) {
        console.error("Error fetching availability:", error);
        toast.error("Could not load room availability");
        setBookedSlots([]);
      }
    };

    if (roomId && room.id) {
      fetchBookedTimes();
    }
  }, [roomId, selectedDate, room, navigate, refreshKey]);

  // Refetch bookings when the page becomes visible (e.g., user returns from payment)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setRefreshKey((prev) => prev + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Generate available time slots based on owner's hours
  useEffect(() => {
    if (room.owner && room.owner.openingHours && room.owner.closingHours) {
      const openTime = room.owner.openingHours; // e.g., "08:00:00"
      const closeTime = room.owner.closingHours; // e.g., "22:00:00"

      const openHour = parseInt(openTime.split(":")[0]);
      const closeHour = parseInt(closeTime.split(":")[0]);

      const slots = [];
      for (let hour = openHour; hour < closeHour; hour++) {
        const timeSlot = `${hour.toString().padStart(2, "0")}:00`;
        slots.push(timeSlot);
      }

      setAvailableTimes(slots);
    }
  }, [room]);

  // Check if a time slot is booked
  const isTimeBooked = (time) => {
    const result = bookedSlots.some((booking) => {
      // Normalize time formats (remove seconds if present)
      const bookingStart = booking.checkInTime?.slice(0, 5); // "14:00:00" -> "14:00"
      const bookingEnd = booking.checkOutTime?.slice(0, 5); // "16:00:00" -> "16:00"
      const currentTime = time.slice(0, 5); // Ensure time is also "HH:MM" format

      // Check if current time falls within the booking range
      const isBooked = currentTime >= bookingStart && currentTime < bookingEnd;

      if (isBooked) {
        console.log(`Time ${time} is booked: ${bookingStart} - ${bookingEnd}`);
      }

      return isBooked;
    });
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate checkout time is after checkin time
    if (checkIn >= checkOut) {
      toast.error("Check-out time must be after check-in time");
      return;
    }

    // Calculate hours and price
    const { hours, totalPrice } = calculateHoursAndPrice();

    if (hours <= 0) {
      toast.error("Invalid booking duration");
      return;
    }

    try {
      await API.post("/bookings/", {
        id: parseInt(roomId),
        date: selectedDate,
        checkInTime: checkIn,
        checkOutTime: checkOut,
        totalPrice: totalPrice,
      });
      toast.success("Booking request submitted successfully!");
      navigate(`/payment/${roomId}`, {
        state: { room, selectedDate, checkIn, checkOut, totalPrice, hours },
      });
    } catch (err) {
      console.error(err);
      toast.error("Booking failed.");
    }
  };

  // Return null if no room data (after hooks)
  if (!room || !room.id) {
    return null;
  }

  return (
    <div className="booking-form">
      <div className="booking-header-with-back">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/booking")}
        >
          ← Back
        </button>
        <h2>Book Room #{roomId}</h2>
      </div>
      <div className="book-room-details">
        <img src="/small1.png" alt="Logoz" className="booking-logo" />
        <p className="book-description">
          <strong>Room Type:</strong> {room.roomType || "Single"}
          <br />
          <strong>Description:</strong>{" "}
          {room.description || "No description available."}
          <br />
          <strong>Base Price:</strong> ${room.basePrice || "0"}
          <br />
          <strong>Capacity:</strong> {room.capacity || "1 person"}
          <br />
          <strong>Status:</strong> {room.status || "Available"}
          <br />
          <strong>Operating Hours:</strong>{" "}
          {room.owner?.openingHours?.slice(0, 5) || "N/A"} -{" "}
          {room.owner?.closingHours?.slice(0, 5) || "N/A"}
        </p>
      </div>

      {availableTimes.length > 0 && (
        <div className="available-times-section">
          <div className="times-header">
            <h3>Available Times for {selectedDate.toLocaleDateString()}</h3>
            <button
              type="button"
              className="refresh-btn"
              onClick={() => setRefreshKey((prev) => prev + 1)}
              title="Refresh availability"
            >
              🔄 Refresh
            </button>
          </div>
          <div className="time-slots-grid">
            {availableTimes.map((time) => {
              const booked = isTimeBooked(time);
              return (
                <div
                  key={time}
                  className={`time-slot ${booked ? "booked" : "available"}`}
                  title={booked ? "This time is already booked" : "Available"}
                >
                  <span className="time">{time}</span>
                  <span className="status-indicator">
                    {booked ? "❌" : "✓"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="legend">
            <div className="legend-item">
              <span className="legend-indicator available">✓</span>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator booked">❌</span>
              <span>Booked</span>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="booking-form-fields">
        <div className="input-book-box">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="input-book"
            minDate={new Date()}
          />
        </div>
        <div className="input-book-box">
          <label>Check-in Time:</label>
          <input
            type="time"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
            className="input-book"
          />
        </div>
        <div className="input-book-box">
          {" "}
          <label>Check-out Time:</label>
          <input
            type="time"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
            className="input-book"
          />
        </div>

        {hours > 0 && (
          <div className="price-summary">
            <div className="price-calculation">
              <span className="calc-label">Duration:</span>
              <span className="calc-value">
                {hours} {hours === 1 ? "hour" : "hours"}
              </span>
            </div>
            <div className="price-calculation">
              <span className="calc-label">Rate:</span>
              <span className="calc-value">${room.basePrice}/hour</span>
            </div>
            <div className="price-total">
              <span className="total-label">Total Price:</span>
              <span className="total-value">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        <button type="submit" disabled={hours <= 0}>
          Book
        </button>
      </form>
    </div>
  );
};

export default BookRoom;
