import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import "./Clients.scss";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await API.get("/admin/clients");
      setClients(response.data.clients || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (clientId, clientName) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${clientName}? This action cannot be undone.`
      )
    ) {
      try {
        await API.delete(`/admin/clients/${clientId}`);
        alert("Client deleted successfully");
        fetchClients(); // Refresh list
      } catch (error) {
        console.error("Error deleting client:", error);
        alert(
          error.response?.data?.message ||
            "Failed to delete client. They may have active bookings."
        );
      }
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phoneNumber?.includes(searchTerm)
  );

  if (loading) {
    return <div className="clients-loading">Loading...</div>;
  }

  return (
    <div className="clients-page">
      <div className="clients-header">
        <h1>Manage Clients</h1>
        <button
          className="add-client-btn"
          onClick={() => navigate("/admin/clients/new")}
        >
          + Add New Client
        </button>
      </div>

      <div className="clients-controls">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="clients-count">
          Showing {filteredClients.length} of {clients.length} clients
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="no-clients">
          <p>No clients found</p>
        </div>
      ) : (
        <div className="clients-table-wrapper">
          <table className="clients-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Operating Hours</th>
                <th>Rooms</th>
                <th>Bookings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>#{client.id}</td>
                  <td className="client-name">{client.username}</td>
                  <td>{client.email}</td>
                  <td>{client.phoneNumber || "N/A"}</td>
                  <td>
                    {client.openingHours && client.closingHours
                      ? `${client.openingHours} - ${client.closingHours}`
                      : "Not set"}
                  </td>
                  <td className="text-center">{client.roomCount || 0}</td>
                  <td className="text-center">{client.bookingCount || 0}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() =>
                          navigate(`/admin/clients/${client.id}/edit`)
                        }
                        title="Edit Client"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(client.id, client.username)}
                        title="Delete Client"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Clients;
