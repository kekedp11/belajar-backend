class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.isOperational = true; // optional, buat bedain error sengaja vs bug
  }
}

module.exports = AppError;