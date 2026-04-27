import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createAttemptController, getAttemptsByQuizController } from '../controllers/attempt.controller';

const router = Router();

router.post('/', authMiddleware, createAttemptController);
router.get('/:quizId', authMiddleware, getAttemptsByQuizController);

export default router;