const express = require("express");
const {
  addTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");
const authenticateToken = require("../middlewares/authentication.js");

const router = express.Router();

router.post("/", authenticateToken, addTodo);
router.get("/", authenticateToken, getTodos);
router.delete("/:id", authenticateToken, deleteTodo);
router.put("/:id", authenticateToken, updateTodo);
module.exports = router;
