// Esta parte nos permite hablar directamente con la base de datos (prisma)

import prisma from '../config/prisma.js';
import type { Role } from '@prisma/client';

export class UserRepository {
    async createUser(data: { name: string; email: string; passwordHash?: string; role: Role; googleId?: string; profileImage?: string }) {
        return prisma.user.create({ data });
    }

    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }

    async findByGoogleId(googleId: string) {
        return prisma.user.findUnique({ where: { googleId } });
    }

    async deleteUser(userId: number) {
        return prisma.user.delete({ where: { id: userId } });
    }

    async findById(userId: number) {
        return prisma.user.findUnique({ where: { id: userId } });
    }

    async updateUser(userId: number, data: { name?: string; email?: string; passwordHash?: string; role?: Role; googleId?: string; profileImage?: string }) {
        return prisma.user.update({ where: { id: userId }, data });
    }
}