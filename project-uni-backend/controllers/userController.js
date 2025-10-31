const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { User } = require("../models");

exports.addUser = async (req, res) => {
  try {
    const { username, password, email, phoneNumber, role } = req.body;

    // Validate required fields
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ message: "Username, password, and email are required" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Validate email format (basic check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // SECURITY: Only allow 'user' role through public registration
    // Admin and client accounts must be created by administrators
    if (role && role !== "user") {
      return res.status(403).json({
        message:
          "Only user accounts can be created through public registration. Contact an administrator to create client or admin accounts.",
      });
    }

    const exists = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Email or username already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);
    // Force role to 'user' for all public registrations
    await User.create({
      username,
      password: hashed,
      email,
      phoneNumber,
      role: "user",
      openingHours: null,
      closingHours: null,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register failed:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(404).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const usersent = { username: user.username, role: user.role };
    res.json({ user: usersent, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, email, phoneNumber, openingHours, closingHours } =
      req.body;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const uniqueChecks = [];
    if (username) uniqueChecks.push({ username });
    if (email) uniqueChecks.push({ email });

    if (uniqueChecks.length > 0) {
      const duplicate = await User.findOne({
        where: {
          [Op.or]: uniqueChecks,
          id: { [Op.ne]: userId },
        },
      });

      if (duplicate) {
        return res
          .status(400)
          .json({ message: "Username or email is already taken" });
      }
    }

    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (phoneNumber) updates.phoneNumber = phoneNumber;

    // Allow clients to update operating hours
    if (user.role === "client") {
      if (openingHours !== undefined) updates.openingHours = openingHours;
      if (closingHours !== undefined) updates.closingHours = closingHours;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    await user.update(updates);
    const { password, ...safeUser } = user.toJSON();
    res.json({ message: "Profile updated successfully", user: safeUser });
  } catch (err) {
    console.error("Edit profile error:", err);
    res.status(500).json({ error: err.message });
  }
};
