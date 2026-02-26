# Implementation Plan: Kids Learning Platform

**Branch**: `001-kids-learning-platform` | **Date**: 2026-02-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-kids-learning-platform/spec.md`

## Summary

Rebuild Gorila Studio as a full-stack children's educational platform with 9 activity modules (letter tracing, number tracing, matching, coloring, free drawing, memory cards, puzzles, fill the gaps, sorting), parent/child profiles, banana reward economy with cosmetics shop, trilingual support (ES/RU/EN), and artwork gallery. Backend uses Laravel 12 with Sanctum+Fortify for cookie-based SPA auth, PostgreSQL for persistence. Frontend uses Next.js 15 with TypeScript strict, Konva.js for canvas activities, react-i18next for runtime language switching, and @use-gesture/react for touch-first drag-and-drop interactions.

## Technical Context

**Language/Version**: PHP 8.3+ (backend), TypeScript 5.x strict (frontend)
**Primary Dependencies**: Laravel 12, Sanctum, Fortify, Next.js 15, react-konva, react-i18next, @use-gesture/react, react-spring
**Storage**: PostgreSQL (7 tables + 1 pivot), Laravel filesystem for artwork uploads
**Testing**: PHPUnit (backend), Vitest + React Testing Library (frontend)
**Target Platform**: Web (iPad primary, phone secondary, desktop tertiary) — Safari 16+, Chrome
**Project Type**: Web application (monorepo: backend + frontend)
**Performance Goals**: Canvas 60fps, activity load <3s, TTS <500ms latency, no frame drops with 30 undo entries
**Constraints**: Touch-first (44x44pt minimum targets), online-first (no offline sync engine), max 50 artworks per child
**Scale/Scope**: Personal/educational project, ~15 screens, 9 activity modules, 3 languages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Stack | PASS | Laravel 12 PHP 8.3+ backend, PostgreSQL, Next.js 15 TypeScript strict |
| II. Security | PASS | Sanctum HTTP-only cookies, Fortify server-side validation, CSRF via XSRF-TOKEN, env vars for credentials |
| III. Data Model | PASS | All 7 tables have created_at/updated_at, soft deletes via deleted_at, all FKs indexed |
| IV. API | PASS | RESTful endpoints, consistent `{ success, data, error }` envelope, correct HTTP status codes |
| V. Frontend | PASS | TypeScript strict (no `any`), modern/minimalist design, mobile-responsive, component-based |
| VI. Infrastructure | PASS | docker-compose.yml with app/db/frontend services, env-configurable, stateless containers |
| VII. Code Quality | PASS | Small focused functions, no dead code, documented where non-obvious |

**Post-Phase 1 re-check**: All 7 principles verified against data-model.md and contracts/api.md. No violations found.

## Project Structure

### Documentation (this feature)

```text
specs/001-kids-learning-platform/
├── plan.md              # This file
├── research.md          # Phase 0: Technology decisions (8 research areas)
├── data-model.md        # Phase 1: 7 PostgreSQL tables + pivot + seeded data
├── quickstart.md        # Phase 1: Developer setup guide
├── contracts/
│   └── api.md           # Phase 1: Full REST API contract (all endpoints)
├── checklists/
│   ├── requirements.md  # Spec quality validation
│   └── review-acceptance.md  # Review & acceptance checklist (39/46 passing)
└── tasks.md             # Phase 2: (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/           # Fortify overrides (RegisteredUserController, etc.)
│   │   │   ├── ChildProfileController.php
│   │   │   ├── ProgressController.php
│   │   │   ├── ArtworkController.php
│   │   │   ├── CosmeticController.php
│   │   │   ├── SessionConfigController.php
│   │   │   └── DashboardController.php
│   │   ├── Middleware/
│   │   │   └── JsonResponseEnvelope.php   # Wraps all responses in { success, data, error }
│   │   └── Requests/          # Form request validation classes
│   ├── Models/
│   │   ├── Parent.php          # (extends User) with SoftDeletes
│   │   ├── ChildProfile.php    # with SoftDeletes
│   │   ├── ProgressRecord.php
│   │   ├── Artwork.php         # with SoftDeletes
│   │   ├── CosmeticItem.php
│   │   └── SessionConfig.php
│   ├── Policies/               # Authorization (parent owns child, etc.)
│   └── Services/
│       ├── BananaService.php   # Award/deduct banana logic
│       └── ProgressService.php # State transition logic
├── database/
│   ├── migrations/             # Reversible migrations for all 7+1 tables
│   └── seeders/
│       └── CosmeticItemSeeder.php  # Base free cosmetics (16 items)
├── routes/
│   ├── api.php                 # All /api/* routes
│   └── web.php                 # Fortify auth routes (login, register, etc.)
├── storage/
│   └── app/artworks/           # Uploaded artwork files
├── tests/
│   ├── Feature/                # API endpoint tests
│   └── Unit/                   # Service/model unit tests
├── Dockerfile
└── .env.example

frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Login, register, verify-email, forgot-password
│   │   ├── (app)/              # Authenticated layout
│   │   │   ├── profiles/       # Child profile selector
│   │   │   ├── menu/           # Main activity hub
│   │   │   ├── activities/
│   │   │   │   ├── letter-tracing/
│   │   │   │   ├── number-tracing/
│   │   │   │   ├── matching/
│   │   │   │   ├── coloring/
│   │   │   │   ├── free-drawing/
│   │   │   │   ├── memory-cards/
│   │   │   │   ├── puzzles/
│   │   │   │   ├── fill-the-gaps/
│   │   │   │   └── sorting/
│   │   │   ├── shop/           # Cosmetics shop
│   │   │   ├── gallery/        # Artwork gallery
│   │   │   └── dashboard/      # Parent dashboard
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                 # Reusable UI components (Button, Card, Modal, etc.)
│   │   ├── canvas/             # Konva-based canvas components
│   │   │   ├── TracingCanvas.tsx
│   │   │   ├── ColoringCanvas.tsx
│   │   │   ├── DrawingCanvas.tsx
│   │   │   └── PuzzleCanvas.tsx
│   │   ├── activities/         # Activity-specific components
│   │   └── layout/             # Nav, TopBar, ProfileSelector, etc.
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useChildProfile.ts
│   │   ├── useProgress.ts
│   │   ├── useUndoRedo.ts      # Command pattern implementation
│   │   ├── useSessionTimer.ts
│   │   └── useAudio.ts         # Web Audio + TTS
│   ├── lib/
│   │   ├── api.ts              # API client (fetch wrapper with CSRF)
│   │   ├── i18n.ts             # react-i18next config
│   │   └── audio.ts            # Sound synthesis utilities
│   ├── data/
│   │   ├── waypoints/          # Letter/number tracing coordinates (JSON)
│   │   ├── matching/           # Trilingual word/image pairs (JSON)
│   │   ├── coloring/           # SVG template data
│   │   ├── puzzles/            # Puzzle image references
│   │   ├── fill-the-gaps/      # Scene definitions
│   │   └── sorting/            # Category/object mappings
│   ├── locales/
│   │   ├── es/                 # Spanish translations
│   │   ├── ru/                 # Russian translations
│   │   └── en/                 # English translations
│   └── types/                  # TypeScript type definitions
├── public/
│   └── assets/                 # Static images, icons, avatars
├── tests/
│   ├── components/             # Component tests (Vitest + RTL)
│   └── hooks/                  # Hook tests
├── next.config.ts              # Includes rewrites proxy to Laravel
├── Dockerfile
└── tsconfig.json               # strict: true

docker-compose.yml              # app (Laravel), db (PostgreSQL), frontend (Next.js)
```

**Structure Decision**: Monorepo with `backend/` (Laravel 12) and `frontend/` (Next.js 15) at the repository root, sharing a single `docker-compose.yml`. This matches the user's explicit requirement of "backend separado de frontend, carpeta backend, carpeta frontend en el mismo repositorio." The Next.js `rewrites` proxy pattern means the browser only talks to the frontend origin, eliminating CORS and `SameSite` cookie complexity.

## Complexity Tracking

> No constitution violations to justify. All 7 principles are satisfied by the design.
