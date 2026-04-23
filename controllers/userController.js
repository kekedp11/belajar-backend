const fs = require("fs").promises;
const path = require("path");

const dataPath = path.join(__dirname, "../data/users.json");

async function getUsersData() {
  const data = await fs.readFile(dataPath, "utf-8");
  return JSON.parse(data);
}

async function saveUsers(users) {
  await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
}

// GET ALL
const getUsers = async (req, res, next) => {
  try {
    const users = await getUsersData();
    const { name } = req.query;

    if (name) {
      const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(name.toLowerCase())
      );
      return res.json(filteredUsers);
    }

    res.json(users);
  } catch (error) {
    next(error);
  }
};

// GET BY ID
const getUserById = async (req, res, next) => {
  try {
    const users = await getUsersData();
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
      const err = new Error("User tidak ditemukan");
      err.status = 404;
      throw err;
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// POST
const createUser = async (req, res, next) => {
  try {
    const users = await getUsersData();
    const { name } = req.body || {};

    if (!name) {
      const err = new Error("Nama wajib diisi");
      err.status = 400;
      throw err;
    }

    const newUser = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      name
    };

    users.push(newUser);
    await saveUsers(users);

    res.status(201).json({
      message: "User berhasil ditambahkan",
      data: newUser
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
const deleteUser = async (req, res, next) => {
  try {
    const users = await getUsersData();
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      const err = new Error("User tidak ditemukan");
      err.status = 404;
      throw err;
    }

    users.splice(userIndex, 1);
    await saveUsers(users);

    res.json({ message: "User berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};

// PUT
const updateUser = async (req, res, next) => {
  try {
    const users = await getUsersData();
    const userId = parseInt(req.params.id);
    const { name } = req.body || {};

    const user = users.find(u => u.id === userId);

    if (!user) {
      const err = new Error("User tidak ditemukan");
      err.status = 404;
      throw err;
    }

    if (!name) {
      const err = new Error("Nama wajib diisi");
      err.status = 400;
      throw err;
    }

    user.name = name;
    await saveUsers(users);

    res.json({
      message: "User berhasil diupdate",
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser
};