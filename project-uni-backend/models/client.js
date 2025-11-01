module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    "Client",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      openingHours: {
        type: DataTypes.TIME,
        allowNull: false,
        comment: "Store opening time",
      },
      closingHours: {
        type: DataTypes.TIME,
        allowNull: false,
        comment: "Store closing time",
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
        validate: {
          min: -90,
          max: 90,
        },
        comment: "Geographic latitude",
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
        validate: {
          min: -180,
          max: 180,
        },
        comment: "Geographic longitude",
      },
    },
    {
      tableName: "Clients",
      timestamps: true,
    }
  );
  return Client;
};
