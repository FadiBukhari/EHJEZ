const express = require("express");
const {
  createRoom,
  updateRoom,
  deleteRoom,
  getOwnedRooms,
  getAllRooms,
  getBookedRooms,
} = require("../controllers/roomController");

const authenticateToken = require("../middlewares/authenticateToken");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

const router = express.Router();

router.post("/", authenticateToken, authorizeAdmin, createRoom);
router.put("/:id", authenticateToken, authorizeAdmin, updateRoom);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteRoom);
router.get("/owned", authenticateToken, authorizeAdmin, getOwnedRooms);
router.get("/bookedowned", authenticateToken, authorizeAdmin, getBookedRooms);

router.get("/all", authenticateToken, getAllRooms);

module.exports = router;
