import prisma from '../prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
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
                name: true,
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

export const getUserWithStats = async (id: number) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                quizzes: true,
                attempts: true,
            },
        });

        if (!user) {
            return null;
        }

        // Calcular estadísticas
        const numQuizzes = user.quizzes.length;
        const attempts = user.attempts;

        const avgScore = attempts.length > 0
            ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length
            : 0;

        // Convertir duración total de segundos a horas
        const totalDurationSeconds = attempts.reduce((sum, attempt) => sum + attempt.duration, 0);
        const totalHours = totalDurationSeconds / 3600;

        // Retornar datos sin las relaciones crudas
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            numQuizzes,
            avgScore: parseFloat(avgScore.toFixed(2)),
            hoursStudied: parseFloat(totalHours.toFixed(2)),
        };
    } catch (error) {
        throw new Error(`Error al obtener estadísticas del usuario: ${error}`);
    }
};

// Funciones para recuperación de contraseña
export const generatePasswordResetCode = async (email: string) => {
    try {
        // Verificar que el usuario exista
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Generar código de 6 dígitos
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Calcular tiempo de expiración (10 minutos)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Limpiar códigos anteriores no utilizados
        await prisma.passwordReset.deleteMany({
            where: {
                email,
                used: false,
            },
        });

        // Crear nuevo registro de reset
        await prisma.passwordReset.create({
            data: {
                email,
                code,
                expiresAt,
            },
        });

        return { code, expiresAt };
    } catch (error) {
        throw new Error(`Error al generar código de reset: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
};

export const verifyResetCode = async (email: string, code: string) => {
    try {
        // Buscar el registro de reset
        const resetRecord = await prisma.passwordReset.findFirst({
            where: {
                email,
                code,
                used: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!resetRecord) {
            throw new Error('Código de reset no válido');
        }

        // Verificar que el código no haya expirado
        if (new Date() > resetRecord.expiresAt) {
            throw new Error('El código de reset ha expirado');
        }

        const resetToken = crypto.randomUUID().replace(/-/g, '');

        const verifiedRecord = await prisma.passwordReset.update({
            where: { id: resetRecord.id },
            data: {
                verifiedAt: new Date(),
                resetToken,
            },
            select: {
                email: true,
                resetToken: true,
                expiresAt: true,
            },
        });

        return verifiedRecord;
    } catch (error) {
        throw new Error(`Error al validar código: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
};

export const resetPassword = async (email: string, resetToken: string, newPassword: string) => {
    try {
        // Validar el token generado tras verificar el código
        const resetRecord = await prisma.passwordReset.findFirst({
            where: {
                email,
                resetToken,
                used: false,
                verifiedAt: {
                    not: null,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!resetRecord) {
            throw new Error('El proceso de verificación no es válido');
        }

        if (new Date() > resetRecord.expiresAt) {
            throw new Error('El código de reset ha expirado');
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña del usuario
        const user = await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        // Marcar el código como utilizado
        await prisma.passwordReset.update({
            where: { id: resetRecord.id },
            data: {
                used: true,
                resetToken: null,
            },
        });

        return user;
    } catch (error) {
        throw new Error(`Error al resetear contraseña: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
};
