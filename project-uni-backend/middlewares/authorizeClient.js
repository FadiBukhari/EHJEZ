const authorizeClient = (req, res, next) => {
  if (req.user && req.user.role === "client") {
    return next();
  }
  return res.status(403).json({ message: "Access denied: Client only" });
};

module.exports = authorizeClient;
