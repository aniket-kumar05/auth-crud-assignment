import { body, validationResult } from "express-validator";

export const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage("Name is required")
    .isString().withMessage("Name must be a string")
    .bail()
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
  
  body('email')
    .trim()
    .notEmpty().withMessage("Email is required")
    .bail()
    .isEmail().withMessage("Enter a valid email address"),
  
  body('password')
    .trim()
    .notEmpty().withMessage("Password is required")
    .bail()
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  
  body('confirmPassword')
    .trim()
    .notEmpty().withMessage("Confirm password is required")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array()
      });
    }
    next();
  }
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage("Email is required")
    .bail()
    .isEmail().withMessage("Enter a valid email address"),
  
  body('password')
    .trim()
    .notEmpty().withMessage("Password is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array()
      });
    }
    next();
  }
];