// Middleware to restrict to gym owners or admins
module.exports = function (req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  if (req.user.role !== "admin" && req.user.role !== "gym-owner") {
    return res.status(403).json({ message: "Forbidden: Access denied" });
  }

  next();
};
