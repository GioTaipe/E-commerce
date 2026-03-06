import {
  IsString,
  IsInt,
  Min,
  IsNumber,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

/**
 * 🟢 Crear producto
 */
export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  price!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock!: number;

  // [FIX] Agregado @IsOptional — categoryId es opcional según el schema Prisma
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: "Debe proporcionar un ID de categoría válido" })
  categoryId?: number;
}

/**
 * 🔵 Actualizar producto
 */
export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  // [FIX] Tipo unificado con CreateProductDto — price siempre es number
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: "El precio debe ser un número válido con máximo 2 decimales" })
  price?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: "Debe proporcionar un ID de categoría válido" })
  categoryId?: number;
}

/**
 * ⚪ Respuesta pública (lo que se devuelve al cliente)
 */
export class ProductResponseDto {
  id!: string;
  name!: string;
  description!: string;
  price!: number;
  imageUrl!: string;
  createdAt!: Date;
}
