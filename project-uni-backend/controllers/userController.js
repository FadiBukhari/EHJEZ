const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { User } = require("../models");

exports.addUser = async (req, res) => {
  try {
    const { username, password, email, phoneNumber, role } = req.body;
    console.error(req.body);
    const exists = await User?.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Email or username already in use" });
    }
    const hashed = await bcrypt.hash(password, 10);
    await User.create({
      username,
      password: hashed,
      email,
      phoneNumber,
      role: role || "user",
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
    const { username, email, phoneNumber } = req.body;
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
