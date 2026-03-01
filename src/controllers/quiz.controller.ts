import { Request, Response } from 'express';
import { getAllQuizzes, getQuizById, createQuiz, updateQuizById, deleteQuizById } from '../services/quiz.service';


export const getQuizzesController = async (
    req: Request,
    res: Response
) => {
    try {
        const quizzes = await getAllQuizzes(Number(req.userId));
        res.json({
            ok: true,
            data: quizzes,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Error al obtener quizzes',
        });
    }
};

export const getQuizController = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;

    try {
        const quiz = await getQuizById(Number(id), Number(req.userId));

        if (!quiz) {
            return res.status(404).json({
                ok: false,
                message: 'Quiz no encontrado',
            });
        }

        res.json({
            ok: true,
            data: quiz,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Error al obtener quiz',
        });
    }
};

export const createQuizController = async (
    req: Request<{}, {}, { title: string; sourceText: string; questions: any }>,
    res: Response
) => {
    const { title, sourceText, questions } = req.body;

    try {
        if (!title || !sourceText || !questions) {
            return res.status(400).json({
                ok: false,
                message: 'Faltan campos requeridos: title, sourceText, questions',
            });
        }

        const quiz = await createQuiz(Number(req.userId), {
            title,
            sourceText,
            questions,
        });

        res.status(201).json({
            ok: true,
            data: quiz,
            message: 'Quiz creado exitosamente',
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Error al crear quiz',
        });
    }
};

export const updateQuizController = async (
    req: Request<{ id: string }, {}, { title?: string; sourceText?: string; questions?: any }>,
    res: Response
) => {
    const { id } = req.params;
    const { title, sourceText, questions } = req.body;

    try {
        const quiz = await getQuizById(Number(id), Number(req.userId));

        if (!quiz) {
            return res.status(404).json({
                ok: false,
                message: 'Quiz no encontrado',
            });
        }

        const result = await updateQuizById(Number(id), Number(req.userId), {
            title,
            sourceText,
            questions,
        });

        if (result.count === 0) {
            return res.status(404).json({
                ok: false,
                message: 'Quiz no encontrado',
            });
        }

        res.json({
            ok: true,
            message: 'Quiz actualizado exitosamente',
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Error al actualizar quiz',
        });
    }
};

export const deleteQuizController = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;

    try {
        const quiz = await getQuizById(Number(id), Number(req.userId));

        if (!quiz) {
            return res.status(404).json({
                ok: false,
                message: 'Quiz no encontrado',
            });
        }

        const result = await deleteQuizById(Number(id), Number(req.userId));

        if (result.count === 0) {
            return res.status(404).json({
                ok: false,
                message: 'Quiz no encontrado',
            });
        }

        res.json({
            ok: true,
            message: 'Quiz eliminado exitosamente',
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Error al eliminar quiz',
        });
    }
};