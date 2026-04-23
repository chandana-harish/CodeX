const Attendance = require("../models/Attendance");
const { getUserById } = require("../services/userService");
const { getTrainingById } = require("../services/trainingService");

const calculatePercentage = (records) => {
  if (!records.length) {
    return 0;
  }

  const presentCount = records.filter((record) => record.status === "present").length;
  return Number(((presentCount / records.length) * 100).toFixed(2));
};

const markAttendance = async (req, res) => {
  try {
    const { trainingId, userId, sessionDate, status } = req.body;

    if (!trainingId || !userId || !sessionDate || !status) {
      return res.status(400).json({
        message: "trainingId, userId, sessionDate, and status are required."
      });
    }

    if (!["present", "absent"].includes(status)) {
      return res.status(400).json({ message: "status must be present or absent." });
    }

    const [user, training] = await Promise.all([
      getUserById(userId, req.token),
      getTrainingById(trainingId, req.token)
    ]);

    const isAssigned = training.assignedEmployees.some((employee) => employee.userId === userId);

    if (!isAssigned) {
      return res.status(400).json({ message: "Employee is not assigned to this training." });
    }

    const attendance = await Attendance.findOneAndUpdate(
      {
        trainingId,
        userId,
        sessionDate: new Date(sessionDate)
      },
      {
        trainingId,
        trainingTitle: training.title,
        userId,
        userName: user.name,
        userEmail: user.email,
        sessionDate: new Date(sessionDate),
        status,
        markedBy: req.user.email
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    return res.status(200).json({
      message: "Attendance marked successfully.",
      data: attendance
    });
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to mark attendance.";
    return res.status(statusCode).json({ message, error: error.message });
  }
};

const getAttendanceByUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role === "Employee" && req.query.authUserId !== req.user.id) {
      return res.status(403).json({ message: "You can only view your own attendance." });
    }

    const records = await Attendance.find({ userId: id }).sort({ sessionDate: -1 });

    return res.status(200).json({
      data: records,
      attendancePercentage: calculatePercentage(records)
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user attendance.", error: error.message });
  }
};

const getAttendanceByTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const records = await Attendance.find({ trainingId: id }).sort({ sessionDate: -1 });

    const grouped = records.reduce((accumulator, record) => {
      if (!accumulator[record.userId]) {
        accumulator[record.userId] = {
          userId: record.userId,
          userName: record.userName,
          userEmail: record.userEmail,
          records: []
        };
      }

      accumulator[record.userId].records.push(record);
      return accumulator;
    }, {});

    const summary = Object.values(grouped).map((entry) => ({
      userId: entry.userId,
      userName: entry.userName,
      userEmail: entry.userEmail,
      totalSessions: entry.records.length,
      attendancePercentage: calculatePercentage(entry.records)
    }));

    return res.status(200).json({
      data: records,
      summary
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch training attendance.", error: error.message });
  }
};

module.exports = {
  markAttendance,
  getAttendanceByUser,
  getAttendanceByTraining
};
