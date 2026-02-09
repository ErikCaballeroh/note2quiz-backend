import { Request, Response } from 'express';
import { getAllUsers, getUserById } from '../services/userService';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.json({
            ok: true,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
        });
    }
};

export const getUser = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const { id } = req.params;
        const user = await getUserById(parseInt(id));

        if (!user) {
            return res.status(404).json({
                ok: false,
                error: 'Usuario no encontrado',
            });
        }

        res.json({
            ok: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
        });
    }
};
