// Esta parte nos permite hablar directamente con la base de datos (prisma)

import prisma from '../config/prisma.js';

export class UserRepository {
    async createUser(data: { name: string; email: string; passwordHash: string }) { 
        return prisma.user.create({ data });
    }

    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }

    async deleteUser(userId: number) {
        return prisma.user.delete({ where: { id: userId } });
    }

    async updateUser(userId: number, data: { name?: string; email?: string; passwordHash?: string }) {
        return prisma.user.update({ where: { id: userId }, data });
    }
}