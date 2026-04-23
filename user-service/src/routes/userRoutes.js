const express = require("express");
const {
  createUser,
  getCurrentUserProfile,
  getUserById,
  getUsers,
  updateUser
} = require("../controllers/userController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken);
router.get("/", authorizeRoles("Admin", "Trainer"), getUsers);
router.post("/", createUser);
router.get("/me/profile", getCurrentUserProfile);
router.get("/:id", getUserById);
router.put("/:id", updateUser);

module.exports = router;
