import {
  IsString,
  IsEmail,
  MinLength,
  IsIn,
  IsOptional,
} from "class-validator";
import type { Role } from "@prisma/client";

/**
 * 🟢 Crear usuario (registro)
 */
export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  password!: string;
}

/**
 * 🔴 Crear usuario con rol (solo admins)
 */
export class CreateUserWithRoleDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  password!: string;

  @IsIn(["customer", "admin"], { message: "El rol debe ser 'customer' o 'admin'" })
  role!: Role;
}

/**
 * 🟡 Login de usuario
 */
export class LoginUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  password!: string;
}

/**
 * 🔵 Actualizar usuario (perfil o datos generales)
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  password?: string;

  @IsOptional()
  @IsIn(["customer", "admin"])
  role?: Role;
}

/**
 * 🟡 Actualizar perfil (nombre y email)
 */
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

/**
 * 🟠 Cambiar contraseña (desde perfil autenticado)
 */
export class ChangePasswordDto {
  @IsString()
  @MinLength(6, { message: "La contraseña actual debe tener al menos 6 caracteres" })
  currentPassword!: string;

  @IsString()
  @MinLength(6, { message: "La nueva contraseña debe tener al menos 6 caracteres" })
  newPassword!: string;
}

/**
 * 🟣 Solicitar restablecimiento de contraseña (por email)
 */
export class ForgotPasswordDto {
  @IsEmail()
  email!: string;
}

/**
 * 🟤 Restablecer contraseña (usando token recibido por email)
 */
export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(6, { message: "La nueva contraseña debe tener al menos 6 caracteres" })
  newPassword!: string;
}

/**
 * ⚪ Respuesta pública (lo que se devuelve al cliente)
 *  – No contiene contraseña ni datos sensibles.
 */
export class UserResponseDto {
  id!: string;
  name!: string;
  email!: string;
  role!: Role;
  createdAt!: Date;
}
