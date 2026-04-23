const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT || 4002,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/user_db",
  authServiceUrl: process.env.AUTH_SERVICE_URL || "http://localhost:4001",
  jwtSecret: process.env.JWT_SECRET || "your_secret",
  corsOrigin: process.env.CORS_ORIGIN || "*"
};
