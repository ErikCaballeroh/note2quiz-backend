import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
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
    console.log("Seeding database...");

    const adminEmail = "admin@note2quiz.com";

    const adminExists = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!adminExists) {
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: "admin123", // luego la encriptas
            },
        });

        console.log("Usuario admin creado");
    } else {
        console.log("Usuario admin ya existe");
    }
}

main()
    .catch((e) => {
        console.error("Error en seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
