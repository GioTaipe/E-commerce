import { CartRepository } from "../repositories/cart.repository.js";
import { AddToCartDto, UpdateCartItemDto } from "../dto/cart.dto.js";
import prisma from "../config/prisma.js";

const cartRepository = new CartRepository();

export class CartService {
    async getCart(userId: number) {
        let cart = await cartRepository.getCartByUserId(userId);
        if (!cart) {
            await cartRepository.createCartForUser(userId);
        }
        return cartRepository.getCartByUserId(userId);
    }

    async addToCart(userId: number, data: AddToCartDto) {
        let cart = await cartRepository.getCartByUserId(userId);
        if (!cart) {
            await cartRepository.createCartForUser(userId);
            cart = await cartRepository.getCartByUserId(userId);
        }

        const product = await prisma.product.findUnique({
            where: { id: data.productId },
        });

        if (!product) throw new Error("Producto no encontrado");
        if (product.stock < data.quantity) throw new Error("Stock insuficiente");

        if (!cart) throw new Error("Carrito no encontrado");
        return cartRepository.addItemToCart(cart.id, data.productId, data.quantity);
    }

    async updateItem(cartItemId: number, data: UpdateCartItemDto) {
        return cartRepository.updateItemQuantity(cartItemId, data.quantity);
    }

    async removeItem(cartItemId: number) {
        return cartRepository.removeItem(cartItemId);
    }

    async clearCart(userId: number) {
        const cart = await cartRepository.getCartByUserId(userId);
        if (!cart) throw new Error("Carrito no encontrado");
        return cartRepository.clearCart(cart.id);
    }
}
