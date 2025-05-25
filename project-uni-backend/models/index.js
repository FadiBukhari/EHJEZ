// models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

/* ---------- Model definitions ---------- */
const User = require("./user")(sequelize, DataTypes);
const Room = require("./room")(sequelize, DataTypes);
const Booking = require("./booking")(sequelize, DataTypes);
const Notification = require("./notification")(sequelize, DataTypes);

/* ---------- Associations ---------- */

// Admin (owner) → many Rooms
User.hasMany(Room, { as: "ownedRooms", foreignKey: "ownerId" });
Room.belongsTo(User, { as: "owner", foreignKey: "ownerId" });

// User → many Bookings
User.hasMany(Booking, { foreignKey: "customerId" });
Booking.belongsTo(User, { as: "customer", foreignKey: "customerId" });

// Room → many Bookings
Room.hasMany(Booking, { foreignKey: "roomId" });
Booking.belongsTo(Room, { foreignKey: "roomId" });

// Notifications (sender ↔ receiver)
User.hasMany(Notification, { as: "sentNotifications", foreignKey: "senderId" });
User.hasMany(Notification, {
  as: "receivedNotifications",
  foreignKey: "receiverId",
});
Notification.belongsTo(User, { as: "sender", foreignKey: "senderId" });
Notification.belongsTo(User, { as: "receiver", foreignKey: "receiverId" });

/* ---------- Export everything ---------- */
module.exports = {
  sequelize,
  Sequelize,
  User,
  Room,
  Booking,
  Notification,
};
