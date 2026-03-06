import { CartRepository } from "../repositories/cart.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { AddToCartDto, UpdateCartItemDto } from "../dto/cart.dto.js";
import { NotFoundError, BadRequestError } from "../utils/errors.js";

export class CartService {
    constructor(
        private cartRepository = new CartRepository(),
        // [FIX] Inyectar ProductRepository en vez de importar prisma directamente
        private productRepository = new ProductRepository(),
    ) {}

    // [FIX] Eliminada doble query — si el carrito ya existe se retorna directo
    async getCart(userId: number) {
        const cart = await this.cartRepository.getCartByUserId(userId);
        if (cart) return cart;

        // Crear carrito y retornar con items incluidos
        await this.cartRepository.createCartForUser(userId);
        return this.cartRepository.getCartByUserId(userId);
    }

    // [FIX] Reducidas queries redundantes y usa ProductRepository en vez de prisma directo
    async addToCart(userId: number, data: AddToCartDto) {
        let cart = await this.cartRepository.getCartByUserId(userId);
        if (!cart) {
            await this.cartRepository.createCartForUser(userId);
            cart = await this.cartRepository.getCartByUserId(userId);
        }

        const product = await this.productRepository.findById(data.productId);

        if (!product) throw new NotFoundError("Producto no encontrado");
        if (product.stock < data.quantity) throw new BadRequestError("Stock insuficiente");

        if (!cart) throw new NotFoundError("Carrito no encontrado");
        return this.cartRepository.addItemToCart(cart.id, data.productId, data.quantity);
    }

    async updateItem(userId: number, cartItemId: number, data: UpdateCartItemDto) {
        const item = await this.cartRepository.findItemByIdAndUser(cartItemId, userId);
        if (!item) throw new NotFoundError("Item no encontrado en tu carrito");
        return this.cartRepository.updateItemQuantity(cartItemId, data.quantity);
    }

    async removeItem(userId: number, cartItemId: number) {
        const item = await this.cartRepository.findItemByIdAndUser(cartItemId, userId);
        if (!item) throw new NotFoundError("Item no encontrado en tu carrito");
        return this.cartRepository.removeItem(cartItemId);
    }

    async clearCart(userId: number) {
        const cart = await this.cartRepository.getCartByUserId(userId);
        if (!cart) throw new NotFoundError("Carrito no encontrado");
        return this.cartRepository.clearCart(cart.id);
    }
}
