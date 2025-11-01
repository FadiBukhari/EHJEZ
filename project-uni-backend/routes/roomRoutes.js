const express = require("express");
const {
  createRoom,
  updateRoom,
  deleteRoom,
  getOwnedRooms,
  getAllRooms,
  getBookedRooms,
  getRoomBookings,
  getRoomAvailability,
} = require("../controllers/roomController");

const authenticateToken = require("../middlewares/authenticateToken");
const authorizeClient = require("../middlewares/authorizeClient");
const { createLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

router.post("/", createLimiter, authenticateToken, authorizeClient, createRoom);
router.put("/:id", authenticateToken, authorizeClient, updateRoom);
router.delete("/:id", authenticateToken, authorizeClient, deleteRoom);
router.get("/owned", authenticateToken, authorizeClient, getOwnedRooms);
router.get("/bookedowned", authenticateToken, authorizeClient, getBookedRooms);
router.get(
  "/:id/bookings",
  authenticateToken,
  authorizeClient,
  getRoomBookings
);

// Public endpoint for users to see room availability (requires auth but not client role)
router.get("/:id/availability", authenticateToken, getRoomAvailability);

router.get("/all", authenticateToken, getAllRooms);

module.exports = router;
