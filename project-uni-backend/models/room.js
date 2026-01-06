module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    "Room",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      roomNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
      roomType: {
        type: DataTypes.ENUM("meeting_room", "classroom"),
        allowNull: false,
      },
      capacity: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.ENUM("available", "maintenance", "inactive"),
        defaultValue: "available",
      },
      basePrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      description: DataTypes.TEXT,

      // Room Features
      hasWhiteboard: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      hasWifi: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      hasProjector: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      hasTV: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      hasAC: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Clients", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    { tableName: "Rooms" }
  );
  return Room;
};
