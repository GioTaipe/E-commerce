import prisma from "../config/prisma.js";

export class OrderRepository {
  async createOrder(userId: number, total: number) {
    return prisma.order.create({
      data: {
        userId,
        total,
        status: "pending",
      },
    });
  }

  async createOrderItems(orderId: number, items: any[]) {
    return prisma.orderItem.createMany({
      data: items.map((item) => ({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.price,
      })),
    });
  }

  async findAllByUser(userId: number) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(orderId: number, userId: number) {
    return prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: { include: { product: true } } },
    });
  }
}
