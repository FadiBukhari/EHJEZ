const User = require("../models/user");
const Todo = require("./todo");

User.hasMany(Todo, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
Todo.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = { User, Todo };
