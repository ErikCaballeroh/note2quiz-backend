import 'dotenv/config';
import bcrypt from 'bcrypt'
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
    console.log('🌱 Seeding database...')

    // Hash password
    const passwordHash = await bcrypt.hash('123456', 10)

    // Create default user
    const user = await prisma.user.upsert({
        where: { email: 'erik@test.com' },
        update: {},
        create: {
            name: 'Erik Caballero',
            email: 'erik@test.com',
            password: passwordHash,
        },
    })

    console.log('✅ User created:', user.email)

    // Quiz 1
    const quiz1 = await prisma.quiz.create({
        data: {
            title: 'Física - Fuerza',
            sourceText:
                'La fuerza es una interacción que puede cambiar el movimiento de un objeto. Se mide en Newtons.',

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
                    question: '¿En qué unidad se mide la fuerza?',
                    options: [
                        { text: 'Newton', isCorrect: true },
                        { text: 'Metro', isCorrect: false },
                        { text: 'Segundo', isCorrect: false },
                        { text: 'Kelvin', isCorrect: false },
                    ],
                },
            ],

            userId: user.id,
        },
    })

    // Quiz 2
    const quiz2 = await prisma.quiz.create({
        data: {
            title: 'Matemáticas - Álgebra',
            sourceText:
                'El álgebra es la rama de las matemáticas que usa símbolos y letras para representar números.',

            questions: [
                {
                    question: '¿Qué usa el álgebra?',
                    options: [
                        { text: 'Símbolos', isCorrect: true },
                        { text: 'Solo números', isCorrect: false },
                        { text: 'Colores', isCorrect: false },
                        { text: 'Figuras', isCorrect: false },
                    ],
                },
            ],

            userId: user.id,
        },
    })

    console.log('✅ Quizzes created')

    // Attempt 1
    await prisma.attempt.create({
        data: {
            score: 80,
            duration: 300,
            userId: user.id,
            quizId: quiz1.id,

            answers: [
                {
                    question: '¿Qué es la fuerza?',
                    selected: 0,
                    correct: true,
                },
            ],
        },
    })

    // Attempt 2
    await prisma.attempt.create({
        data: {
            score: 100,
            duration: 180,
            userId: user.id,
            quizId: quiz2.id,
        },
    })

    console.log('✅ Attempts created')

    console.log('🌱 Seeding completed')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })