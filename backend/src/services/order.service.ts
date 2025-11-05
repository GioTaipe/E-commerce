import prisma from "../config/prisma.js";
import { OrderRepository } from "../repositories/order.repository.js";
import { CartRepository } from "../repositories/cart.repository.js";

const orderRepository = new OrderRepository();
const cartRepository = new CartRepository();

export class OrderService {
  async createOrder(userId: number) {
    // 1️⃣ Obtener el carrito
    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new Error("El carrito está vacío");
    }

    // 2️⃣ Calcular total
    let total = 0;
    for (const item of cart.items) {
      total += item.quantity * item.product.price;
    }

    // 3️⃣ Transacción
    return prisma.$transaction(async (tx) => {
      // Crear la orden
      const order = await tx.order.create({
        data: {
          userId,
          total,
          status: "pending",
        },
      });

      // Crear los items de la orden
      const orderItemsData = cart.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
      }));

      await tx.orderItem.createMany({ data: orderItemsData });

      // Reducir stock de productos
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Vaciar el carrito
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }

  async getUserOrders(userId: number) {
    return orderRepository.findAllByUser(userId);
  }

  async getOrderById(userId: number, orderId: number) {
    const order = await orderRepository.findById(orderId, userId);
    if (!order) throw new Error("Orden no encontrada");
    return order;
  }
}
