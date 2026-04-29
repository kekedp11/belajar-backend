const userService = require("../services/userService");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/response");

// ======================
// GET ALL USERS
// ======================
const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers(req.query.name);
  sendResponse(res, 200, "Users fetched successfully", users);
});

// ======================
// GET USER BY ID
// ======================
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(parseInt(req.params.id));
  sendResponse(res, 200, "User fetched successfully", user);
});

// ======================
// REGISTER USER
// ======================
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await userService.createUser(name, email, password);

  sendResponse(res, 201, "User created successfully", newUser);
});

// ======================
// LOGIN USER
// ======================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const token = await userService.loginUser(email, password);

  sendResponse(res, 200, "Login successful", { token });
});

// ======================
// UPDATE USER
// ======================
const updateUser = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;

  // Optional: ownership check juga bisa ditaruh di sini kalau mau
  // if (req.user.id !== userId) {
  //   const err = new Error("Forbidden - You can only update your own account");
  //   err.status = 403;
  //   throw err;
  // }

  const updatedUser = await userService.updateUser(userId, name, email);

  sendResponse(res, 200, "User updated successfully", updatedUser);
});

// ======================
// DELETE USER
// ======================
const deleteUser = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);

  if (req.user.id !== userId) {
    const err = new Error("Forbidden - You can only delete your own account");
    err.status = 403;
    throw err;
  }

  await userService.deleteUser(userId);

  sendResponse(res, 200, "User deleted successfully");
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  deleteUser
};