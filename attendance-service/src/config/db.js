const mongoose = require("mongoose");

const connectDB = async (mongoUri) => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Attendance service connected to MongoDB");
  } catch (error) {
    console.error("Attendance service MongoDB connection failed", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
