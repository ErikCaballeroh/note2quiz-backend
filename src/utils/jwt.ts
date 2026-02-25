import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const generateToken = (userId: number, email: string): string => {
    return jwt.sign(
        { id: userId, email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export const verifyToken = (token: string): { id: number; email: string } | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
        return decoded;
    } catch (error) {
        return null;
    }
};
