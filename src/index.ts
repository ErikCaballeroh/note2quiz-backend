import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';

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

// Servidor
app.listen(3000, () => {
    console.log('Servidor en puerto 3000');
});
