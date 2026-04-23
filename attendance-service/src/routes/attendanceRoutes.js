const express = require("express");
const {
  markAttendance,
  getAttendanceByUser,
  getAttendanceByTraining
} = require("../controllers/attendanceController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken);
router.post("/mark", authorizeRoles("Admin", "Trainer"), markAttendance);
router.get("/user/:id", getAttendanceByUser);
router.get("/training/:id", authorizeRoles("Admin", "Trainer"), getAttendanceByTraining);

module.exports = router;
