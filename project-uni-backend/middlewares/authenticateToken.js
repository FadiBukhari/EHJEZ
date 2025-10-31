const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Try to get token from cookie first, then fall back to Authorization header
  const token =
    req.cookies.token ||
    (req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1]);

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
