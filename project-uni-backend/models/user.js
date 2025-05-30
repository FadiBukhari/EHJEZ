module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { len: [7, 20] },
      },
      role: {
        type: DataTypes.ENUM("user", "admin"),
        defaultValue: "user",
        allowNull: false,
      },
    },
    { tableName: "Users" }
  );
  return User;
};
