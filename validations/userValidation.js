const { body, validationResult } = require("express-validator");

// Middleware untuk handle error
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};

// Validation rules untuk create user
const createUserValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Email must be valid"),
];

const updateUserValidation = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Email must be valid"),
];

module.exports = {
  createUserValidation,
  updateUserValidation,
  validate,
};