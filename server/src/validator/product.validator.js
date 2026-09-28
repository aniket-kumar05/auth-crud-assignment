import { body, param, validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Product name is required")
    .isString().withMessage("Product name must be a string"),
  
  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 0 }).withMessage("Price must be a number greater than or equal to 0"),

  body("description")
    .optional()
    .isString().withMessage("Description must be a string"),

  body("category")
    .optional()
    .isString().withMessage("Category must be a string"),

  body("stock")
    .optional()
    .isInt({ min: 0 }).withMessage("Stock must be an integer greater than or equal to 0"),

  handleValidationErrors,
];

export const updateProductValidator = [
  param("id")
    .isMongoId().withMessage("Invalid product ID format"),

  body("name")
    .optional()
    .trim()
    .notEmpty().withMessage("Product name cannot be empty")
    .isString().withMessage("Product name must be a string"),

  body("price")
    .optional()
    .isFloat({ min: 0 }).withMessage("Price must be a number greater than or equal to 0"),

  body("description")
    .optional()
    .isString().withMessage("Description must be a string"),

  body("category")
    .optional()
    .isString().withMessage("Category must be a string"),

  body("stock")
    .optional()
    .isInt({ min: 0 }).withMessage("Stock must be an integer greater than or equal to 0"),

  handleValidationErrors,
];

export const productIdParamValidator = [
  param("id")
    .isMongoId().withMessage("Invalid product ID format"),
  
  handleValidationErrors,
];
