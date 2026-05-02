import prisma from '../prisma/client';

const categorySelect = {
    id: true,
    name: true,
};

const quizInclude = {
    category: {
        select: categorySelect,
    },
    attempts: {
        select: {
            score: true
        },
        orderBy: {
            score: 'desc' as const
        },
        take: 1
    }
};

const ensureCategoryBelongsToUser = async (categoryId: number, userId: number) => {
    const category = await prisma.category.findFirst({
        where: {
            id: categoryId,
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!category) {
        throw new Error('Categoría no encontrada');
    }
};

export const getAllQuizzes = async (userId: number) => {
    try {
        const quizzes = await prisma.quiz.findMany({
            where: { userId },
            include: quizInclude,
        });

        return quizzes.map(q => ({
            ...q,
            highestScore: q.attempts[0]?.score ?? null
        }));
    } catch (error) {
        throw new Error(`Error al obtener quizzes: ${error}`);
    }
};

export const getQuizById = async (id: number, userId: number) => {
    try {
        const quiz = await prisma.quiz.findFirst({
            where: { id, userId },
            include: quizInclude,
        });

        if (!quiz) return null;

        return {
            ...quiz,
            highestScore: quiz.attempts[0]?.score ?? null
        };
    } catch (error) {
        throw new Error(`Error al obtener quiz: ${error}`);
    }
};

export const createQuiz = async (userId: number, data: { title: string; sourceText: string; questions: any; categoryId?: number | null }) => {
    try {
        if (data.categoryId !== undefined && data.categoryId !== null) {
            await ensureCategoryBelongsToUser(data.categoryId, userId);
        }

        const quiz = await prisma.quiz.create({
            data: {
                title: data.title,
                sourceText: data.sourceText,
                questions: data.questions,
                userId,
                categoryId: data.categoryId ?? null,
            },
            include: {
                category: {
                    select: categorySelect,
                },
            },
        });
        return quiz;
    } catch (error) {
        throw new Error(`Error al crear quiz: ${error}`);
    }
};

export const updateQuizById = async (id: number, userId: number, data: { title?: string; sourceText?: string; questions?: any; categoryId?: number | null }) => {
    try {
        if (data.categoryId !== undefined && data.categoryId !== null) {
            await ensureCategoryBelongsToUser(data.categoryId, userId);
        }

        const updateData: {
            title?: string;
            sourceText?: string;
            questions?: any;
            categoryId?: number | null;
        } = {};

        if (data.title !== undefined) updateData.title = data.title;
        if (data.sourceText !== undefined) updateData.sourceText = data.sourceText;
        if (data.questions !== undefined) updateData.questions = data.questions;
        if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

        const quiz = await prisma.quiz.updateMany({
            where: { id, userId },
            data: updateData,
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
            include: quizInclude,
        });

        return quizzes.map(q => ({
            ...q,
            highestScore: q.attempts[0]?.score ?? null
        }));
    } catch (error) {
        throw new Error(`Error al obtener quizzes recientes: ${error}`);
    }
};