import { IsInt, Min } from "class-validator";

export class AddToCartDto {
  @IsInt()
  productId!: number;

  @IsInt()
  @Min(1, { message: "La cantidad debe ser al menos 1" })
  quantity!: number;
}

export class UpdateCartItemDto {
  @IsInt()
  @Min(1, { message: "La cantidad debe ser al menos 1" })
  quantity!: number;
}
