import type { Request, Response } from "express";
import { OrderService } from "../services/order.service.js";
import { UnauthorizedError } from "../utils/errors.js";

export class OrderController {
  constructor(private orderService = new OrderService()) {}
  // [FIX] Eliminado fallback a _id (no existe en JwtUserPayload, era residuo de MongoDB)
  private getUserId(req: Request): number {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedError("Usuario no autenticado");
    return Number(userId);
  }

  createOrder = async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const order = await this.orderService.createOrder(userId);
    res.status(201).json(order);
  };

  getUserOrders = async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const orders = await this.orderService.getUserOrders(userId);
    res.json(orders);
  };

  getOrderById = async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const orderId = Number(req.params.id);
    const order = await this.orderService.getOrderById(userId, orderId);
    res.json(order);
  };
}
