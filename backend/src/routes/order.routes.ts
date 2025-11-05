import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();
const controller = new OrderController();

// Todas protegidas
router.use(authMiddleware);

// Crear una nueva orden desde el carrito
router.post("/", controller.createOrder);

// Obtener todas las órdenes del usuario
router.get("/", controller.getUserOrders);

// Obtener una orden específica
router.get("/:id", controller.getOrderById);

export default router;
