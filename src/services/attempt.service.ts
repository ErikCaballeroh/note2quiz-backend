import prisma from '../prisma/client';

export const createAttempt = async (
    userId: number,
    data: { quizId: number; score: number; duration: number; answers: any }
) => {
    try {
        const attempt = await prisma.attempt.create({
            data: {
                userId,
                quizId: data.quizId,
                score: data.score,
                duration: data.duration,
                answers: data.answers,
            },
        });
        return attempt;
    } catch (error) {
        throw new Error(`Error al crear intento: ${error}`);
    }
};

export const getAttemptsByQuiz = async (quizId: number, userId: number) => {
    try {
        return await prisma.attempt.findMany({
            where: { quizId, userId },
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        throw new Error(`Error al obtener intentos: ${error}`);
    }
};