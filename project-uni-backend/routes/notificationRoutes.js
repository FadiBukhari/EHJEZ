const express = require("express");
const {
  sendNotification,
  getMyNotifications,
} = require("../controllers/notificationController");

const authenticateToken = require("../middlewares/authenticateToken");
const authorizeAdmin = require("../middlewares/authorizeAdmin");
const authorizeUser = require("../middlewares/authorizeUser");

const router = express.Router();

router.post("/", authenticateToken, authorizeAdmin, sendNotification);
router.get("/my", authenticateToken, authorizeUser, getMyNotifications);

module.exports = router;
