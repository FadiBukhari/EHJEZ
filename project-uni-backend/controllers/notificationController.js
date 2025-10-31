const { Notification } = require("../models");

exports.sendNotification = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    // Validate required fields
    if (!receiverId || !message) {
      return res
        .status(400)
        .json({ message: "Receiver ID and message are required" });
    }

    const notification = await Notification.create({
      senderId: req.user.userId,
      receiverId,
      message,
    });

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { receiverId: req.user.userId },
      order: [["createdAt", "DESC"]],
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
