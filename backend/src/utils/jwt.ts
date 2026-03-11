// Utils para generar y verificar tokens JWT

import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import type { Role } from "@prisma/client";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRY = process.env.JWT_EXPIRY || "1h";

// Payload del token JWT con campos requeridos
export interface JwtUserPayload extends JwtPayload {
  id: number;
  email: string;
  role: Role;
}

// [FIX] Usa config.jwtExpiry en vez de hardcodear "24h" — alineado con la config centralizada
export const generateToken = (payload: JwtUserPayload) => {
  const options: jwt.SignOptions = {};
  options.expiresIn = JWT_EXPIRY as string & jwt.SignOptions["expiresIn"];
  return jwt.sign(payload, JWT_SECRET, options);
};

// [FIX] Type guard real para validar estructura del payload JWT en vez de cast inseguro
function isJwtUserPayload(payload: JwtPayload): payload is JwtUserPayload {
  return (
    typeof payload.id === "number" &&
    typeof payload.email === "string" &&
    typeof payload.role === "string"
  );
}

// Verificar y decodificar token JWT
export const verifyToken = (token: string): JwtUserPayload => {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  if (!isJwtUserPayload(decoded)) {
    throw new Error("Token payload does not match expected structure");
  }

  return decoded;
};

