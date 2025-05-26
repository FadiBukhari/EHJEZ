import { useEffect, useState } from "react";
import API from "../../../services/api";

import "./Bookings.scss";
const Bookings = () => {
  const [bookings, setbookings] = useState([]);
  useEffect(() => {
    API.get("rooms/bookedowned").then((res) => {
      setbookings(res.data);
    });
  }, []);
  console.log(bookings);
  return (
    <table className="booking-table">
      <thead className="booking-table-header">
        <tr>
          <th style={{ padding: "10px 30px" }}>Booking ID</th>
          <th style={{ padding: "10px 30px" }}>Date</th>
          <th style={{ padding: "10px 30px" }}>Check-in Time</th>
          <th style={{ padding: "10px 30px" }}>Check-out Time</th>
          <th style={{ padding: "10px 30px" }}>Status</th>
          <th style={{ padding: "10px 30px" }}>Contact</th>
        </tr>
      </thead>
      <tbody>
        {bookings.length === 0 ? (
          <tr>
            <td colSpan="5" style={{ textAlign: "center" }}>
              No bookings found.
            </td>
          </tr>
        ) : (
          bookings.map((booking) => (
            <tr key={booking.id} className="booking-record">
              <td>{booking.id}</td>
              <td>{booking.date}</td>
              <td>{booking.checkInTime}</td>
              <td>{booking.checkOutTime}</td>
              <td>{booking.status}</td>
              <td>{booking.customer.phoneNumber}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
export default Bookings;
