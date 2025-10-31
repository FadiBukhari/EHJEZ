import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import "./Dashboard.scss";

const ClientDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get("/client/stats");
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="client-dashboard">
      <h1>Client Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚪</div>
          <div className="stat-content">
            <h3>{stats?.totalRooms || 0}</h3>
            <p>Total Rooms</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats?.totalBookings || 0}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button
            className="action-btn primary"
            onClick={() => navigate("/client/rooms")}
          >
            Manage Rooms
          </button>
          <button
            className="action-btn secondary"
            onClick={() => navigate("/client/rooms/new")}
          >
            Add New Room
          </button>
          <button
            className="action-btn tertiary"
            onClick={() => navigate("/client/bookings")}
          >
            View Bookings
          </button>
        </div>
      </div>

      <div className="recent-bookings">
        <h2>Recent Bookings</h2>
        {stats?.recentBookings && stats.recentBookings.length > 0 ? (
          <div className="bookings-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Room</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>#{booking.id}</td>
                    <td>{booking.customer?.username}</td>
                    <td>{booking.room?.roomNumber}</td>
                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                    <td>
                      {booking.checkInTime} - {booking.checkOutTime}
                    </td>
                    <td>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-bookings">
            <p>No recent bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
