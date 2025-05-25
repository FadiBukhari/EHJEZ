module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Booking",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: "The calendar date the booking is for",
      },
      checkInTime: {
        type: DataTypes.TIME,
        allowNull: false,
        comment: "Exact check-in time on the selected date",
      },
      checkOutTime: {
        type: DataTypes.TIME,
        allowNull: false,
        comment: "Exact check-out time on the selected date",
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "declined", "cancelled"),
        defaultValue: "pending",
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "Bookings",
    }
  );

  return Booking;
};
