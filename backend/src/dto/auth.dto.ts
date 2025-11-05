import {
  IsString,
  IsEmail,
  MinLength,
  IsIn,
  IsOptional,
  Matches,
} from "class-validator";

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

  @IsOptional()
  @IsIn(["customer", "admin"], {
    message: "El rol debe ser 'customer' o 'admin'",
  })
  role!: "customer" | "admin";
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
  role?: "customer" | "admin";
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
  role!: "customer" | "admin";
  createdAt!: Date;
}
