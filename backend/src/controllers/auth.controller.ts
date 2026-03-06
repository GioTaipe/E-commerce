import type { Request, Response } from "express";
import { AuthService } from "../services/auth.services.js";
import { CreateUserDto, CreateUserWithRoleDto, LoginUserDto, UpdateProfileDto } from "../dto/auth.dto.js";

export class AuthController {
  constructor(private authService = new AuthService()) {}

  register = async (req: Request, res: Response) => {
    const data: CreateUserDto = req.body;
    const user = await this.authService.register(data);
    const { passwordHash, ...userWithoutPassword } = user;
    res.status(201).json({ message: "Usuario registrado exitosamente", user: userWithoutPassword });
  };

  createUserWithRole = async (req: Request, res: Response) => {
    const data: CreateUserWithRoleDto = req.body;
    const user = await this.authService.createUserWithRole(data);
    const { passwordHash, ...userWithoutPassword } = user;
    res.status(201).json({ message: "Usuario creado exitosamente", user: userWithoutPassword });
  };

  // [FIX] Eliminados console.log que exponían credenciales en texto plano en logs
  login = async (req: Request, res: Response) => {
    const data: LoginUserDto = req.body;
    const result = await this.authService.login(data);
    res.json(result);
  };

  updateProfile = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data: UpdateProfileDto = req.body;
    const user = await this.authService.updateUser(userId, data);
    const { passwordHash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  };

  deleteUser = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const user = await this.authService.deleteUser(userId);
    res.json({ message: "Usuario eliminado exitosamente", user });
  };
}
