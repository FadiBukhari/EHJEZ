const express = require("express");
const {
  addUser,
  loginUser,
  getProfile,
  editProfile,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.post("/register", addUser);
router.post("/login", loginUser);
router.get("/profile", authenticateToken, getProfile);
router.put("/editprofile", authenticateToken, editProfile);

module.exports = router;
