# 24CCR Client Intake Backend

This repository contains the Express/Node.js backend for the 24CCR corporate client intake portal. It exposes a REST API for creating and managing client intake submissions with secure JWT-based admin access.

## Tech Stack

- Node.js + Express.js
- PostgreSQL with Prisma ORM
- JWT authentication for admin dashboard
- Input validation via `express-validator`
- Environment configuration via `.env`

## Prerequisites

- Node.js 18+
- PostgreSQL database

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env` and provide the required values:

   ```bash
   cp .env.example .env
   ```

   Required variables:

   - `DATABASE_URL` – PostgreSQL connection string
   - `PORT` – API port (default 4000)
   - `JWT_SECRET` – secret used to sign JWT tokens
   - `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` – credentials for the seed admin user

3. **Run Prisma migrations**

   ```bash
   npx prisma migrate deploy
   ```

4. **Seed the admin user**

   ```bash
   npm run seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The API is now available at `http://localhost:4000`.

## Available Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Run the API with nodemon (auto-reload) |
| `npm start` | Run the API without auto-reload |
| `npm run migrate` | Apply migrations in production environments |
| `npm run migrate:dev` | Create/apply migrations during development |
| `npm run seed` | Seed (or update) the admin user |

## REST API

### Authentication

- `POST /auth/login`
  - Body: `{ "email": string, "password": string }`
  - Returns: `{ "token": string }`

### Intake

| Method & Path | Auth | Description |
| ------------- | ---- | ----------- |
| `POST /intake` | Public | Create a new intake submission |
| `GET /intake` | JWT | List intakes. Supports `status`, `startDate`, `endDate`, `state`, `companyName` filters |
| `GET /intake/:id` | JWT | Fetch a specific intake |
| `PATCH /intake/:id` | JWT | Update intake details or status |
| `DELETE /intake/:id` | JWT | Delete an intake record (admin only) |

### Validation & Error Handling

All endpoints use `express-validator` and centralized error handling, returning validation errors with HTTP 400 and server errors with HTTP 500.

## Database Schema

Defined in `prisma/schema.prisma` with two models:

- `Intake` – stores incoming client submissions.
- `AdminUser` – admin accounts for the dashboard.

A ready-to-run migration is available in `prisma/migrations`.

## Seeding

`npm run seed` creates or updates the admin user specified by `ADMIN_SEED_EMAIL`/`ADMIN_SEED_PASSWORD`. Run after migrations.

## Health Check

`GET /health` returns `{ "status": "ok" }` for uptime monitoring.

## License

MIT
