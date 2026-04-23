const express = require("express");
const {
  createTraining,
  getTrainings,
  assignEmployee,
  getTrainingById
} = require("../controllers/trainingController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken);
router.post("/", authorizeRoles("Admin", "Trainer"), createTraining);
router.get("/", getTrainings);
router.post("/assign", authorizeRoles("Admin", "Trainer"), assignEmployee);
router.get("/:id", getTrainingById);

module.exports = router;
