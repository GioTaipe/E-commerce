import type { Request, Response } from "express";
import { CartService } from "../services/cart.service.js";

const cartService = new CartService();

export class CartController {
  getCart = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id || req.user?._id;
      if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });

      const cart = await cartService.getCart(Number(userId));
      res.json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  addToCart = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id || req.user?._id;
      if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });

      const item = await cartService.addToCart(Number(userId), req.body);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  updateItem = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const item = await cartService.updateItem(Number(id), req.body);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  removeItem = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await cartService.removeItem(Number(id));
      res.sendStatus(204);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  clearCart = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id || req.user?._id;
      if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });

      await cartService.clearCart(Number(userId));
      res.sendStatus(204);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
