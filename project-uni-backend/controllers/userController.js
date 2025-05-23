const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users.js");

exports.addUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPass,
      username,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const correctPass = await bcrypt.compare(password, user.password);
    if (!correctPass)
      return res.status(400).json({ message: "invalid password" });
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
