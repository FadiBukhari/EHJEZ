require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { sequelize } = require("./models");
const authenticateToken = require("./middlewares/authenticateToken.js");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const clientRoutes = require("./routes/clientRoutes");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection to PostgreSQL has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized.");
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

app.get("/getuser", authenticateToken, (req, res) => {
  res.json({ message: "Protected data!", user: req.user });
});

app.use("/users", userRoutes);
app.use("/rooms", roomRoutes);
app.use("/bookings", bookingRoutes);
app.use("/notifications", notificationRoutes);
app.use("/admin", adminRoutes);
app.use("/client", clientRoutes);
