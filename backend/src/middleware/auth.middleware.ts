// Middleware para proteger rutas revisando si el cliente mandó un token válido

// src/middlewares/auth.middleware.ts
import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = verifyToken(token); // { _id, email, role, ... }
    req.user = payload; // ✅ ya tiene tipado
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}


