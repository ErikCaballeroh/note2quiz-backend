import prisma from '../prisma/client';
import bcrypt from 'bcrypt';

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

export const createUser = async (email: string, password: string, name: string) => {
    try {
        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error('El usuario ya existe');
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        return user;
    } catch (error) {
        throw new Error(`Error al registrar usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        // Buscar el usuario
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error('Usuario o contraseña incorrecto');
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Usuario o contraseña incorrecto');
        }

        // Retornar datos del usuario sin la contraseña
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        };
    } catch (error) {
        throw new Error(`Error al iniciar sesión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
};
