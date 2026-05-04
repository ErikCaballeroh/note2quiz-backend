import { Request, Response } from 'express';
import { createUser, loginUser, getUserWithStats, generatePasswordResetCode, verifyResetCode, resetPassword } from '../services/user.service';
import { generateToken } from '../utils/jwt';
import { resend } from '../config/resend';
import { generatePasswordResetEmail } from '../templates/passwordReset.template';

export const registerController = async (
    req: Request<{}, {}, { email: string; password: string; name: string }>,
    res: Response
) => {
    console.log("registerController llamado", req.body); // <- agrega esta línea
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
        console.log("usuario creado:", user);
        // Generar token JWT
        const token = generateToken(user.id, user.email);

        res.status(201).json({
            ok: true,
            data: user,
            token,
            message: 'Usuario registrado exitosamente',
        });
    } catch (error) {
        console.log("error en register:", error);
        res.status(400).json({
            ok: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
        });
    }
};

export const loginController = async (
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

export const getMeController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                ok: false,
                error: 'Usuario no autenticado',
            });
        }

        const user = await getUserWithStats(userId);

        if (!user) {
            return res.status(404).json({
                ok: false,
                error: 'Usuario no encontrado',
            });
        }

        res.json({
            ok: true,
            data: user,
            message: 'Información del usuario obtenida exitosamente',
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
        });
    }
};

// Controladores para recuperación de contraseña
export const requestPasswordResetController = async (
    req: Request<{}, {}, { email: string }>,
    res: Response
) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                ok: false,
                error: 'Email es requerido',
            });
        }

        // Generar código de reset
        const { code, expiresAt } = await generatePasswordResetCode(email);

        // Enviar correo con el código
        const emailResponse = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: 'Código para recuperar tu contraseña - Note2Quiz',
            html: generatePasswordResetEmail(code),
        });

        if (emailResponse.error) {
            throw new Error(`Error al enviar correo: ${emailResponse.error.message}`);
        }

        res.json({
            ok: true,
            message: 'Código de reset enviado al correo electrónico',
            expiresAt,
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
        });
    }
};

export const verifyResetCodeController = async (
    req: Request<{}, {}, { email: string; code: string }>,
    res: Response
) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                ok: false,
                error: 'Email y código son requeridos',
            });
        }

        const verified = await verifyResetCode(email, code);

        res.json({
            ok: true,
            message: 'Código verificado exitosamente',
            data: verified,
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
        });
    }
};

export const resetPasswordController = async (
    req: Request<{}, {}, { email: string; resetToken: string; newPassword: string }>,
    res: Response
) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        if (!email || !resetToken || !newPassword) {
            return res.status(400).json({
                ok: false,
                error: 'Email, token y nueva contraseña son requeridos',
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                ok: false,
                error: 'La contraseña debe tener al menos 6 caracteres',
            });
        }

        const user = await resetPassword(email, resetToken, newPassword);

        res.json({
            ok: true,
            message: 'Contraseña actualizada exitosamente',
            data: user,
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
        });
    }
};
