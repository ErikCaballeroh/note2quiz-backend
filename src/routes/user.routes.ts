import { Router } from 'express';
import { getUsers, getUser } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Proteger las rutas con el middleware de autenticación
router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUser);

export default router;