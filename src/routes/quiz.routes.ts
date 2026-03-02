import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createQuizController, deleteQuizController, getQuizController, getQuizzesController, updateQuizController, getRecentQuizzesController } from '../controllers/quiz.controller';

const router = Router();

// Proteger las rutas con el middleware de autenticación
router.get('/recent', authMiddleware, getRecentQuizzesController);
router.get('/', authMiddleware, getQuizzesController);
router.post('/', authMiddleware, createQuizController);
router.get('/:id', authMiddleware, getQuizController);
router.put('/:id', authMiddleware, updateQuizController);
router.delete('/:id', authMiddleware, deleteQuizController);

export default router;