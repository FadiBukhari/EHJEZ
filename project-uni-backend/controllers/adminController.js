const bcrypt = require("bcrypt");
const { User, Room, Booking } = require("../models");
const { Op } = require("sequelize");

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await User.findAll({
      where: { role: "client" },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Room,
          as: "ownedRooms",
          attributes: ["id"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Add room count and booking count
    const clientsWithStats = await Promise.all(
      clients.map(async (client) => {
        const roomCount = await Room.count({
          where: { ownerId: client.id },
        });

        const bookingCount = await Booking.count({
          include: [
            {
              model: Room,
              as: "room",
              where: { ownerId: client.id },
            },
          ],
        });

        return {
          ...client.toJSON(),
          roomCount,
          bookingCount,
        };
      })
    );

    res.json({ clients: clientsWithStats });
  } catch (err) {
    console.error("Get all clients error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get single client by ID
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await User.findOne({
      where: { id, role: "client" },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Room,
          as: "ownedRooms",
        },
      ],
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const bookingCount = await Booking.count({
      include: [
        {
          model: Room,
          as: "room",
          where: { ownerId: client.id },
        },
      ],
    });

    res.json({
      ...client.toJSON(),
      bookingCount,
    });
  } catch (err) {
    console.error("Get client error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Create new client (Admin only)
exports.createClient = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      phoneNumber,
      openingHours,
      closingHours,
    } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required",
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate client operating hours
    if (!openingHours || !closingHours) {
      return res.status(400).json({
        message: "Clients must provide opening and closing hours",
      });
    }

    // Check if user already exists
    const exists = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });

    if (exists) {
      return res.status(400).json({
        message: "Email or username already in use",
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create client
    const client = await User.create({
      username,
      password: hashed,
      email,
      phoneNumber,
      role: "client",
      openingHours,
      closingHours,
    });

    // Remove password from response
    const { password: _, ...clientData } = client.toJSON();

    res.status(201).json({
      message: "Client created successfully",
      client: clientData,
    });
  } catch (err) {
    console.error("Create client error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phoneNumber, openingHours, closingHours } =
      req.body;

    // Find client
    const client = await User.findOne({
      where: { id, role: "client" },
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Check for duplicate username/email
    if (username || email) {
      const uniqueChecks = [];
      if (username) uniqueChecks.push({ username });
      if (email) uniqueChecks.push({ email });

      const duplicate = await User.findOne({
        where: {
          [Op.or]: uniqueChecks,
          id: { [Op.ne]: id },
        },
      });

      if (duplicate) {
        return res.status(400).json({
          message: "Username or email is already taken",
        });
      }
    }

    // Prepare updates
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
    if (openingHours !== undefined) updates.openingHours = openingHours;
    if (closingHours !== undefined) updates.closingHours = closingHours;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Update client
    await client.update(updates);

    // Remove password from response
    const { password: _, ...clientData } = client.toJSON();

    res.json({
      message: "Client updated successfully",
      client: clientData,
    });
  } catch (err) {
    console.error("Update client error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    // Find client
    const client = await User.findOne({
      where: { id, role: "client" },
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Check if client has active bookings
    const activeBookings = await Booking.count({
      where: {
        status: { [Op.in]: ["pending", "approved"] },
      },
      include: [
        {
          model: Room,
          as: "room",
          where: { ownerId: id },
        },
      ],
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        message: `Cannot delete client with ${activeBookings} active bookings. Please cancel all bookings first.`,
      });
    }

    // Delete client (cascade will delete rooms and bookings)
    await client.destroy();

    res.json({
      message: "Client deleted successfully",
    });
  } catch (err) {
    console.error("Delete client error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get platform statistics
exports.getPlatformStats = async (req, res) => {
  try {
    const totalClients = await User.count({ where: { role: "client" } });
    const totalUsers = await User.count({ where: { role: "user" } });
    const totalRooms = await Room.count();
    const totalBookings = await Booking.count();
    const activeBookings = await Booking.count({
      where: { status: { [Op.in]: ["pending", "approved"] } },
    });
    const pendingBookings = await Booking.count({
      where: { status: "pending" },
    });

    // Get recent bookings
    const recentBookings = await Booking.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Room,
          as: "room",
          attributes: ["roomNumber", "roomType"],
          include: [
            {
              model: User,
              as: "owner",
              attributes: ["username"],
            },
          ],
        },
        {
          model: User,
          as: "customer",
          attributes: ["username", "email"],
        },
      ],
    });

    res.json({
      totalClients,
      totalUsers,
      totalRooms,
      totalBookings,
      activeBookings,
      pendingBookings,
      recentBookings,
    });
  } catch (err) {
    console.error("Get platform stats error:", err);
    res.status(500).json({ error: err.message });
  }
};
