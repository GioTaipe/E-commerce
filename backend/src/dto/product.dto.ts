import {
  IsString,
  IsInt,
  Min,
  IsNumber,
  IsOptional,
  Matches,
} from "class-validator";

/**
 * 🟢 Crear producto
 */
export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Matches(/^\d+(\.\d{1,2})?$/, { message: "El precio debe ser un número válido" })
  price!: number;

  @IsString()
  imageUrl!: string;

  @IsNumber()
  stock!: number;

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

  @IsOptional()
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, { message: "El precio debe ser un número válido" })
  price?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
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
