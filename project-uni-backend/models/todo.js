const { DataTypes } = require("sequelize");

const sequelize = require("../sequelize");

const Todo = sequelize.define("Todo", {
  task: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // isCompleted: {
  //   type: DataTypes.BOOLEAN,
  //   defaultValue: false,
  // },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

module.exports = Todo;
