const mongoose = require("mongoose");

const userAuthSchema = new mongoose.Schema(
  {
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
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["Admin", "Trainer", "Employee"],
      default: "Employee"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("UserAuth", userAuthSchema);
