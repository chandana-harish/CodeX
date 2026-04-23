const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    trainingId: {
      type: String,
      required: true,
      index: true
    },
    trainingTitle: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true,
      index: true
    },
    userName: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      required: true
    },
    sessionDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["present", "absent"],
      required: true
    },
    markedBy: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

attendanceSchema.index({ trainingId: 1, userId: 1, sessionDate: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
