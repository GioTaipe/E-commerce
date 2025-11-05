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

  async addItemToCart(cartId: number, productId: number, quantity: number) {
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId, productId },
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    return prisma.cartItem.create({
      data: { cartId, productId, quantity },
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
