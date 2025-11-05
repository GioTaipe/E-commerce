// Repositorio accede a la base de datos
import prisma from '../config/prisma.js';
import { CreateProductDto } from '../dto/product.dto.js';

export class ProductRepository {

    async create(data: CreateProductDto) {
        return prisma.product.create({
            data: {
                ...data,
                imageUrl: data.imageUrl ?? '',
            },
        });
    }

    async update(id: number, data: any) {
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
        return prisma.product.findMany();
    }

    async findById(id: number) {
        return prisma.product.findUnique({
            where: { id },
        });
    }
}