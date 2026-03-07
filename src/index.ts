import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import quizRoutes from './routes/quiz.routes';
import ocrRoutes from './routes/ocr.routes';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.get('/api/', (_, res) => {
    res.send({
        ok: true
    });
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/ocr', ocrRoutes);

// Servidor
app.listen(3000, () => {
    console.log('Servidor en puerto 3000');
});
