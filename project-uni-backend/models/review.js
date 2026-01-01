module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "Review",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Clients",
          key: "id",
        },
      },
      bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // One review per booking
        references: {
          model: "Bookings",
          key: "id",
        },
      },
    },
    { tableName: "Reviews" }
  );

  return Review;
};
