const { Room, Booking, User } = require("../models");
const { Op } = require("sequelize");

exports.createRoom = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const { roomNumber, roomType, capacity, status, basePrice, description } =
      req.body;
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
