const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const dataPath = path.join(__dirname, "../data/users.json");

// ================= HELPERS =================

async function getUsersData() {
  const data = await fs.readFile(dataPath, "utf-8");
  return JSON.parse(data);
}

async function saveUsers(users) {
  await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
}

// ================= GET ALL =================

async function getAllUsers(name) {
  const users = await getUsersData();

  if (name) {
    return users.filter((user) =>
      user.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  return users;
}

// ================= GET BY ID =================

async function getUserById(id) {
  const users = await getUsersData();
  const user = users.find((u) => u.id === Number(id));

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

// ================= REGISTER =================

async function createUser(name, email, password) {
  if (!name || !email || !password) {
    throw new AppError("Name, email and password are required", 400);
  }

  const users = await getUsersData();

  const emailExists = users.find((u) => u.email === email);
  if (emailExists) {
    throw new AppError("Email already registered", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword,
    role: "user",
  };

  users.push(newUser);
  await saveUsers(users);

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  };
}

// ================= LOGIN =================

async function loginUser(email, password) {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const users = await getUsersData();
  const user = users.find((u) => u.email === email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
}

// ================= DELETE =================

async function deleteUser(id) {
  const users = await getUsersData();
  const index = users.findIndex((u) => u.id === Number(id));

  if (index === -1) {
    throw new AppError("User not found", 404);
  }

  const deletedUser = users.splice(index, 1)[0];
  await saveUsers(users);

  return {
    id: deletedUser.id,
    name: deletedUser.name,
    email: deletedUser.email,
  };
}

// ================= UPDATE =================

async function updateUser(id, name, email) {
  const users = await getUsersData();
  const user = users.find((u) => u.id === Number(id));

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;

  await saveUsers(users);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  deleteUser,
  updateUser,
};