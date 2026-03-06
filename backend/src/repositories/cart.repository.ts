import prisma from "../config/prisma.js";

export class CartRepository {
  async getCartByUserId(userId: number) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async createCartForUser(userId: number) {
    return prisma.cart.create({
      data: { userId },
    });
  }

  // [FIX] Upsert atómico en vez de check-then-act — previene race condition
  // con requests concurrentes que duplicaban items (violando @@unique([cartId, productId]))
  async addItemToCart(cartId: number, productId: number, quantity: number) {
    return prisma.cartItem.upsert({
      where: { cartId_productId: { cartId, productId } },
      update: { quantity: { increment: quantity } },
      create: { cartId, productId, quantity },
    });
  }

  async findItemByIdAndUser(cartItemId: number, userId: number) {
    return prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: { userId },
      },
    });
  }

  async updateItemQuantity(cartItemId: number, quantity: number) {
    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  async removeItem(cartItemId: number) {
    return prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async clearCart(cartId: number) {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}
