const express = require("express");
const { getClientStats } = require("../controllers/clientController");
const authenticateToken = require("../middlewares/authenticateToken");
const authorizeClient = require("../middlewares/authorizeClient");

const router = express.Router();

// All routes require authentication and client role
router.use(authenticateToken, authorizeClient);

// Client statistics
router.get("/stats", getClientStats);

module.exports = router;
