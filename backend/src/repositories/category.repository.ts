// Repositorio accede a la base de datos
import prisma from '../config/prisma.js';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto.js';

export class CategoryRepository {

    async create(data: CreateCategoryDto) {
        return prisma.category.create({
            data: {
                ...data,
            },
        });
    }

    async update(id: number, data: UpdateCategoryDto) {
        return prisma.category.update({
            where: { id },
            data: {
                ...data,
            },
        });
    }

    async delete(id: number) {
        return prisma.category.delete({
            where: { id },
        });
    }

    async findAll() {
        return prisma.category.findMany();
    }

    async findById(id: number) {
        return prisma.category.findUnique({
            where: { id },
        });
    }
}