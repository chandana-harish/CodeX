const mongoose = require("mongoose");

const connectDB = async (mongoUri) => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Training service connected to MongoDB");
  } catch (error) {
    console.error("Training service MongoDB connection failed", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
