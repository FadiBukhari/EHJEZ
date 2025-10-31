import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import "./Dashboard.scss";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get("/admin/stats");
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
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>{stats?.totalClients || 0}</h3>
            <p>Total Clients</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats?.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button
            className="action-btn primary"
            onClick={() => navigate("/admin/clients")}
          >
            Manage Clients
          </button>
          <button
            className="action-btn secondary"
            onClick={() => navigate("/admin/clients/new")}
          >
            Add New Client
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
