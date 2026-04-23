const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT || 4001,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/auth_db",
  jwtSecret: process.env.JWT_SECRET || "your_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  corsOrigin: process.env.CORS_ORIGIN || "*"
};
