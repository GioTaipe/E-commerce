// Punto de entrada a API REST

import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateDto } from "../middleware/validation.middleware.js";
import { CreateUserDto, LoginUserDto } from "../dto/auth.dto.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();
const controller = new AuthController();


router.post("/register", validateDto(CreateUserDto), controller.register);
router.post("/login", validateDto(LoginUserDto), controller.login);
router.delete("/delete", authMiddleware, controller.deleteUser);

export default router;

