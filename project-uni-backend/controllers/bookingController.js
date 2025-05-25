const { Booking } = require("../models");
const { Room } = require("../models");

// POST /bookings   (authenticateToken + authorizeUser)
exports.createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, totalPrice } = req.body;

    // ensure room exists & available
    const room = await Room.findByPk(roomId);
    if (!room || room.status !== "available") {
      return res.status(400).json({ message: "Room not available" });
    }

    const booking = await Booking.create({
      customerId: req.user.userId,
      roomId,
      checkInDate,
      checkOutDate,
      totalPrice,
      status: "pending",
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /bookings/my   (authenticateToken + authorizeUser)
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { customerId: req.user.userId },
      order: [["createdAt", "DESC"]],
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /bookings/:id/status   (authenticateToken + authorizeAdmin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // "approved" | "declined" | "cancelled"
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
