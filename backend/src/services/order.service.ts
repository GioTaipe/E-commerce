import prisma from "../config/prisma.js";
import { OrderRepository } from "../repositories/order.repository.js";
import { CartRepository } from "../repositories/cart.repository.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";

export class OrderService {
  constructor(
    private orderRepository = new OrderRepository(),
    private cartRepository = new CartRepository(),
  ) {}
  async createOrder(userId: number) {
    // 1️⃣ Obtener el carrito
    const cart = await this.cartRepository.getCartByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestError("El carrito está vacío");
    }

    // 2️⃣ Calcular total
    let total = 0;
    for (const item of cart.items) {
      total += item.quantity * Number(item.product.price);
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

      // Reducir stock de productos (verificación atómica para evitar stock negativo)
      for (const item of cart.items) {
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity },
          },
          data: { stock: { decrement: item.quantity } },
        });

        if (updated.count === 0) {
          throw new BadRequestError(
            `Stock insuficiente para el producto "${item.product.name}"`
          );
        }
      }

      // Vaciar el carrito
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }

  async getUserOrders(userId: number) {
    return this.orderRepository.findAllByUser(userId);
  }

  async getOrderById(userId: number, orderId: number) {
    const order = await this.orderRepository.findById(orderId, userId);
    if (!order) throw new NotFoundError("Orden no encontrada");
    return order;
  }
}
