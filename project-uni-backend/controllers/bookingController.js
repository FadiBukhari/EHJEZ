const { Booking } = require("../models");
const { Room } = require("../models");
const { User } = require("../models");
const { Op } = require("sequelize");

exports.createBooking = async (req, res) => {
  try {
    const { id, date, checkInTime, checkOutTime, totalPrice } = req.body;

    // Validate required fields
    if (!id || !date || !checkInTime || !checkOutTime || !totalPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate time logic
    if (checkInTime >= checkOutTime) {
      return res
        .status(400)
        .json({ message: "Check-out time must be after check-in time" });
    }

    // Validate date is not in the past
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return res.status(400).json({ message: "Cannot book dates in the past" });
    }

    // Validate price is positive
    if (totalPrice <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    const room = await Room.findByPk(id, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["openingHours", "closingHours"],
        },
      ],
    });

    if (!room || room.status !== "available") {
      return res.status(400).json({ message: "Room not available" });
    }

    // Validate booking time is within client's operating hours
    const owner = room.owner;
    if (owner.openingHours && owner.closingHours) {
      if (
        checkInTime < owner.openingHours ||
        checkOutTime > owner.closingHours
      ) {
        return res.status(400).json({
          message: `Booking times must be within operating hours: ${owner.openingHours} - ${owner.closingHours}`,
        });
      }
    }

    // Check for overlapping bookings on the same date
    const overlappingBooking = await Booking.findOne({
      where: {
        roomId: id,
        date: date,
        status: {
          [Op.in]: ["pending", "approved"], // Only check active bookings
        },
        [Op.or]: [
          // New booking starts during existing booking
          {
            checkInTime: { [Op.lte]: checkInTime },
            checkOutTime: { [Op.gt]: checkInTime },
          },
          // New booking ends during existing booking
          {
            checkInTime: { [Op.lt]: checkOutTime },
            checkOutTime: { [Op.gte]: checkOutTime },
          },
          // New booking completely contains existing booking
          {
            checkInTime: { [Op.gte]: checkInTime },
            checkOutTime: { [Op.lte]: checkOutTime },
          },
        ],
      },
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message:
          "This room is already booked for the selected time. Please choose a different time slot.",
      });
    }

    const booking = await Booking.create({
      customerId: req.user.userId,
      roomId: room.id,
      date,
      checkInTime,
      checkOutTime,
      totalPrice,
      status: "pending",
    });
    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking creation failed:", err);
    res.status(500).json({ error: err.message });
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

    // Validate status
    const validStatuses = ["approved", "declined", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Room, as: "room" }],
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Note: We no longer make rooms inactive when approved
    // Rooms stay available for other time slots
    // Time-based availability is checked during booking creation

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete booking (Client only - for their room's bookings)
exports.deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const clientId = req.user.userId;

    const booking = await Booking.findByPk(bookingId, {
      include: [
        {
          model: Room,
          as: "room",
          attributes: ["id", "ownerId", "roomNumber"],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify the booking belongs to a room owned by this client
    if (booking.room.ownerId !== clientId) {
      return res.status(403).json({
        message:
          "Unauthorized: You can only delete bookings for your own rooms",
      });
    }

    await booking.destroy();
    res.json({
      message: "Booking deleted successfully",
      deletedBooking: {
        id: booking.id,
        roomNumber: booking.room.roomNumber,
        date: booking.date,
      },
    });
  } catch (err) {
    console.error("Delete booking error:", err);
    res.status(500).json({ error: err.message });
  }
};
