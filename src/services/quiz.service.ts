import prisma from '../prisma/client';

export const getAllQuizzes = async (userId: number) => {
    try {
        const quizzes = await prisma.quiz.findMany({ where: { userId } });
        return quizzes;
    } catch (error) {
        throw new Error(`Error al obtener quizzes: ${error}`);
    }
};

export const getQuizById = async (id: number, userId: number) => {
    try {
        const quiz = await prisma.quiz.findFirst({ where: { id, userId } });
        return quiz;
    } catch (error) {
        throw new Error(`Error al obtener quiz: ${error}`);
    }
};

export const createQuiz = async (userId: number, data: { title: string; sourceText: string; questions: any }) => {
    try {
        const quiz = await prisma.quiz.create({
            data: {
                title: data.title,
                sourceText: data.sourceText,
                questions: data.questions,
                userId,
            },
        });
        return quiz;
    } catch (error) {
        throw new Error(`Error al crear quiz: ${error}`);
    }
};

export const updateQuizById = async (id: number, userId: number, data: { title?: string; sourceText?: string; questions?: any }) => {
    try {
        const quiz = await prisma.quiz.updateMany({
            where: { id, userId },
            data,
        });
        return quiz;
    } catch (error) {
        throw new Error(`Error al actualizar quiz: ${error}`);
    }
};

export const deleteQuizById = async (id: number, userId: number) => {
    try {
        const quiz = await prisma.quiz.deleteMany({
            where: { id, userId },
        });
        return quiz;
    } catch (error) {
        throw new Error(`Error al eliminar quiz: ${error}`);
    }
};

export const getRecentQuizzes = async (userId: number, limit: number = 10) => {
    try {
        const quizzes = await prisma.quiz.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        return quizzes;
    } catch (error) {
        throw new Error(`Error al obtener quizzes recientes: ${error}`);
    }
};