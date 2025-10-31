const { Room, Booking, User } = require("../models");
const { Op } = require("sequelize");

// Get client-specific statistics
exports.getClientStats = async (req, res) => {
  try {
    const clientId = req.user.userId || req.user.id; // Get from authenticated user

    if (!clientId) {
      return res.status(400).json({ message: "Client ID not found in token" });
    }

    // Total rooms owned by this client
    const totalRooms = await Room.count({
      where: { ownerId: clientId },
    });

    // Total bookings for this client's rooms
    const totalBookings = await Booking.count({
      include: [
        {
          model: Room,
          as: "room",
          where: { ownerId: clientId },
        },
      ],
    });

    // Recent bookings for this client's rooms
    const recentBookings = await Booking.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Room,
          as: "room",
          where: { ownerId: clientId },
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
