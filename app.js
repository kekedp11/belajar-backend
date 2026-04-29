const express = require("express");
const userRoutes = require("./routes/users");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// ====================
// Middlewares
// ====================
app.use(express.json());

// ====================
// Health Check Route
// ====================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running 🚀"
  });
});

// ====================
// Routes
// ====================
app.use("/api/users", userRoutes);

// ====================
// 404 Handler
// ====================
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

// ====================
// Global Error Handler
// ====================
app.use(errorHandler);

module.exports = app;