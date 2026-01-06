const bcrypt = require("bcrypt");
const { User, Room, Booking, Role, Client } = require("../models");
const { Op } = require("sequelize");

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const clientRole = await Role.findOne({ where: { name: "client" } });

    const clients = await User.findAll({
      where: { roleId: clientRole.id },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Client,
          as: "clientProfile",
          include: [
            {
              model: Room,
              as: "rooms",
              attributes: ["id"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Add room count and booking count
    const clientsWithStats = await Promise.all(
      clients.map(async (client) => {
        const clientProfile = client.clientProfile;
        if (!clientProfile) {
          return {
            ...client.toJSON(),
            roomCount: 0,
            bookingCount: 0,
          };
        }

        const roomCount = await Room.count({
          where: { clientId: clientProfile.id },
        });

        const bookingCount = await Booking.count({
          include: [
            {
              model: Room,
              as: "room",
              where: { clientId: clientProfile.id },
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
    const clientRole = await Role.findOne({ where: { name: "client" } });

    const client = await User.findOne({
      where: { id, roleId: clientRole.id },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Client,
          as: "clientProfile",
          include: [
            {
              model: Room,
              as: "rooms",
            },
          ],
        },
      ],
    });

    if (!client || !client.clientProfile) {
      return res.status(404).json({ message: "Client not found" });
    }

    const bookingCount = await Booking.count({
      include: [
        {
          model: Room,
          as: "room",
          where: { clientId: client.clientProfile.id },
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
      latitude,
      longitude,
    } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required",
      });
    }

    // Normalize email to lowercase for case-insensitive comparison
    const normalizedEmail = email.toLowerCase().trim();

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone number format if provided
    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({ 
        message: "Phone number must be exactly 10 digits" 
      });
    }

    // Validate client operating hours and location
    if (
      !openingHours ||
      !closingHours ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        message:
          "Clients must provide opening hours, closing hours, latitude, and longitude",
      });
    }

    // Check if user already exists
    const exists = await User.findOne({
      where: { [Op.or]: [{ email: normalizedEmail }, { username }] },
    });

    if (exists) {
      return res.status(400).json({
        message: "Email or username already in use",
      });
    }

    // Get client role
    const clientRole = await Role.findOne({ where: { name: "client" } });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user with client role
    const user = await User.create({
      username,
      password: hashed,
      email: normalizedEmail,
      phoneNumber,
      roleId: clientRole.id,
    });

    // Create client profile
    const clientProfile = await Client.create({
      userId: user.id,
      openingHours,
      closingHours,
      latitude,
      longitude,
    });

    // Remove password from response
    const { password: _, ...userData } = user.toJSON();

    res.status(201).json({
      message: "Client created successfully",
      client: {
        ...userData,
        clientProfile,
      },
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
    const {
      username,
      email,
      phoneNumber,
      openingHours,
      closingHours,
      latitude,
      longitude,
    } = req.body;

    // Find client
    const clientRole = await Role.findOne({ where: { name: "client" } });
    const user = await User.findOne({
      where: { id, roleId: clientRole.id },
      include: [{ model: Client, as: "clientProfile" }],
    });

    if (!user || !user.clientProfile) {
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

    // Validate phone number format if provided
    if (phoneNumber !== undefined && phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({ 
        message: "Phone number must be exactly 10 digits" 
      });
    }

    // Prepare user updates
    const userUpdates = {};
    if (username) userUpdates.username = username;
    if (email) userUpdates.email = email;
    if (phoneNumber !== undefined) userUpdates.phoneNumber = phoneNumber;

    // Prepare client profile updates
    const clientUpdates = {};
    if (openingHours !== undefined) clientUpdates.openingHours = openingHours;
    if (closingHours !== undefined) clientUpdates.closingHours = closingHours;
    if (latitude !== undefined) clientUpdates.latitude = latitude;
    if (longitude !== undefined) clientUpdates.longitude = longitude;

    if (
      Object.keys(userUpdates).length === 0 &&
      Object.keys(clientUpdates).length === 0
    ) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Update user
    if (Object.keys(userUpdates).length > 0) {
      await user.update(userUpdates);
    }

    // Update client profile
    if (Object.keys(clientUpdates).length > 0) {
      await user.clientProfile.update(clientUpdates);
    }

    // Reload with updated data
    await user.reload({ include: [{ model: Client, as: "clientProfile" }] });

    // Remove password from response
    const { password: _, ...userData } = user.toJSON();

    res.json({
      message: "Client updated successfully",
      client: userData,
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
    const clientRole = await Role.findOne({ where: { name: "client" } });
    const user = await User.findOne({
      where: { id, roleId: clientRole.id },
      include: [{ model: Client, as: "clientProfile" }],
    });

    if (!user || !user.clientProfile) {
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
          where: { clientId: user.clientProfile.id },
        },
      ],
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        message: `Cannot delete client with ${activeBookings} active bookings. Please cancel all bookings first.`,
      });
    }

    // Delete user (cascade will delete client profile, rooms, and bookings)
    await user.destroy();

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
    const clientRole = await Role.findOne({ where: { name: "client" } });
    const userRole = await Role.findOne({ where: { name: "user" } });

    const totalClients = await User.count({ where: { roleId: clientRole.id } });
    const totalUsers = await User.count({ where: { roleId: userRole.id } });
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
              model: Client,
              as: "client",
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["username"],
                },
              ],
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
