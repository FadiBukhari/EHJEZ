// models/Booking.js
module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Booking",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      checkInDate: { type: DataTypes.DATEONLY, allowNull: false },
      checkOutDate: { type: DataTypes.DATEONLY, allowNull: false },
      status: {
        type: DataTypes.ENUM("pending", "approved", "declined", "cancelled"),
        defaultValue: "pending",
      },
      totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      /* createdAt comes automatically; include if you need custom column name */
    },
    { tableName: "Bookings" }
  );
  return Booking;
};
