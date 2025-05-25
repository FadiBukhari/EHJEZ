const express = require("express");
const {
  addUser,
  loginUser,
  getProfile,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.post("/register", addUser);
router.post("/login", loginUser);
router.get("/profile", authenticateToken, getProfile);

module.exports = router;
