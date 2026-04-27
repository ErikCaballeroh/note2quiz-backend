import { Request, Response } from 'express';
import { createAttempt, getAttemptsByQuiz } from '../services/attempt.service';

export const createAttemptController = async (
    req: Request<{}, {}, { quizId: number; score: number; duration: number; answers: any }>,
    res: Response
) => {
    const { quizId, score, duration, answers } = req.body;

    try {
        if (!quizId || score === undefined || duration === undefined) {
            return res.status(400).json({
                ok: false,
                message: 'Faltan campos requeridos: quizId, score, duration',
            });
        }

        const attempt = await createAttempt(Number(req.userId), {
            quizId,
            score,
            duration,
            answers,
        });

        res.status(201).json({
            ok: true,
            data: attempt,
            message: 'Intento guardado exitosamente',
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Error al guardar intento',
        });
    }
};

export const getAttemptsByQuizController = async (
    req: Request<{ quizId: string }>,
    res: Response
) => {
    const { quizId } = req.params;

    try {
        const attempts = await getAttemptsByQuiz(Number(quizId), Number(req.userId));
        res.json({
            ok: true,
            data: attempts,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Error al obtener intentos',
        });
    }
};