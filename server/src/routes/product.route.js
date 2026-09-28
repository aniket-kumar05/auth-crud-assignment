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
import upload from "../middleware/upload.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllProductsController);
router.get("/:id", productIdParamValidator, getProductByIdController);

// Protected write routes (supports image file upload)
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createProductValidator,
  createProductController
);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  updateProductValidator,
  updateProductController
);
router.delete("/:id", authMiddleware, productIdParamValidator, deleteProductController);

export default router;

