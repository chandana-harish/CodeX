const UserProfile = require("../models/UserProfile");

const createUser = async (req, res) => {
  try {
    const { authUserId, name, email, department, designation, phone, role, active } = req.body;

    if (!authUserId || !name || !email) {
      return res.status(400).json({ message: "authUserId, name, and email are required." });
    }

    const existingProfile = await UserProfile.findOne({
      $or: [{ authUserId }, { email: email.toLowerCase() }]
    });

    if (existingProfile) {
      return res.status(409).json({ message: "User profile already exists." });
    }

    const isSelfProvision = req.user.id === authUserId;

    if (req.user.role !== "Admin" && !isSelfProvision) {
      return res.status(403).json({ message: "You can only create your own profile." });
    }

    const resolvedRole = req.user.role === "Admin" ? role || "Employee" : req.user.role;

    const profile = await UserProfile.create({
      authUserId,
      name,
      email: email.toLowerCase(),
      department,
      designation,
      phone,
      role: resolvedRole,
      active: req.user.role === "Admin" ? active !== undefined ? active : true : true
    });

    return res.status(201).json({
      message: "User profile created successfully.",
      data: profile
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create user profile.", error: error.message });
  }
};

const getCurrentUserProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ authUserId: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "User profile not found." });
    }

    return res.status(200).json({ data: profile });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch current user profile.", error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const query = {};

    if (req.query.role) {
      query.role = req.query.role;
    }

    const users = await UserProfile.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ data: users });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users.", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserProfile.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User profile not found." });
    }

    if (req.user.role === "Employee" && req.user.id !== user.authUserId) {
      return res.status(403).json({ message: "You can only view your own profile." });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user profile.", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await UserProfile.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User profile not found." });
    }

    if (req.user.role === "Employee" && req.user.id !== user.authUserId) {
      return res.status(403).json({ message: "You can only update your own profile." });
    }

    const allowedFields = ["name", "department", "designation", "phone", "role", "active"];

    if (req.user.role === "Employee") {
      for (const field of ["role", "active"]) {
        delete updates[field];
      }
    }

    Object.keys(updates).forEach((field) => {
      if (!allowedFields.includes(field)) {
        delete updates[field];
      }
    });

    const updatedUser = await UserProfile.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      message: "User profile updated successfully.",
      data: updatedUser
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user profile.", error: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  getCurrentUserProfile
};
