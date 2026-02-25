import { Request, Response } from 'express';
import { createUser, loginUser } from '../services/user.service';
import { generateToken } from '../utils/jwt';

export const register = async (
    req: Request<{}, {}, { email: string; password: string; name: string }>,
    res: Response
) => {
    try {
        const { email, password, name } = req.body;

        // Validar que los campos necesarios estén presentes
        if (!email || !password || !name) {
            return res.status(400).json({
                ok: false,
                error: 'Email, contraseña y nombre son requeridos',
            });
        }

        const user = await createUser(email, password, name);

        // Generar token JWT
        const token = generateToken(user.id, user.email);

        res.status(201).json({
            ok: true,
            data: user,
            token,
            message: 'Usuario registrado exitosamente',
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
        });
    }
};

export const login = async (
    req: Request<{}, {}, { email: string; password: string }>,
    res: Response
) => {
    try {
        const { email, password } = req.body;

        // Validar que los campos necesarios estén presentes
        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                error: 'Email y contraseña son requeridos',
            });
        }

        const user = await loginUser(email, password);

        // Generar token JWT
        const token = generateToken(user.id, user.email);

        res.json({
            ok: true,
            data: user,
            token,
            message: 'Sesión iniciada exitosamente',
        });
    } catch (error) {
        res.status(401).json({
            ok: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
        });
    }
};
