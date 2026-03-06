// Punto de entrada a API REST

import { Router } from "express";
import rateLimit from "express-rate-limit";
import { AuthController } from "../controllers/auth.controller.js";
import { validateDto } from "../middleware/validation.middleware.js";
import { CreateUserDto, CreateUserWithRoleDto, LoginUserDto, UpdateProfileDto } from "../dto/auth.dto.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = Router();
const controller = new AuthController();

// Rate limiting para endpoints de autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 intentos por ventana
  message: { error: "Demasiados intentos. Intenta de nuevo en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, validateDto(CreateUserDto), controller.register);
router.post("/login", authLimiter, validateDto(LoginUserDto), controller.login);
router.post("/create-user", authMiddleware, adminOnly, validateDto(CreateUserWithRoleDto), controller.createUserWithRole);
router.put("/profile", authMiddleware, validateDto(UpdateProfileDto), controller.updateProfile);
router.delete("/delete", authMiddleware, controller.deleteUser);

export default router;

