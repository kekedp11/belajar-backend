const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

const {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  loginUser
} = require("../controllers/userController");

const {
  createUserValidation,
  updateUserValidation,
  validate,
} = require("../validations/userValidation");

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUserValidation, validate, createUser);
router.post("/login", loginUser);
router.delete("/:id", authMiddleware, authorizeRole("admin"), deleteUser);
router.put("/:id", updateUserValidation, validate, updateUser);

module.exports = router;