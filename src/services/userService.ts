import prisma from '../prisma/client';

export const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });
        return users;
    } catch (error) {
        throw new Error(`Error al obtener usuarios: ${error}`);
    }
};

export const getUserById = async (id: number) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });
        return user;
    } catch (error) {
        throw new Error(`Error al obtener usuario: ${error}`);
    }
};
