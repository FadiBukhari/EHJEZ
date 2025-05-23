const express = require("express");
const { addUser, loginUser } = require("../controllers/userController");
const authenticateToken = require("../middlewares/authentication.js");

const router = express.Router();

router.post("/register", addUser); // Add a new to-do
router.post("/login", loginUser); // Get all to-dos for a user

module.exports = router;
