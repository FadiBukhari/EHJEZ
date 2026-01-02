const { Room, Booking, User, Client } = require("../models");
const { Op } = require("sequelize");

// Get client-specific statistics
exports.getClientStats = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id; // Get from authenticated user

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token" });
    }

    // Get the client profile
    const client = await Client.findOne({
      where: { userId },
    });

    if (!client) {
      return res.status(404).json({ message: "Client profile not found" });
    }

    // Total rooms owned by this client
    const totalRooms = await Room.count({
      where: { clientId: client.id },
    });

    // Get all room IDs for this client
    const clientRooms = await Room.findAll({
      where: { clientId: client.id },
      attributes: ["id"],
    });
    const roomIds = clientRooms.map((r) => r.id);

    // Total bookings for this client's rooms
    const totalBookings = await Booking.count({
      where: {
        roomId: { [Op.in]: roomIds },
      },
    });

    // Recent bookings for this client's rooms
    const recentBookings = await Booking.findAll({
      where: {
        roomId: { [Op.in]: roomIds },
      },
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Room,
          as: "room",
          attributes: ["roomNumber", "roomType"],
        },
        {
          model: User,
          as: "customer",
          attributes: ["username", "email"],
        },
      ],
    });

    res.json({
      totalRooms,
      totalBookings,
      recentBookings,
    });
  } catch (err) {
    console.error("Get client stats error:", err);
    res.status(500).json({ error: err.message });
  }
};
