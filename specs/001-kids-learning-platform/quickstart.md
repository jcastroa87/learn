# Quickstart: Kids Learning Platform

**Branch**: `001-kids-learning-platform` | **Date**: 2026-02-26

## Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local frontend development)
- PHP 8.3+ & Composer (for local backend development)
- PostgreSQL 16+ (or use Docker)

## Quick Start (Docker)

```bash
# Clone and checkout feature branch
git clone <repo-url> learn && cd learn
git checkout 001-kids-learning-platform

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Start all services
docker compose up -d

# Run backend migrations and seed data
docker compose exec app php artisan migrate
docker compose exec app php artisan db:seed

# Access the app
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
```

## Local Development (without Docker)

### Backend (Laravel)

```bash
cd backend

# Install dependencies
composer install

# Configure environment
cp .env.example .env
php artisan key:generate

# Set database connection in .env
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=learn
# DB_USERNAME=postgres
# DB_PASSWORD=secret

# Run migrations and seed
php artisan migrate
php artisan db:seed

# Start development server
php artisan serve  # → http://localhost:8000
```

### Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev  # → http://localhost:3000
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_URL` | Laravel app URL | `http://localhost:8000` |
| `FRONTEND_URL` | Next.js frontend URL | `http://localhost:3000` |
| `DB_CONNECTION` | Database driver | `pgsql` |
| `DB_HOST` | Database host | `127.0.0.1` |
| `DB_PORT` | Database port | `5432` |
| `DB_DATABASE` | Database name | `learn` |
| `DB_USERNAME` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | — |
| `SANCTUM_STATEFUL_DOMAINS` | Allowed SPA domains | `localhost:3000` |
| `SESSION_DOMAIN` | Cookie domain | `localhost` |
| `FILESYSTEM_DISK` | Artwork storage disk | `local` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |

## Key Architecture Decisions

- **Auth**: Laravel Sanctum (cookie-based SPA auth) + Fortify (headless auth routes). No tokens in localStorage.
- **Proxy**: Next.js `rewrites` in `next.config.ts` proxy `/api/*` and `/sanctum/*` to Laravel. Browser never makes cross-origin requests.
- **Canvas**: Konva.js via `react-konva` for all drawing/tracing activities. Loaded with `next/dynamic` (SSR-disabled).
- **Undo**: Command pattern with structural sharing, 30-entry circular buffer. No full canvas snapshots.
- **i18n**: `react-i18next` with runtime `changeLanguage()` — language is per child profile, not per URL.
- **Drag & Drop**: `@use-gesture/react` + `react-spring` for game-like interactions (puzzles, fill-gaps, sorting).
- **Audio**: Web Audio API (synthesized effects) + Web Speech API (TTS in es/ru/en).

## Database

7 tables + 1 pivot table:

| Table | Purpose |
|-------|---------|
| `parents` | Parent accounts (extends Laravel User) |
| `child_profiles` | Child profiles with name, age, avatar, language, bananas |
| `progress_records` | Per-item completion tracking (attempted/completed) |
| `artworks` | Saved drawings/colorings (file references) |
| `cosmetic_items` | Shop items (avatars, stickers, backgrounds) |
| `child_cosmetics` | Pivot: which child owns which cosmetic |
| `session_configs` | Per-child settings (time limit, sound) |

Seeded data: 16 base free cosmetics (3 avatars, 10 stickers, 3 backgrounds).

## API Overview

All endpoints use the standard JSON envelope:
```json
{ "success": true, "data": {}, "error": null }
```

See [contracts/api.md](./contracts/api.md) for the full API reference.

## Testing

### Backend
```bash
cd backend
php artisan test                    # Run all tests
php artisan test --filter=Feature   # Feature tests only
php artisan test --filter=Unit      # Unit tests only
```

### Frontend
```bash
cd frontend
npm test                            # Run all tests (Vitest)
npm test -- --watch                 # Watch mode
```
