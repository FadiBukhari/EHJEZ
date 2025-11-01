const express = require("express");
const {
  addUser,
  loginUser,
  logoutUser,
  verifyAuth,
  getProfile,
  editProfile,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken");
const { authLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

router.post("/register", authLimiter, addUser);
router.post("/login", authLimiter, loginUser);
router.post("/logout", logoutUser);
router.get("/verify", authenticateToken, verifyAuth);
router.get("/profile", authenticateToken, getProfile);
router.put("/editprofile", authenticateToken, editProfile);

module.exports = router;
