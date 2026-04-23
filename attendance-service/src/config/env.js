const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT || 4004,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/attendance_db",
  userServiceUrl: process.env.USER_SERVICE_URL || "http://localhost:4002",
  trainingServiceUrl: process.env.TRAINING_SERVICE_URL || "http://localhost:4003",
  jwtSecret: process.env.JWT_SECRET || "your_secret",
  corsOrigin: process.env.CORS_ORIGIN || "*"
};
