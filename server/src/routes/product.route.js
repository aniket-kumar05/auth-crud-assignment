import { Router } from "express";
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "../controller/product.controller.js";
import {
  createProductValidator,
  updateProductValidator,
  productIdParamValidator,
} from "../validator/product.validator.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllProductsController);
router.get("/:id", productIdParamValidator, getProductByIdController);

// Protected write routes
router.post("/", authMiddleware, createProductValidator, createProductController);
router.put("/:id", authMiddleware, updateProductValidator, updateProductController);
router.delete("/:id", authMiddleware, productIdParamValidator, deleteProductController);

export default router;
