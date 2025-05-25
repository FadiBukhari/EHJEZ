const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const User = require("./user")(sequelize, DataTypes);
const Room = require("./room")(sequelize, DataTypes);
const Booking = require("./booking")(sequelize, DataTypes);
const Notification = require("./notification")(sequelize, DataTypes);

User.hasMany(Room, { as: "ownedRooms", foreignKey: "ownerId" });
Room.belongsTo(User, { as: "owner", foreignKey: "ownerId" });

User.hasMany(Booking, { foreignKey: "customerId" });
Booking.belongsTo(User, { as: "customer", foreignKey: "customerId" });

Room.hasMany(Booking, { foreignKey: "roomId" });
Booking.belongsTo(Room, { foreignKey: "roomId" });

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
  User,
  Room,
  Booking,
  Notification,
};
