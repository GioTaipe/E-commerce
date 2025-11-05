// Utils para generar y verificar tokens JWT

import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/index.js";

// 👇 Aquí defines el tipo de datos que contendrá tu token
export interface JwtUserPayload extends JwtPayload {
  _id: number;
  email: string;
  role?: string;
}

// ✅ Función para generar tokens
export const generateToken = (payload: JwtUserPayload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });
};

// ✅ Función para verificar tokens
export const verifyToken = (token: string): JwtUserPayload => {
  const decoded = jwt.verify(token, config.jwtSecret);

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  return decoded as JwtUserPayload;
};

