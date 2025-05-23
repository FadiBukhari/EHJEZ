const Todo = require("../models/todo");

exports.addTodo = async (req, res) => {
  try {
    const { task } = req.body;
    const userId = req.user.userId; // Assume `authenticate` middleware attaches user info to req.user
    const newTodo = await Todo.create({ task, userId });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTodos = async (req, res) => {
  try {
    const userId = req.user.userId;
    const todos = await Todo.findAll({ where: { userId } });

    res.status(200).json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id);
    if (!todo || todo.userId !== req.user.userId) {
      return res.status(404).json({ error: "Todo not found" });
    }

    await todo.destroy();
    res.status(200).json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { task } = req.body;
    const todo = await Todo.findByPk(id);
    if (!todo || todo.userId !== req.user.userId) {
      return res.status(404).json({ error: "Todo not found" });
    }
    todo.task = task;
    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
