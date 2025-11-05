import type { Request, Response } from "express";
import { AuthService } from "../services/auth.services.js";
import { CreateUserDto, LoginUserDto } from "../dto/auth.dto.js";


export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    try {
      const data: CreateUserDto = req.body;
      const user = await this.authService.register(data);
      res.status(201).json({ message: "Usuario registrado exitosamente", user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const data: LoginUserDto = req.body;
      const result = await this.authService.login(data);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const user = await this.authService.deleteUser(userId);
      res.json({ message: "Usuario eliminado exitosamente", user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}