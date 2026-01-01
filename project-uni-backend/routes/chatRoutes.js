const express = require("express");
const { chat } = require("../controllers/chatController");

const router = express.Router();

// AI Chat endpoint - no authentication required for general help
router.post("/", chat);

module.exports = router;
