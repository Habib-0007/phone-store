import express from "express";
import { validateRequest } from "../middleware/validate-request";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth-validator";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyMe,
} from "../controllers/authcontroller";
import { authenticate } from "../middleware/authenticate";
const router = express.Router();

// router.post("/register", validateRequest(registerSchema), register);
router.post("/register", register);

// router.post("/login", validateRequest(loginSchema), login);
router.post("/login", login);

router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  forgotPassword
);

router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  resetPassword
);

router.get("/me", authenticate as any, verifyMe);

export default router;
