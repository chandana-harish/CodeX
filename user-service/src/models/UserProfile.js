const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    authUserId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    department: {
      type: String,
      default: ""
    },
    designation: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      enum: ["Admin", "Trainer", "Employee"],
      default: "Employee"
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);
