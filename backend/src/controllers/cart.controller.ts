import type { Request, Response } from "express";
import { CartService } from "../services/cart.service.js";
import { UnauthorizedError } from "../utils/errors.js";

export class CartController {
  constructor(private cartService = new CartService()) {}
  // [FIX] Eliminado fallback a _id (no existe en JwtUserPayload, era residuo de MongoDB)
  private getUserId(req: Request): number {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedError("Usuario no autenticado");
    return Number(userId);
  }

  getCart = async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const cart = await this.cartService.getCart(userId);
    res.json(cart);
  };

  addToCart = async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    
    const item = await this.cartService.addToCart(userId, req.body);
    res.status(201).json(item);
  };

  updateItem = async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;
    const item = await this.cartService.updateItem(userId, Number(id), req.body);
    res.json(item);
  };

  removeItem = async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;
    await this.cartService.removeItem(userId, Number(id));
    res.sendStatus(204);
  };

  clearCart = async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    await this.cartService.clearCart(userId);
    res.sendStatus(204);
  };
}
