import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no existe');
}

const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log('Seeding database...');

    const passwordHash = await bcrypt.hash('123456', 10);

    const user = await prisma.user.upsert({
        where: { email: 'erik@test.com' },
        update: {},
        create: {
            name: 'Erik Caballero',
            email: 'erik@test.com',
            password: passwordHash,
        },
    });

    console.log('User created:', user.email);

    const quizzesData = [
        {
            title: 'Física - Fuerza',
            sourceText: 'La fuerza es una interacción que cambia el movimiento de un objeto.',
            questions: [
                {
                    question: '¿Qué es la fuerza?',
                    options: [
                        { text: 'Una interacción', isCorrect: true },
                        { text: 'Una masa', isCorrect: false },
                        { text: 'Una velocidad', isCorrect: false },
                        { text: 'Una energía', isCorrect: false },
                    ],
                },
                {
                    question: '¿En qué unidad se mide?',
                    options: [
                        { text: 'Newton', isCorrect: true },
                        { text: 'Metro', isCorrect: false },
                        { text: 'Segundo', isCorrect: false },
                        { text: 'Kelvin', isCorrect: false },
                    ],
                },
                {
                    question: '¿Qué ley relaciona fuerza y masa?',
                    options: [
                        { text: 'Segunda ley de Newton', isCorrect: true },
                        { text: 'Ley de Ohm', isCorrect: false },
                        { text: 'Ley de Coulomb', isCorrect: false },
                        { text: 'Ley de Gauss', isCorrect: false },
                    ],
                },
                {
                    question: 'Si la fuerza neta es 0...',
                    options: [
                        { text: 'No hay aceleración', isCorrect: true },
                        { text: 'Aumenta la masa', isCorrect: false },
                        { text: 'Disminuye la energía', isCorrect: false },
                        { text: 'Aumenta el tiempo', isCorrect: false },
                    ],
                },
                {
                    question: '¿Qué mide fuerza?',
                    options: [
                        { text: 'Dinamómetro', isCorrect: true },
                        { text: 'Voltímetro', isCorrect: false },
                        { text: 'Termómetro', isCorrect: false },
                        { text: 'Barómetro', isCorrect: false },
                    ],
                },
            ],
        },
        {
            title: 'Matemáticas - Álgebra',
            sourceText: 'El álgebra usa símbolos para representar números.',
            questions: [
                {
                    question: '¿Qué representa una variable?',
                    options: [
                        { text: 'Un valor desconocido', isCorrect: true },
                        { text: 'Un número fijo', isCorrect: false },
                        { text: 'Un ángulo', isCorrect: false },
                        { text: 'Una figura', isCorrect: false },
                    ],
                },
                {
                    question: '2x + 3x =',
                    options: [
                        { text: '5x', isCorrect: true },
                        { text: '6x', isCorrect: false },
                        { text: '5', isCorrect: false },
                        { text: 'x²', isCorrect: false },
                    ],
                },
                {
                    question: '¿Qué es una ecuación?',
                    options: [
                        { text: 'Una igualdad', isCorrect: true },
                        { text: 'Una suma', isCorrect: false },
                        { text: 'Un número', isCorrect: false },
                        { text: 'Un ángulo', isCorrect: false },
                    ],
                },
                {
                    question: 'x + 5 = 10',
                    options: [
                        { text: '5', isCorrect: true },
                        { text: '10', isCorrect: false },
                        { text: '15', isCorrect: false },
                        { text: '0', isCorrect: false },
                    ],
                },
                {
                    question: 'Simplificar significa...',
                    options: [
                        { text: 'Reducir expresión', isCorrect: true },
                        { text: 'Multiplicar', isCorrect: false },
                        { text: 'Dividir', isCorrect: false },
                        { text: 'Eliminar números', isCorrect: false },
                    ],
                },
            ],
        },
        {
            title: 'Programación',
            sourceText: 'La programación permite crear software.',
            questions: [
                {
                    question: '¿Qué es una variable?',
                    options: [
                        { text: 'Espacio de datos', isCorrect: true },
                        { text: 'Programa', isCorrect: false },
                        { text: 'Error', isCorrect: false },
                        { text: 'Archivo', isCorrect: false },
                    ],
                },
                {
                    question: '¿Qué es un loop?',
                    options: [
                        { text: 'Repetición de código', isCorrect: true },
                        { text: 'Error', isCorrect: false },
                        { text: 'Archivo', isCorrect: false },
                        { text: 'Variable', isCorrect: false },
                    ],
                },
                {
                    question: 'Lenguaje web común',
                    options: [
                        { text: 'JavaScript', isCorrect: true },
                        { text: 'COBOL', isCorrect: false },
                        { text: 'Pascal', isCorrect: false },
                        { text: 'Fortran', isCorrect: false },
                    ],
                },
                {
                    question: '¿Qué es una API?',
                    options: [
                        { text: 'Interfaz de programación', isCorrect: true },
                        { text: 'Programa interno', isCorrect: false },
                        { text: 'Archivo web', isCorrect: false },
                        { text: 'Sistema operativo', isCorrect: false },
                    ],
                },
                {
                    question: 'Estructura condicional',
                    options: [
                        { text: 'if', isCorrect: true },
                        { text: 'loop', isCorrect: false },
                        { text: 'print', isCorrect: false },
                        { text: 'import', isCorrect: false },
                    ],
                },
            ],
        },
        {
            title: 'Redes',
            sourceText: 'Las redes permiten comunicación entre dispositivos.',
            questions: [
                {
                    question: 'IP significa',
                    options: [
                        { text: 'Internet Protocol', isCorrect: true },
                        { text: 'Internet Program', isCorrect: false },
                        { text: 'Internal Protocol', isCorrect: false },
                        { text: 'Input Process', isCorrect: false },
                    ],
                },
                {
                    question: 'Dispositivo que conecta redes',
                    options: [
                        { text: 'Router', isCorrect: true },
                        { text: 'Switch', isCorrect: false },
                        { text: 'Hub', isCorrect: false },
                        { text: 'Repeater', isCorrect: false },
                    ],
                },
                {
                    question: 'LAN significa',
                    options: [
                        { text: 'Local Area Network', isCorrect: true },
                        { text: 'Large Area Network', isCorrect: false },
                        { text: 'Local Access Node', isCorrect: false },
                        { text: 'Link Area Network', isCorrect: false },
                    ],
                },
                {
                    question: 'Protocolo web',
                    options: [
                        { text: 'HTTP', isCorrect: true },
                        { text: 'FTP', isCorrect: false },
                        { text: 'SMTP', isCorrect: false },
                        { text: 'SSH', isCorrect: false },
                    ],
                },
                {
                    question: 'Identificador en red',
                    options: [
                        { text: 'IP', isCorrect: true },
                        { text: 'RAM', isCorrect: false },
                        { text: 'CPU', isCorrect: false },
                        { text: 'SSD', isCorrect: false },
                    ],
                },
            ],
        },
        {
            title: 'Bases de Datos',
            sourceText: 'Las bases de datos almacenan información estructurada.',
            questions: [
                {
                    question: '¿Qué es una tabla?',
                    options: [
                        { text: 'Filas y columnas', isCorrect: true },
                        { text: 'Programa', isCorrect: false },
                        { text: 'Servidor', isCorrect: false },
                        { text: 'Archivo', isCorrect: false },
                    ],
                },
                {
                    question: 'Clave primaria',
                    options: [
                        { text: 'Identificador único', isCorrect: true },
                        { text: 'Dato repetido', isCorrect: false },
                        { text: 'Índice secundario', isCorrect: false },
                        { text: 'Campo opcional', isCorrect: false },
                    ],
                },
                {
                    question: 'SQL significa',
                    options: [
                        { text: 'Structured Query Language', isCorrect: true },
                        { text: 'Simple Query Language', isCorrect: false },
                        { text: 'System Query Logic', isCorrect: false },
                        { text: 'Structured Question Logic', isCorrect: false },
                    ],
                },
                {
                    question: 'SELECT hace',
                    options: [
                        { text: 'Consultar datos', isCorrect: true },
                        { text: 'Eliminar datos', isCorrect: false },
                        { text: 'Insertar datos', isCorrect: false },
                        { text: 'Crear tabla', isCorrect: false },
                    ],
                },
                {
                    question: 'INSERT hace',
                    options: [
                        { text: 'Agregar registros', isCorrect: true },
                        { text: 'Eliminar registros', isCorrect: false },
                        { text: 'Actualizar registros', isCorrect: false },
                        { text: 'Leer registros', isCorrect: false },
                    ],
                },
            ],
        },
    ];

    const quizzes = [];

    for (const quizData of quizzesData) {
        const quiz = await prisma.quiz.create({
            data: {
                ...quizData,
                userId: user.id,
            },
        });

        quizzes.push(quiz);
    }

    console.log('Quizzes created');

    for (const quiz of quizzes) {
        for (let i = 0; i < 3; i++) {
            await prisma.attempt.create({
                data: {
                    score: Math.floor(Math.random() * 40) + 60,
                    duration: Math.floor(Math.random() * 300) + 120,
                    userId: user.id,
                    quizId: quiz.id,
                    answers: [],
                },
            });
        }
    }

    console.log('Attempts created');

    console.log('Seeding completed');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });