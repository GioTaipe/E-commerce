import { Router } from "express";
import { CartController } from "../controllers/cart.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();
const controller = new CartController();

// 🔐 Todas las rutas protegidas
router.use(authMiddleware);

router.get("/", controller.getCart);
router.post("/add", controller.addToCart);
router.put("/item/:id", controller.updateItem);
router.delete("/item/:id", controller.removeItem);
router.delete("/clear", controller.clearCart);

export default router;
