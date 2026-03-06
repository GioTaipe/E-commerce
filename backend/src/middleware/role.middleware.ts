// Middleware para validar roles de usuario

import type { Request, Response, NextFunction } from "express";
import type { Role } from "@prisma/client";

/**
 * Middleware para verificar que el usuario tenga uno de los roles permitidos
 * @param allowedRoles - Array de roles permitidos (ej: ['admin', 'customer'])
 */
export function roleMiddleware(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Verificar que el usuario esté autenticado (debe pasar por authMiddleware primero)
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized - No user found" });
    }

    // Verificar que el usuario tenga un rol asignado
    if (!req.user.role) {
      return res.status(403).json({ error: "Forbidden - No role assigned" });
    }

    // Verificar que el rol del usuario esté en los roles permitidos
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden - Requires one of the following roles: ${allowedRoles.join(', ')}`
      });
    }

    // Usuario autorizado, continuar
    next();
  };
}

/**
 * Middleware específico para admins
 */
export const adminOnly = roleMiddleware("admin");

/**
 * Middleware para admins y customers (usuarios autenticados)
 */
export const authenticatedUser = roleMiddleware("admin", "customer");
