const express = require("express");
const {
  createBooking,
  getUserBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");

const authenticateToken = require("../middlewares/authenticateToken");
const authorizeUser = require("../middlewares/authorizeUser");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

const router = express.Router();

router.post("/", authenticateToken, authorizeUser, createBooking);
router.get("/my", authenticateToken, authorizeUser, getUserBookings);
router.put(
  "/:id/status",
  authenticateToken,
  authorizeAdmin,
  updateBookingStatus
);

module.exports = router;
