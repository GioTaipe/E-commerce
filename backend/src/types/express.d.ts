// src/types/express.d.ts
import "express";
import { JwtUserPayload } from "../utils/jwt";

declare module "express" {
  export interface Request {
    user?: JwtUserPayload;
  }
}
