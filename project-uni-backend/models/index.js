const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Role = require("./role")(sequelize, DataTypes);
const User = require("./user")(sequelize, DataTypes);
const Client = require("./client")(sequelize, DataTypes);
const Room = require("./room")(sequelize, DataTypes);
const Booking = require("./booking")(sequelize, DataTypes);
const Notification = require("./notification")(sequelize, DataTypes);

// Role - User relationship (One-to-Many)
Role.hasMany(User, { foreignKey: "roleId", as: "users" });
User.belongsTo(Role, { foreignKey: "roleId", as: "role" });

// User - Client relationship (One-to-One)
User.hasOne(Client, { foreignKey: "userId", as: "clientProfile" });
Client.belongsTo(User, { foreignKey: "userId", as: "user" });

// Client - Room relationship (One-to-Many)
Client.hasMany(Room, { as: "rooms", foreignKey: "clientId" });
Room.belongsTo(Client, { as: "client", foreignKey: "clientId" });

// User - Booking relationship (One-to-Many)
User.hasMany(Booking, { foreignKey: "customerId", as: "bookings" });
Booking.belongsTo(User, { as: "customer", foreignKey: "customerId" });

// Room - Booking relationship (One-to-Many)
Room.hasMany(Booking, {
  foreignKey: "roomId",
  as: "bookings",
  onDelete: "CASCADE",
  hooks: true,
});
Booking.belongsTo(Room, { as: "room", foreignKey: "roomId" });

// User - Notification relationships (One-to-Many)
User.hasMany(Notification, { as: "sentNotifications", foreignKey: "senderId" });
User.hasMany(Notification, {
  as: "receivedNotifications",
  foreignKey: "receiverId",
});
Notification.belongsTo(User, { as: "sender", foreignKey: "senderId" });
Notification.belongsTo(User, { as: "receiver", foreignKey: "receiverId" });

module.exports = {
  sequelize,
  Sequelize,
  Role,
  User,
  Client,
  Room,
  Booking,
  Notification,
};
