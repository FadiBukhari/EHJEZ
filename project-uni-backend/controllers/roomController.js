const { Room, Booking, User, Client } = require("../models");
const { Op } = require("sequelize");

exports.createRoom = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { roomNumber, roomType, capacity, status, basePrice, description } =
      req.body;

    // Validate required fields
    if (!roomNumber || !roomType || !capacity || !basePrice) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Validate roomType
    const validRoomTypes = ["single", "double", "suite", "classroom", "meeting_room", "private_office", "coworking"];
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

    // Get client profile
    const client = await Client.findOne({
      where: { userId },
      include: [{ model: User, as: "user", attributes: ["username"] }],
    });

    if (!client) {
      return res.status(403).json({
        message:
          "Only clients can create rooms. Please create a client profile first.",
      });
    }

    const exists = await Room.findOne({ where: { roomNumber } });
    if (exists)
      return res.status(400).json({ message: "Room number already exists" });

    const room = await Room.create({
      clientId: client.id,
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
    const userId = req.user.userId;

    // Get client profile
    const client = await Client.findOne({ where: { userId } });
    if (!client) {
      return res.status(403).json({ message: "Client profile not found" });
    }

    const room = await Room.findByPk(req.params.id);
    if (!room || room.clientId !== client.id) {
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
      const validRoomTypes = ["single", "double", "suite", "classroom", "meeting_room", "private_office", "coworking"];
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
    const userId = req.user.userId;

    // Get client profile
    const client = await Client.findOne({ where: { userId } });
    if (!client) {
      return res.status(403).json({ message: "Client profile not found" });
    }

    const room = await Room.findByPk(req.params.id);
    if (!room || room.clientId !== client.id) {
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

exports.getRoomById = async (req, res) => {
  try {
    const roomId = req.params.id;

    const room = await Room.findOne({
      where: { id: roomId },
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["openingHours", "closingHours", "latitude", "longitude"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["username", "email"],
            },
          ],
        },
      ],
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (err) {
    console.error("Get room by ID error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getOwnedRooms = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get client profile
    const client = await Client.findOne({ where: { userId } });
    if (!client) {
      return res.status(403).json({ message: "Client profile not found" });
    }

    const rooms = await Room.findAll({ where: { clientId: client.id } });
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
          model: Client,
          as: "client",
          attributes: ["openingHours", "closingHours", "latitude", "longitude"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username"],
            },
          ],
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
    const userId = req.user.userId;

    // Get client profile
    const client = await Client.findOne({ where: { userId } });
    if (!client) {
      return res.status(403).json({ message: "Client profile not found" });
    }

    const bookings = await Booking.findAll({
      include: [
        {
          model: Room,
          as: "room",
          where: { clientId: client.id },
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
    const userId = req.user.userId;

    // Get client profile
    const client = await Client.findOne({ where: { userId } });
    if (!client) {
      return res.status(403).json({ message: "Client profile not found" });
    }

    // Verify the room belongs to this client
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.clientId !== client.id) {
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
          model: Client,
          as: "client",
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
      attributes: ["id", "date", "checkInTime", "checkOutTime", "status", "customerId"],
      order: [
        ["date", "ASC"],
        ["checkInTime", "ASC"],
      ],
    });

    res.json({
      room: {
        id: room.id,
        roomNumber: room.roomNumber,
        openingHours: room.client?.openingHours,
        closingHours: room.client?.closingHours,
      },
      bookedSlots: bookings,
    });
  } catch (err) {
    console.error("getRoomAvailability error:", err);
    res.status(500).json({ error: err.message });
  }
};
