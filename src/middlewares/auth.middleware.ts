import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

// Extender el tipo Request para incluir el usuario
declare global {
    namespace Express {
        interface Request {
            userId?: number;
            userEmail?: string;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                ok: false,
                error: 'Token no proporcionado',
            });
        }

        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : authHeader;

        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({
                ok: false,
                error: 'Token inválido o expirado',
            });
        }

        // Adjuntar datos del usuario al request
        req.userId = decoded.id;
        req.userEmail = decoded.email;

        next();
    } catch (error) {
        res.status(401).json({
            ok: false,
            error: 'Error al verificar token',
        });
    }
};
