const express = require("express");
const {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getPlatformStats,
} = require("../controllers/adminController");

const authenticateToken = require("../middlewares/authenticateToken");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateToken, authorizeAdmin);

// Platform statistics
router.get("/stats", getPlatformStats);

// Client management
router.get("/clients", getAllClients);
router.get("/clients/:id", getClientById);
router.post("/clients", createClient);
router.put("/clients/:id", updateClient);
router.delete("/clients/:id", deleteClient);

module.exports = router;
