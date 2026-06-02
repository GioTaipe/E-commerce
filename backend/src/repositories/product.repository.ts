// Repositorio accede a la base de datos
import prisma from '../config/prisma.js';
import type { Prisma } from '@prisma/client';

export class ProductRepository {

    async create(data: Prisma.ProductUncheckedCreateInput) {
        return prisma.product.create({ data });
    }

    async update(id: number, data: Prisma.ProductUncheckedUpdateInput) {
        return prisma.product.update({
            where: { id },
            data,
        });
    }

    // Soft delete: marca el producto como inactivo para preservar el historial
    // de pedidos (OrderItem.product tiene onDelete: Restrict).
    async delete(id: number) {
        return prisma.product.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async findAll(options: { includeInactive?: boolean } = {}) {
        const args: Prisma.ProductFindManyArgs = {
            include: { category: true },
        };
        if (!options.includeInactive) {
            args.where = { isActive: true };
        }
        return prisma.product.findMany(args);
    }

    async findById(id: number) {
        return prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });
    }
}
