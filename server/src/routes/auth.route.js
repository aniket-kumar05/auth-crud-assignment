import { Router } from "express";
import {
  loginController,
  registerController,
  refreshController,
  logoutController,
  getMe,
} from "../controller/auth.controller.js";
import { loginValidator, registerValidator } from "../validator/auth.validator.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerValidator, registerController);
router.post("/login", loginValidator, loginController);
router.post("/refresh-token", refreshController);
router.post("/logout", authMiddleware, logoutController);
router.get("/me", authMiddleware, getMe);

export default router;