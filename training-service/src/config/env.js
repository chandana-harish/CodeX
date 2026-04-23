const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT || 4003,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/training_db",
  userServiceUrl: process.env.USER_SERVICE_URL || "http://localhost:4002",
  jwtSecret: process.env.JWT_SECRET || "your_secret",
  corsOrigin: process.env.CORS_ORIGIN || "*"
};
