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

const router = express.Router();

router.post("/register", addUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
// Verify endpoint uses optional auth middleware
router.get("/verify", verifyAuth);
router.get("/profile", authenticateToken, getProfile);
router.put("/editprofile", authenticateToken, editProfile);

module.exports = router;
