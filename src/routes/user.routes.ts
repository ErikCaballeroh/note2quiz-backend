import { Router } from 'express';
import { getUsersController, getUserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Proteger las rutas con el middleware de autenticación
router.get('/', authMiddleware, getUsersController);
router.get('/:id', authMiddleware, getUserController);

export default router;