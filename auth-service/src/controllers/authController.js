const bcrypt = require("bcryptjs");
const UserAuth = require("../models/UserAuth");
const { signToken } = require("../utils/jwt");
const env = require("../config/env");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existingUser = await UserAuth.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserAuth.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "Employee"
    });

    const token = signToken(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      env.jwtSecret,
      env.jwtExpiresIn
    );

    return res.status(201).json({
      message: "Registration successful.",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed.", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await UserAuth.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = signToken(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      env.jwtSecret,
      env.jwtExpiresIn
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed.", error: error.message });
  }
};

const verify = async (req, res) => {
  return res.status(200).json({
    message: "Token is valid.",
    user: req.user
  });
};

module.exports = {
  register,
  login,
  verify
};
