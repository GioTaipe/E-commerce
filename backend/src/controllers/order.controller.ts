import type { Request, Response } from "express";
import { OrderService } from "../services/order.service.js";

const orderService = new OrderService();

export class OrderController {
  createOrder = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id || req.user?._id;
      if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });

      const order = await orderService.createOrder(Number(userId));
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getUserOrders = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id || req.user?._id;
      if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });

      const orders = await orderService.getUserOrders(Number(userId));
      res.json(orders);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getOrderById = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id || req.user?._id;
      const orderId = Number(req.params.id);
      const order = await orderService.getOrderById(Number(userId), orderId);
      res.json(order);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };
}
