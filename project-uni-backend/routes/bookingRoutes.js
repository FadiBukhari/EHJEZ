const express = require("express");
const {
  createBooking,
  getUserBookings,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController");

const authenticateToken = require("../middlewares/authenticateToken");
const authorizeUser = require("../middlewares/authorizeUser");
const authorizeClient = require("../middlewares/authorizeClient");
const { bookingLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

router.post(
  "/",
  bookingLimiter,
  authenticateToken,
  authorizeUser,
  createBooking
);
router.get("/my", authenticateToken, authorizeUser, getUserBookings);
router.put(
  "/:id/status",
  authenticateToken,
  authorizeClient,
  updateBookingStatus
);
router.delete("/:id", authenticateToken, authorizeClient, deleteBooking);

module.exports = router;
