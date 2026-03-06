import { Router } from "express";
import { CartController } from "../controllers/cart.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateDto } from "../middleware/validation.middleware.js";
import { AddToCartDto, UpdateCartItemDto } from "../dto/cart.dto.js";

const router = Router();
const controller = new CartController();

// Todas las rutas protegidas
router.use(authMiddleware);

router.get("/", controller.getCart);
// [FIX] Agregado validateDto — antes el body de add/update llegaba sin validar
router.post("/add", validateDto(AddToCartDto), controller.addToCart);
router.put("/item/:id", validateDto(UpdateCartItemDto), controller.updateItem);
router.delete("/item/:id", controller.removeItem);
router.delete("/clear", controller.clearCart);

export default router;
