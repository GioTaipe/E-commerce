import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";
import { validateDto } from "../middleware/validation.middleware.js";
import { CreateCategoryDto, UpdateCategoryDto } from "../dto/category.dto.js";

const router = Router();
const controller = new CategoryController();

// Rutas públicas (solo lectura)
router.get("/", controller.getAll);

// [FIX] Agregado validateDto a rutas de categorías — antes el body llegaba sin validar
router.post("/", authMiddleware, adminOnly, validateDto(CreateCategoryDto), controller.create);
router.put("/:id", authMiddleware, adminOnly, validateDto(UpdateCategoryDto), controller.update);
router.delete("/:id", authMiddleware, adminOnly, controller.delete);

export default router;
