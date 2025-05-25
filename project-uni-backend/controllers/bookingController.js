const { Booking } = require("../models");
const { Room } = require("../models");

exports.createBooking = async (req, res) => {
  try {
    const { id, date, checkInTime, checkOutTime, totalPrice } = req.body;
    const room = await Room.findByPk(id);
    if (!room || room.status !== "available") {
      return res.status(400).json({ message: "Room not available" });
    }

    const booking = await Booking.create({
      customerId: req.user.userId,
      roomId: room.id,
      date,
      checkInTime,
      checkOutTime,
      totalPrice,
      status: "approved", //TEMPPPPPPPPPPP
    });
    await Room.update({ status: "inactive" }, { where: { id: id } });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error("Booking creation failed:", err);
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { customerId: req.user.userId, status: "approved" },
      order: [["createdAt", "DESC"]],
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
