// Logica de negocio
import { UserRepository } from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { CreateUserDto, CreateUserWithRoleDto, LoginUserDto } from "../dto/auth.dto.js";
import { ConflictError, UnauthorizedError, NotFoundError } from "../utils/errors.js";
import { GoogleTokenService } from "./google-token.service.js";

export class AuthService {
  constructor(
    private userRepo = new UserRepository(),
    private googleTokenService = new GoogleTokenService()
  ) {}

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

    // Validar credenciales sin revelar si el usuario existe o usa Google
    if (!user || !user.passwordHash) {
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
  async googleLogin(credential: string) {
    const payload = await this.googleTokenService.verifyIdToken(credential);

    // Buscar usuario existente por email
    let user = await this.userRepo.findByEmail(payload.email);

    if (!user) {
      // Crear nuevo usuario con datos de Google (sin password)
      user = await this.userRepo.createUser({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        profileImage: payload.picture,
        role: "customer",
      });
    } else if (!user.googleId) {
      // Vincular cuenta existente con Google
      user = await this.userRepo.updateUser(user.id, {
        googleId: payload.sub,
        profileImage: payload.picture,
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { passwordHash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
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
