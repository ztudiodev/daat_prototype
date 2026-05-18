# DAAT - Plataforma de análisis de correos maliciosos

Prototipo MVP de una plataforma web para analizar correos sospechosos usando la API de Gemini.

## Características

- Login con JWT y bcrypt
- Dashboard estilo SOC
- Módulo de análisis de correos
- Integración con Gemini API Key
- Base de datos PostgreSQL via Sequelize
- Roles básicos y seed de usuario demo
- UI Dark Mode con TailwindCSS
- Notificaciones Toast y spinner de carga

## Estructura del proyecto

```
project/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── services/
│   ├── views/
│   ├── public/
│   ├── utils/
│   └── app.js
├── .env
├── .env.example
├── package.json
└── README.md
```

## Requisitos

- Node.js 18+
- PostgreSQL
- Gemini API Key

## Instalación

1. Clona o abre el proyecto.
2. Instala dependencias:

```bash
npm install
```

3. Crea el archivo de entorno desde el ejemplo:

```bash
copy .env.example .env
```

4. Ajusta `DATABASE_URL`, `JWT_SECRET` y `GEMINI_API_KEY` en `.env`.

5. Crea la base de datos PostgreSQL localmente, por ejemplo:

```sql
CREATE DATABASE daat_db;
```

6. Genera el CSS de Tailwind y ejecutar la aplicación:

```bash
npm run dev
```

7. Crea el usuario demo:

```bash
npm run seed
```

## Usuario demo

- Email: `admin@daat.com`
- Password: `Password123*`

## Rutas principales

- `GET /login` - Pantalla de ingreso
- `POST /login` - Autenticación
- `POST /logout` - Cierre de sesión
- `GET /dashboard` - Dashboard principal
- `GET /analysis` - Página de análisis de correos
- `POST /analysis/analyze` - Procesa análisis IA
- `GET /analysis/history` - Historial de análisis

## Integración Gemini

El servicio usa `GEMINI_API_KEY` de Google Cloud y el modelo `GEMINI_MODEL` configurado en `.env`.

> El backend llama directamente al endpoint de Gemini: `https://gemini.googleapis.com/v1/models/${GEMINI_MODEL}:generateText`

## Notas

- El prototipo está enfocado en análisis manual de correos.
- No incluye multi-tenant ni SIEM.
- Los resultados de Gemini se guardan en PostgreSQL.
