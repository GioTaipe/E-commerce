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

    // [FIX] Borra el carrito (y sus items en cascada) antes que el usuario para no
    // chocar con la FK Cart.userId. Si el usuario tiene pedidos, user.delete lanzará
    // P2003 (Order.userId es Restrict), que el servicio traduce a un 409 limpio.
    async deleteUser(userId: number) {
        return prisma.$transaction(async (tx) => {
            await tx.cart.deleteMany({ where: { userId } });
            return tx.user.delete({ where: { id: userId } });
        });
    }

    async findById(userId: number) {
        return prisma.user.findUnique({ where: { id: userId } });
    }

    async updateUser(userId: number, data: { name?: string; email?: string; passwordHash?: string; role?: Role; googleId?: string; profileImage?: string }) {
        return prisma.user.update({ where: { id: userId }, data });
    }
}