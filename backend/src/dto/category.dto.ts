import {
  IsString,
  IsOptional,
} from "class-validator";

/**
 * 🟢 Crear categoría
 */
export class CreateCategoryDto {
    @IsString()
    name!: string;
}

/**
 * 🔵 Actualizar categoría
 */
export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    name?: string;
}

/**
 * ⚪ Respuesta pública (lo que se devuelve al cliente)
 */
export class CategoryResponseDto {
  id!: string;
  name!: string;
  createdAt!: Date;
}
