# Note2Quiz Backend

Backend REST de la aplicación móvil Note2Quiz. Expone la API que usa la app para autenticación, gestión de usuarios, categorías, quizzes, intentos, OCR y generación de quizzes con IA.

## Descripción

El proyecto está construido con **Express.js** y **TypeScript**, usa **Prisma** para acceso a datos con **MySQL/MariaDB**, y se integra con servicios externos para OCR, generación de preguntas y envío de correos de recuperación de contraseña.

## Tecnologías

- Node.js
- Express.js
- TypeScript
- Prisma Client
- MySQL / MariaDB
- CORS
- JWT
- Bcrypt
- Multer
- Sharp
- Google Generative AI
- Clarifai OCR
- Resend

## Estructura funcional

La API organiza la lógica en los siguientes módulos:

- Autenticación y recuperación de contraseña
- Usuarios con estadísticas básicas
- Categorías de estudio
- Quizzes manuales y generados por IA
- Intentos y resultados de quizzes
- OCR para convertir imágenes en texto

## Requisitos

- Node.js 18 o superior
- MySQL o MariaDB
- Un archivo `.env` con las credenciales de base de datos y claves externas

## Instalación

1. Clona el repositorio.

```bash
git clone https://github.com/ErikCaballeroh/note2quiz-backend.git
cd note2quiz-backend
```

2. Instala dependencias.

```bash
npm install
```

3. Configura las variables de entorno.

```bash
cat > .env <<'EOF'
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/note2quiz"
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=usuario
DATABASE_PASSWORD=contraseña
DATABASE_NAME=note2quiz
JWT_SECRET=super-secret-key
GEMINI_API_KEY=tu_api_key
CLARIFAI_PAT=tu_pat
RESEND_API_KEY=tu_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
EOF
```

4. Genera el cliente de Prisma.

```bash
npx prisma generate
```

5. Aplica las migraciones.

```bash
npx prisma migrate dev
```

6. Opcionalmente, carga datos semilla.

```bash
npx prisma db seed
```

## Variables de entorno

Configura un archivo `.env` en la raíz del proyecto. El backend usa estas variables:

| Variable | Descripción | Requerida |
| --- | --- | --- |
| `DATABASE_URL` | Cadena de conexión usada por Prisma | Sí |
| `DATABASE_HOST` | Host de la base de datos para el adapter de Prisma | Sí |
| `DATABASE_PORT` | Puerto de la base de datos | Sí |
| `DATABASE_USER` | Usuario de la base de datos | Sí |
| `DATABASE_PASSWORD` | Contraseña de la base de datos | Sí |
| `DATABASE_NAME` | Nombre de la base de datos | Sí |
| `JWT_SECRET` | Secreto para firmar y verificar tokens JWT | Recomendado |
| `GEMINI_API_KEY` | API key de Google Gemini para generación de quizzes | Sí para IA |
| `CLARIFAI_PAT` | Token de Clarifai/OpenAI compatible para OCR | Sí para OCR |
| `RESEND_API_KEY` | API key de Resend para correos de reset | Sí para recuperación de contraseña |
| `RESEND_FROM_EMAIL` | Remitente del correo de recuperación | Opcional |

Ejemplo mínimo:

```env
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/note2quiz"
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=usuario
DATABASE_PASSWORD=contraseña
DATABASE_NAME=note2quiz
JWT_SECRET=super-secret-key
GEMINI_API_KEY=tu_api_key
CLARIFAI_PAT=tu_pat
RESEND_API_KEY=tu_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
```

## Scripts

| Script | Descripción |
| --- | --- |
| `npm run dev` | Levanta el servidor en modo desarrollo con recarga automática |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Ejecuta el build compilado |

## Ejecución

### Desarrollo

```bash
npm run dev
```

La API queda disponible en `http://localhost:3000`.

### Verificación rápida

```bash
curl http://localhost:3000/api/
```

Respuesta esperada:

```json
{ "ok": true }
```

## Autenticación

La mayoría de rutas requieren el header:

```http
Authorization: Bearer <token>
```

El token se obtiene en `register` o `login`. Su duración actual es de 7 días.

## Rutas de la API

Base path: `/api`

### Rutas públicas

#### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-reset-code`
- `POST /api/auth/reset-password`


### Rutas protegidas

#### Auth

- `GET /api/auth/me`

#### Users

- `GET /api/users`
- `GET /api/users/:id`

#### Quizzes

- `GET /api/quizzes`
- `GET /api/quizzes/recent?limit=10`
- `GET /api/quizzes/:id`
- `POST /api/quizzes`
- `POST /api/quizzes/generate`
- `PUT /api/quizzes/:id`
- `DELETE /api/quizzes/:id`

#### Categories

- `GET /api/categories`
- `POST /api/categories`
- `GET /api/categories/:id`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

#### Attempts

- `POST /api/attempts`
- `GET /api/attempts/:quizId`

#### OCR

- `POST /api/ocr`

## Detalle de endpoints

### Auth

`POST /api/auth/register`

```json
{
	"name": "Erik",
	"email": "erik@test.com",
	"password": "123456"
}
```

`POST /api/auth/login`

```json
{
	"email": "erik@test.com",
	"password": "123456"
}
```

`GET /api/auth/me` devuelve los datos del usuario autenticado y estadísticas básicas como cantidad de quizzes, promedio de puntaje y horas estudiadas.

`POST /api/auth/forgot-password` envía un código de 6 dígitos por correo.

`POST /api/auth/verify-reset-code` valida el código y devuelve un `resetToken` temporal.

`POST /api/auth/reset-password` actualiza la contraseña usando `email`, `resetToken` y `newPassword`.

### Users

`GET /api/users` lista usuarios básicos.

`GET /api/users/:id` obtiene un usuario básico por id.

### Categories

Las categorías pertenecen al usuario autenticado. No se permiten nombres duplicados por usuario.

`POST /api/categories`

```json
{
	"name": "Matemáticas"
}
```

### Quizzes

Los quizzes guardan el texto fuente, el título, las preguntas en formato JSON y una categoría opcional.

`POST /api/quizzes`

```json
{
	"title": "Álgebra básica",
	"sourceText": "El álgebra usa símbolos...",
	"questions": [
		{
			"question": "¿Qué representa una variable?",
			"options": [
				{ "text": "Un valor desconocido", "isCorrect": true },
				{ "text": "Un número fijo", "isCorrect": false },
				{ "text": "Un ángulo", "isCorrect": false },
				{ "text": "Una figura", "isCorrect": false }
			]
		}
	],
	"categoryId": 1
}
```

`POST /api/quizzes/generate` genera un quiz usando Gemini a partir de `text` y lo guarda inmediatamente en base de datos.

```json
{
	"text": "Apuntes de la clase...",
	"categoryId": 1
}
```

### OCR

`POST /api/ocr` recibe imágenes en multipart form-data con el campo `images` y permite hasta 10 archivos. El texto extraído se limpia y se devuelve concatenado.

### Attempts

`POST /api/attempts`

```json
{
	"quizId": 1,
	"score": 8,
	"duration": 120,
	"answers": []
}
```

`GET /api/attempts/:quizId` devuelve los intentos del usuario autenticado para un quiz concreto.

## Modelo de datos

La base de datos contiene estas entidades principales:

- `User`: nombre, email, contraseña y fecha de creación
- `Category`: categorías por usuario
- `Quiz`: quizzes, texto original y preguntas JSON
- `Attempt`: puntaje, duración y respuestas de cada intento
- `PasswordReset`: flujo de recuperación de contraseña con código y token temporal

## Prisma

Abrir Prisma Studio:

```bash
npx prisma studio
```

Crear una nueva migración:

```bash
npx prisma migrate dev --name <nombre-migracion>
```

## Notas de implementación

- El servidor escucha en el puerto `3000`.
- La API usa `CORS` y `express.json()`.
- La autenticación se basa en JWT firmado con `JWT_SECRET`.
- Las imágenes subidas para OCR se procesan en memoria y se limitan a 5 MB por archivo.
- La generación de quizzes usa el modelo de Gemini configurado en el backend.

## Licencia

ISC
