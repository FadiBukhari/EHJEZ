const { Room, Booking, User } = require("../models");
const { Op } = require("sequelize");

exports.createRoom = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const { roomNumber, roomType, capacity, status, basePrice, description } =
      req.body;

    // Validate required fields
    if (!roomNumber || !roomType || !capacity || !basePrice) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Validate roomType
    const validRoomTypes = ["single", "double", "suite"];
    if (!validRoomTypes.includes(roomType)) {
      return res.status(400).json({ message: "Invalid room type" });
    }

    // Validate capacity is positive
    if (capacity <= 0) {
      return res.status(400).json({ message: "Capacity must be positive" });
    }

    // Validate basePrice is positive
    if (basePrice <= 0) {
      return res.status(400).json({ message: "Base price must be positive" });
    }

    // Get owner info to inherit operating hours
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    if (owner.role !== "client") {
      return res.status(403).json({
        message: "Only clients can create rooms",
      });
    }

    if (!owner.openingHours || !owner.closingHours) {
      return res.status(400).json({
        message:
          "Please set your business opening and closing hours in your profile first",
      });
    }

    const exists = await Room.findOne({ where: { roomNumber } });
    if (exists)
      return res.status(400).json({ message: "Room number already exists" });

    const room = await Room.create({
      ownerId,
      roomNumber,
      roomType,
      capacity,
      status: status || "available",
      basePrice,
      description,
    });

    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room || room.ownerId !== req.user.userId) {
      return res
        .status(404)
        .json({ message: "Room not found or unauthorized" });
    }

    // Validate if updating numeric fields
    if (req.body.capacity && req.body.capacity <= 0) {
      return res.status(400).json({ message: "Capacity must be positive" });
    }
    if (req.body.basePrice && req.body.basePrice <= 0) {
      return res.status(400).json({ message: "Base price must be positive" });
    }
    if (req.body.roomType) {
      const validRoomTypes = ["single", "double", "suite"];
      if (!validRoomTypes.includes(req.body.roomType)) {
        return res.status(400).json({ message: "Invalid room type" });
      }
    }

    await room.update(req.body);
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room || room.ownerId !== req.user.userId) {
      return res
        .status(404)
        .json({ message: "Room not found or unauthorized" });
    }

    // Check if room has any bookings (active or past)
    const bookingCount = await Booking.count({
      where: {
        roomId: room.id,
        status: {
          [Op.in]: ["pending", "approved"], // Check for active bookings
        },
      },
    });

    if (bookingCount > 0) {
      return res.status(400).json({
        message: `Cannot delete room. This room has ${bookingCount} active booking(s). Please cancel or delete all bookings for this room first.`,
        activeBookings: bookingCount,
      });
    }

    await room.destroy();
    res.json({ message: "Room deleted successfully" });
  } catch (err) {
    console.error("Delete room error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getOwnedRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({ where: { ownerId: req.user.userId } });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      where: { status: "available" },
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "username", "openingHours", "closingHours"],
        },
      ],
      order: [["basePrice", "ASC"]],
    });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getBookedRooms = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const bookings = await Booking.findAll({
      include: [
        {
          model: Room,
          as: "room",
          where: { ownerId },
          attributes: ["id", "roomNumber", "roomType", "capacity"],
        },
        {
          model: User,
          as: "customer",
          attributes: ["id", "username", "email", "phoneNumber"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(bookings);
  } catch (err) {
    console.error("getBookedRooms error:", err);

    res.status(500).json({ error: err.message });
  }
};

// Get bookings for a specific room (Client only)
exports.getRoomBookings = async (req, res) => {
  try {
    const roomId = req.params.id;
    const clientId = req.user.userId;

    // Verify the room belongs to this client
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.ownerId !== clientId) {
      return res.status(403).json({
        message: "Unauthorized: You can only view bookings for your own rooms",
      });
    }

    const bookings = await Booking.findAll({
      where: {
        roomId: roomId,
        status: {
          [Op.in]: ["pending", "approved"], // Only show active bookings
        },
      },
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["id", "username", "email", "phoneNumber"],
        },
      ],
      order: [
        ["date", "ASC"],
        ["checkInTime", "ASC"],
      ],
    });

    res.json({
      room: {
        id: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
      },
      activeBookings: bookings.length,
      bookings: bookings,
    });
  } catch (err) {
    console.error("getRoomBookings error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get booked time slots for a specific room (Public - for users to see availability)
exports.getRoomAvailability = async (req, res) => {
  try {
    const roomId = req.params.id;

    // Verify the room exists
    const room = await Room.findByPk(roomId, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["openingHours", "closingHours"],
        },
      ],
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Get only the time slots that are booked (without customer details)
    const bookings = await Booking.findAll({
      where: {
        roomId: roomId,
        status: {
          [Op.in]: ["pending", "approved"], // Only show active bookings
        },
      },
      attributes: ["id", "date", "checkInTime", "checkOutTime", "status"],
      order: [
        ["date", "ASC"],
        ["checkInTime", "ASC"],
      ],
    });

    res.json({
      room: {
        id: room.id,
        roomNumber: room.roomNumber,
        openingHours: room.owner?.openingHours,
        closingHours: room.owner?.closingHours,
      },
      bookedSlots: bookings,
    });
  } catch (err) {
    console.error("getRoomAvailability error:", err);
    res.status(500).json({ error: err.message });
  }
};
