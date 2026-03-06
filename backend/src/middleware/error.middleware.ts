import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Errores inesperados: loguear pero no exponer detalles al cliente
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
}
