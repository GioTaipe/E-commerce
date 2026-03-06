import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";
import { validateDto } from "../middleware/validation.middleware.js";
import { CreateProductDto, UpdateProductDto } from "../dto/product.dto.js";

const router = Router();
const controller = new ProductController();

// Rutas públicas (solo lectura)
router.get("/", controller.getAll);
router.get("/:id", controller.getById);

// Rutas protegidas (solo administradores)
router.post("/", authMiddleware, adminOnly, validateDto(CreateProductDto), controller.create);
router.put("/:id", authMiddleware, adminOnly, validateDto(UpdateProductDto), controller.update);
router.delete("/:id", authMiddleware, adminOnly, controller.delete);

export default router;
