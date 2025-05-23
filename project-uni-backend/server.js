const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes.js");
const todoRoutes = require("./routes/todoRoutes.js");
const cors = require("cors");
const sequelize = require("./sequelize");
const authenticateToken = require("./middlewares/authentication.js");
app.use(express.json());
app.use(cors()); // Allow cross-origin requests

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/todos", todoRoutes);
app.use("/api/user", userRoutes);

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
