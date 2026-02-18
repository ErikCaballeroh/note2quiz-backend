# Note2Quiz Backend

Backend de la aplicación Note2Quiz, un servicio para convertir notas en cuestionarios interactivos.

## 📋 Descripción

Este es un servidor REST API construido con **Express.js** y **TypeScript** que proporciona funcionalidades para gestionar usuarios y autenticación de la aplicación Note2Quiz.

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **TypeScript** - Lenguaje de programación tipado
- **Prisma** - ORM moderno para bases de datos
- **MySQL** - Base de datos
- **CORS** - Control de acceso entre orígenes
- **dotenv** - Gestión de variables de entorno

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <URL-del-repositorio>
cd note2quiz-backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear un archivo `.env` en la raíz del proyecto:
```env
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/note2quiz"
```

4. **Ejecutar prisma**
```bash
npx prisma generate
```

5. **Ejecutar migraciones de la base de datos**
```bash
npx prisma migrate dev
```

6. **Poblar la base de datos (opcional)**
```bash
npx prisma db seed
```

## 🚀 Uso

### Modo desarrollo
```bash
npm run dev
```
El servidor se iniciará en `http://localhost:3000`

## 🔧 Configuración de Prisma

Ver y editar el esquema:
```bash
npx prisma studio
```

Crear una nueva migración:
```bash
npx prisma migrate dev --name <nombre-migracion>
```

## 📝 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de conexión a MariaDB | `mysql://user:pass@localhost:3306/db` |

## 📄 Licencia

ISC
