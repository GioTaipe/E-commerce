// Logica de negocio
import { UserRepository } from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { CreateUserDto, CreateUserWithRoleDto, LoginUserDto } from "../dto/auth.dto.js";
import { ConflictError, UnauthorizedError, NotFoundError } from "../utils/errors.js";

export class AuthService {
  constructor(private userRepo = new UserRepository()) {}

  async register(data: CreateUserDto) {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new ConflictError("El email ya está en uso");

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.userRepo.createUser({
      name: data.name,
      email: data.email,
      passwordHash: hashed,
      role: "customer"
    });

    return user;
  }

  // [FIX] Eliminado console.log que exponía credenciales del usuario
  async login(data: LoginUserDto) {
    const user = await this.userRepo.findByEmail(data.email);

    // Validar credenciales sin revelar si el usuario existe
    if (!user) {
      throw new UnauthorizedError("Email o contraseña inválidos");
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError("Email o contraseña inválidos");
    }

    // Generar token con toda la información necesaria
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Retornar usuario sin el passwordHash
    const { passwordHash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async createUserWithRole(data: CreateUserWithRoleDto) {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new ConflictError("El email ya está en uso");

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.userRepo.createUser({
      name: data.name,
      email: data.email,
      passwordHash: hashed,
      role: data.role,
    });

    return user;
  }

  async deleteUser(userId: number) {
    const user = await this.userRepo.deleteUser(userId);
    if (!user) throw new NotFoundError("Usuario no encontrado");
    return user;
  }
  // [FIX] Construye objeto con passwordHash en vez de pasar password directo al repo
  // — antes el campo password nunca llegaba a Prisma (el repo espera passwordHash)
  async updateUser(userId: number, data: Partial<CreateUserDto>) {
    const updateData: { name?: string; email?: string; passwordHash?: string } = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    const user = await this.userRepo.updateUser(userId, updateData);
    if (!user) throw new NotFoundError("Usuario no encontrado");
    return user;
  }
}
