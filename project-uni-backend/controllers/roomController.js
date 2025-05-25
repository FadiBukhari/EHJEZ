const { Room } = require("../models");
const { Op } = require("sequelize");

// POST /rooms   (authenticateToken + authorizeAdmin)
exports.createRoom = async (req, res) => {
  try {
    const ownerId = req.user.userId; // admin ID
    const { roomNumber, roomType, capacity, status, basePrice, description } =
      req.body;

    // Ensure unique roomNumber
    const exists = await Room.findOne({ where: { roomNumber } });
    if (exists)
      return res.status(400).json({ message: "Room number already exists" });

    const room = await Room.create({
      ownerId,
      roomNumber,
      roomType,
      capacity,
      status,
      basePrice,
      description,
    });

    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /rooms/:id   (authenticateToken + authorizeAdmin)
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room || room.ownerId !== req.user.userId) {
      return res
        .status(404)
        .json({ message: "Room not found or unauthorized" });
    }

    await room.update(req.body);
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /rooms/:id   (authenticateToken + authorizeAdmin)
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room || room.ownerId !== req.user.userId) {
      return res
        .status(404)
        .json({ message: "Room not found or unauthorized" });
    }

    await room.destroy();
    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /rooms/owned   (authenticateToken + authorizeAdmin)
exports.getOwnedRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({ where: { ownerId: req.user.userId } });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /rooms/all   (authenticateToken)  — visible to any user
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      where: { status: "available" },
      order: [["basePrice", "ASC"]],
    });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
