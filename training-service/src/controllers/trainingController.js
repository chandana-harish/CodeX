const Training = require("../models/Training");
const { getUserById } = require("../services/userService");

const createTraining = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      trainerName,
      trainerId,
      scheduleDate,
      durationHours,
      location,
      status
    } = req.body;

    if (!title || !description || !trainerName || !scheduleDate || !durationHours) {
      return res.status(400).json({
        message: "title, description, trainerName, scheduleDate, and durationHours are required."
      });
    }

    const training = await Training.create({
      title,
      description,
      category,
      trainerName,
      trainerId: trainerId || req.user.id,
      scheduleDate,
      durationHours,
      location,
      status: status || "planned"
    });

    return res.status(201).json({
      message: "Training created successfully.",
      data: training
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create training.", error: error.message });
  }
};

const getTrainings = async (req, res) => {
  try {
    let trainings = await Training.find().sort({ scheduleDate: 1 });

    if (req.user.role === "Employee") {
      trainings = trainings.filter((training) =>
        training.assignedEmployees.some((employee) => employee.userId === req.query.userId || employee.userEmail === req.user.email)
      );
    }

    return res.status(200).json({ data: trainings });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch trainings.", error: error.message });
  }
};

const getTrainingById = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);

    if (!training) {
      return res.status(404).json({ message: "Training not found." });
    }

    if (req.user.role === "Employee") {
      const isAssigned = training.assignedEmployees.some(
        (employee) => employee.userEmail === req.user.email || employee.userId === req.query.userId
      );

      if (!isAssigned) {
        return res.status(403).json({ message: "You can only view assigned trainings." });
      }
    }

    return res.status(200).json({ data: training });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch training.", error: error.message });
  }
};

const assignEmployee = async (req, res) => {
  try {
    const { trainingId, userId } = req.body;

    if (!trainingId || !userId) {
      return res.status(400).json({ message: "trainingId and userId are required." });
    }

    const training = await Training.findById(trainingId);

    if (!training) {
      return res.status(404).json({ message: "Training not found." });
    }

    const user = await getUserById(userId, req.token);

    if (!user || !user.active) {
      return res.status(400).json({ message: "User is inactive or unavailable for assignment." });
    }

    const alreadyAssigned = training.assignedEmployees.some((employee) => employee.userId === userId);

    if (alreadyAssigned) {
      return res.status(409).json({ message: "Employee is already assigned to this training." });
    }

    training.assignedEmployees.push({
      userId,
      userName: user.name,
      userEmail: user.email
    });

    await training.save();

    return res.status(200).json({
      message: "Employee assigned successfully.",
      data: training
    });
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to assign employee to training.";
    return res.status(statusCode).json({ message, error: error.message });
  }
};

module.exports = {
  createTraining,
  getTrainings,
  assignEmployee,
  getTrainingById
};
