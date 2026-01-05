const express = require("express");
const {
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomById,
  getOwnedRooms,
  getAllRooms,
  getBookedRooms,
  getRoomBookings,
  getRoomAvailability,
} = require("../controllers/roomController");

const authenticateToken = require("../middlewares/authenticateToken");
const authorizeClient = require("../middlewares/authorizeClient");

const router = express.Router();

// Static routes MUST come first (before parameterized routes)
router.get("/all", authenticateToken, getAllRooms);
router.get("/owned", authenticateToken, authorizeClient, getOwnedRooms);
router.get("/bookedowned", authenticateToken, authorizeClient, getBookedRooms);

// Parameterized routes with additional segments
router.get("/:id/availability", authenticateToken, getRoomAvailability);
router.get("/:id/bookings", authenticateToken, authorizeClient, getRoomBookings);

// Single parameterized routes (catch-all, must be last)
router.get("/:id", authenticateToken, getRoomById);
router.put("/:id", authenticateToken, authorizeClient, updateRoom);
router.delete("/:id", authenticateToken, authorizeClient, deleteRoom);

// Root path operations
router.post("/", authenticateToken, authorizeClient, createRoom);

module.exports = router;
