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

    async delete(id: number) {
        return prisma.product.delete({
            where: { id },
        });
    }

    async findAll() {
        return prisma.product.findMany({
            include:{
                category:true
            }
        });
    }

    async findById(id: number) {
        return prisma.product.findUnique({
            where: { id },
        });
    }
}