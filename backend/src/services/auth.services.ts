// Logica de negocio 
import { UserRepository } from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { CreateUserDto, LoginUserDto } from "../dto/auth.dto.js";

export class AuthService {
  private userRepo = new UserRepository();

  async register(data: CreateUserDto) {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new Error("Email already in use");
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.userRepo.createUser({ name: data.name, email: data.email, passwordHash: hashed });
    console.log(" User registered:", user);
    
    return user;
  }

  async login(data: LoginUserDto) {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: "1h" });
    return { user, token };
  }

  async deleteUser(userId: number) {
    const user = await this.userRepo.deleteUser(userId);
    if (!user) throw new Error("User not found");
    return user;
  }
// Todavia no implementado en el controlador ni en las rutas
  async updateUser(userId: number, data: Partial<CreateUserDto>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await this.userRepo.updateUser(userId, data);
    if (!user) throw new Error("User not found");
    return user;
  }
}
