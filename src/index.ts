import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

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

// Servidor
app.listen(3000, () => {
    console.log('Servidor en puerto 3000');
});
