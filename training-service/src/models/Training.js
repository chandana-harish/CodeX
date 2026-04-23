const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      required: true
    },
    assignedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const trainingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: "General"
    },
    trainerName: {
      type: String,
      required: true
    },
    trainerId: {
      type: String,
      default: ""
    },
    scheduleDate: {
      type: Date,
      required: true
    },
    durationHours: {
      type: Number,
      required: true,
      min: 1
    },
    location: {
      type: String,
      default: "Online"
    },
    status: {
      type: String,
      enum: ["planned", "ongoing", "completed"],
      default: "planned"
    },
    assignedEmployees: [assignmentSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Training", trainingSchema);
