const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { verifyTokenRemotely } = require("../services/authService");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token is required." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;

    try {
      await verifyTokenRemotely(token);
    } catch (remoteError) {
      if (remoteError.response && remoteError.response.status === 401) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }
    }

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied for this role." });
  }

  return next();
};

module.exports = {
  authenticateToken,
  authorizeRoles
};
