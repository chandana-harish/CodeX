const express = require("express");
const { login, register, verify } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", authenticateToken, verify);

module.exports = router;
