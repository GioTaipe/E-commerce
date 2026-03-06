import prisma from "../config/prisma.js";

export class OrderRepository {
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
