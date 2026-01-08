
const { verifyUserToken } = require("../utils/jwtUtils");

module.exports = function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No authorization header" });

  const [, token] = authHeader.split(" ");
  if (!token)
    return res.status(401).json({ message: "Malformed authorization header" });

  try {
    // Verify JWT
    const payload = verifyUserToken(token);

    // Attach only necessary info to req.user
    req.user = {
      id: payload.sub,
      role: payload.role, // <-- this must match your allowedRoles
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
