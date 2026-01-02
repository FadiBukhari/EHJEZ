// pages/BookRoom/BookRoom.jsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import "./BookRoom.scss";
import { toast } from "react-toastify";
import API from "../../../services/api";
import { getRoomLogo } from "../../../utils/StudyhouseLogos";

const BookRoom = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const { state } = useLocation();
  const room = useMemo(() => state?.room || {}, [state?.room]);

  // Duration options in hours
  const durationOptions = [1, 2, 3, 4, 5, 6];

  // Generate next 7 days for easy date selection
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const next7Days = getNext7Days();

  // Format date for display
  const formatDay = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  const formatDate = (date) => {
    return date.getDate();
  };

  const formatMonth = (date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[date.getMonth()];
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  // Calculate check-out time based on start time and duration
  const getCheckOutTime = () => {
    if (!selectedStartTime) return null;
    const [hour] = selectedStartTime.split(":").map(Number);
    const endHour = hour + selectedDuration;
    return `${endHour.toString().padStart(2, "0")}:00`;
  };

  // Calculate total price
  const totalPrice = selectedDuration * (room.basePrice || 0);

  // Fetch booked times for the selected date
  useEffect(() => {
    if (!room || !room.id) {
      toast.error("Room information not available");
      navigate("/booking");
      return;
    }

    const fetchBookedTimes = async () => {
      try {
        const response = await API.get(`/rooms/${roomId}/availability`);
        const bookingsData = response.data.bookedSlots || [];

        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const day = String(selectedDate.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;

        const dayBookings = bookingsData.filter((booking) => {
          const bookingDate = booking.date.split("T")[0];
          return (
            bookingDate === dateString &&
            (booking.status === "pending" || booking.status === "approved")
          );
        });

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

  // Generate available time slots based on client's hours
  useEffect(() => {
    if (room.client && room.client.openingHours && room.client.closingHours) {
      const openTime = room.client.openingHours;
      const closeTime = room.client.closingHours;

      const openHour = parseInt(openTime.split(":")[0]);
      const closeHour = parseInt(closeTime.split(":")[0]);

      const slots = [];
      
      // Handle overnight hours (e.g., 08:00 to 03:00 means open until 3 AM next day)
      if (closeHour <= openHour) {
        // Overnight: from openHour to midnight, then midnight to closeHour
        for (let hour = openHour; hour < 24; hour++) {
          const timeSlot = `${hour.toString().padStart(2, "0")}:00`;
          slots.push(timeSlot);
        }
        for (let hour = 0; hour < closeHour; hour++) {
          const timeSlot = `${hour.toString().padStart(2, "0")}:00`;
          slots.push(timeSlot);
        }
      } else {
        // Normal hours: from openHour to closeHour
        for (let hour = openHour; hour < closeHour; hour++) {
          const timeSlot = `${hour.toString().padStart(2, "0")}:00`;
          slots.push(timeSlot);
        }
      }

      setAvailableTimes(slots);
    }
  }, [room]);

  // Reset start time when date changes
  useEffect(() => {
    setSelectedStartTime(null);
  }, [selectedDate]);

  // Check if a time slot is booked
  const isTimeBooked = (time) => {
    return bookedSlots.some((booking) => {
      const bookingStart = booking.checkInTime?.slice(0, 5);
      const bookingEnd = booking.checkOutTime?.slice(0, 5);
      const currentTime = time.slice(0, 5);
      return currentTime >= bookingStart && currentTime < bookingEnd;
    });
  };

  // Check if a duration is valid (doesn't overlap with existing bookings)
  const isDurationValid = (duration) => {
    if (!selectedStartTime) return true;
    
    const [startHour] = selectedStartTime.split(":").map(Number);
    const endHour = startHour + duration;
    
    // Check if it goes past closing time (handle overnight hours)
    if (room.client?.closingHours) {
      const closeHour = parseInt(room.client.closingHours.split(":")[0]);
      const openHour = parseInt(room.client.openingHours?.split(":")[0] || "0");
      
      // For overnight hours (e.g., 08:00 to 03:00)
      if (closeHour <= openHour) {
        // If start is before midnight, can go up to 24 + closeHour
        if (startHour >= openHour) {
          if (endHour > 24 + closeHour) return false;
        } else {
          // Start is after midnight (e.g., 01:00), can only go up to closeHour
          if (endHour > closeHour) return false;
        }
      } else {
        // Normal hours
        if (endHour > closeHour) return false;
      }
    }
    
    // Check if any hour in the range is booked
    for (let h = startHour; h < endHour; h++) {
      const normalizedHour = h % 24;
      const timeSlot = `${normalizedHour.toString().padStart(2, "0")}:00`;
      if (isTimeBooked(timeSlot)) return false;
    }
    
    return true;
  };

  // Check if start time is in the past (for today)
  const isTimePast = (time) => {
    if (!isToday(selectedDate)) return false;
    const now = new Date();
    const [hour] = time.split(":").map(Number);
    return hour <= now.getHours();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStartTime) {
      toast.error("Please select a start time");
      return;
    }

    const checkOut = getCheckOutTime();

    try {
      await API.post("/bookings/", {
        id: parseInt(roomId),
        date: selectedDate,
        checkInTime: selectedStartTime,
        checkOutTime: checkOut,
        totalPrice: totalPrice,
      });
      toast.success("Booking request submitted successfully!");
      navigate(`/payment/${roomId}`, {
        state: { 
          room, 
          selectedDate, 
          checkIn: selectedStartTime, 
          checkOut, 
          totalPrice,
          hours: selectedDuration 
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Booking failed.");
    }
  };

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
        <h2>Book a Room</h2>
      </div>

      {/* Room Info Card */}
      <div className="room-info-card">
        <img 
          src={getRoomLogo(room)} 
          alt={`${room.client?.user?.username || 'Study House'} logo`} 
          className="room-thumb"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/small1.png";
          }}
        />
        <div className="room-info-text">
          <h3>{room.client?.user?.username || "Study House"}</h3>
          <p className="room-type">{room.roomType} • {room.capacity} people</p>
          <p className="room-price">${room.basePrice}<span>/hour</span></p>
        </div>
      </div>

      {/* Step 1: Select Date */}
      <div className="booking-step">
        <div className="step-header">
          <span className="step-number">1</span>
          <h3>Select Date</h3>
        </div>
        <div className="date-selector">
          {next7Days.map((date, index) => (
            <button
              key={index}
              type="button"
              className={`date-btn ${isSameDay(date, selectedDate) ? "selected" : ""} ${isToday(date) ? "today" : ""}`}
              onClick={() => setSelectedDate(date)}
            >
              <span className="day-name">{isToday(date) ? "Today" : formatDay(date)}</span>
              <span className="day-number">{formatDate(date)}</span>
              <span className="month-name">{formatMonth(date)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Select Time */}
      <div className="booking-step">
        <div className="step-header">
          <span className="step-number">2</span>
          <h3>Select Start Time</h3>
          <button
            type="button"
            className="refresh-btn-small"
            onClick={() => setRefreshKey((prev) => prev + 1)}
            title="Refresh availability"
          >
            🔄
          </button>
        </div>
        <div className="time-selector">
          {availableTimes.length > 0 ? (
            availableTimes.map((time) => {
              const booked = isTimeBooked(time);
              const past = isTimePast(time);
              const disabled = booked || past;
              
              return (
                <button
                  key={time}
                  type="button"
                  className={`time-btn ${selectedStartTime === time ? "selected" : ""} ${booked ? "booked" : ""} ${past ? "past" : ""}`}
                  onClick={() => !disabled && setSelectedStartTime(time)}
                  disabled={disabled}
                >
                  {time}
                  {booked && <span className="booked-label">Booked</span>}
                </button>
              );
            })
          ) : (
            <p className="no-times">Operating hours not available</p>
          )}
        </div>
      </div>

      {/* Step 3: Select Duration */}
      <div className="booking-step">
        <div className="step-header">
          <span className="step-number">3</span>
          <h3>Select Duration</h3>
        </div>
        <div className="duration-selector">
          {durationOptions.map((duration) => {
            const valid = isDurationValid(duration);
            return (
              <button
                key={duration}
                type="button"
                className={`duration-btn ${selectedDuration === duration ? "selected" : ""} ${!valid ? "disabled" : ""}`}
                onClick={() => valid && setSelectedDuration(duration)}
                disabled={!valid}
              >
                {duration} {duration === 1 ? "Hour" : "Hours"}
                <span className="duration-price">${(duration * room.basePrice).toFixed(0)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Booking Summary */}
      {selectedStartTime && (
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <div className="summary-row">
            <span>Date</span>
            <span>{selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
          </div>
          <div className="summary-row">
            <span>Time</span>
            <span>{selectedStartTime} - {getCheckOutTime()}</span>
          </div>
          <div className="summary-row">
            <span>Duration</span>
            <span>{selectedDuration} {selectedDuration === 1 ? "hour" : "hours"}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Book Button */}
      <button
        type="button"
        className="book-btn"
        onClick={handleSubmit}
        disabled={!selectedStartTime}
      >
        {selectedStartTime 
          ? `Book Now - $${totalPrice.toFixed(2)}` 
          : "Select a time to continue"}
      </button>
    </div>
  );
};

export default BookRoom;
