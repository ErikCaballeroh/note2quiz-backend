import { Router } from 'express';
import { registerController, loginController, getMeController, requestPasswordResetController, resetPasswordController, verifyResetCodeController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', authMiddleware, getMeController);
router.post('/forgot-password', requestPasswordResetController);
router.post('/verify-reset-code', verifyResetCodeController);
router.post('/reset-password', resetPasswordController);

export default router;
