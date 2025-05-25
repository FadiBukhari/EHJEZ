// models/Notification.js
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    "Notification",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      message: { type: DataTypes.TEXT, allowNull: false },
      readAt: { type: DataTypes.DATE },
      /* sender / receiver links */
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      /* createdAt auto‑added */
    },
    { tableName: "Notifications" }
  );
  return Notification;
};
