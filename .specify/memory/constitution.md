<!--
  Sync Impact Report
  =====================
  Version change: 0.0.0 → 1.0.0 (MAJOR - initial ratification)
  Modified principles: N/A (initial version)
  Added sections:
    - 7 Core Principles: Stack, Security, Data Model, API, Frontend, Infrastructure, Code Quality
    - Target Audience & Vision section
    - Governance section
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no changes needed (Constitution Check section is generic)
    - .specify/templates/spec-template.md ✅ no changes needed
    - .specify/templates/tasks-template.md ✅ no changes needed
  Follow-up TODOs: None
-->

# Learn Constitution

## Vision

Rebuild and modernize "Gorila Studio", a children's educational app
(letter/number tracing, matching games, coloring, free drawing), from a
monolithic client-side vanilla JS app into a full-stack platform with
Laravel 12 backend, PostgreSQL persistence, and Next.js 15 frontend.
Design reference: [Keiki](https://keiki.app/) — clean, modern,
child-friendly UI with engaging animations and accessibility focus.

## Core Principles

### I. Stack (NON-NEGOTIABLE)

- Backend MUST use Laravel 12 on PHP 8.3+
- Database MUST be PostgreSQL
- All database queries MUST use prepared statements; direct SQL
  concatenation is FORBIDDEN
- Frontend MUST use Next.js 15 with TypeScript 5.x in strict mode
- Eloquent ORM is the default data access layer; raw queries MUST use
  parameter binding (`DB::select('... WHERE id = ?', [$id])`)

### II. Security (NON-NEGOTIABLE)

- All user inputs MUST be validated and sanitized server-side
- Authentication MUST be required on every non-public endpoint
- Credentials and secrets MUST live in environment variables; hardcoded
  values are FORBIDDEN
- Session management MUST use HTTP-only cookies
- CSRF protection MUST be enabled on all state-changing endpoints
- File uploads (drawings, stickers) MUST be validated for type and size

### III. Data Model (NON-NEGOTIABLE)

- Every table MUST have `created_at` and `updated_at` timestamps
- Deletion MUST be soft-delete via `deleted_at`; hard deletes are
  FORBIDDEN
- Every foreign key MUST have an index
- Migrations MUST be reversible (`up` and `down`)

### IV. API (NON-NEGOTIABLE)

- Endpoints MUST follow RESTful conventions: GET / POST / PUT / DELETE
- All responses MUST use consistent JSON envelope:
  `{ "success": bool, "data": {}, "error": string }`
- HTTP status codes MUST be semantically correct:
  200, 201, 400, 401, 403, 404, 422, 500
- Pagination MUST use cursor-based or offset pagination with consistent
  `meta` fields

### V. Frontend (NON-NEGOTIABLE)

- TypeScript strict mode MUST be enabled; the `any` type is FORBIDDEN
- Design MUST be modern and minimalist: good typography hierarchy,
  proper spacing, subtle shadows and borders
- All views MUST be mobile-responsive by default
- Architecture MUST be based on reusable, composable components
- Animations MUST be smooth and child-appropriate (reference: Keiki app)
- Color palette MUST be coherent: neutral base + one accent color

### VI. Infrastructure (NON-NEGOTIABLE)

- The application MUST be Docker-ready at all times
- No hardcoded paths or credentials; everything MUST be configurable
  via environment variables
- Containers MUST be stateless; persistent data MUST use volumes
- A `docker-compose.yml` MUST define all services (app, db, frontend)

### VII. Code Quality (NON-NEGOTIABLE)

- Code MUST be readable and documented where logic is non-obvious
- Functions MUST be small and focused (single responsibility)
- Dead code and commented-out blocks are FORBIDDEN
- No `console.log` or `dd()` left in committed code

## Target Audience & Context

- **Primary users**: Children ages 3-7
- **Secondary users**: Parents/guardians (parental controls, progress)
- **Languages**: Spanish, Russian, and English (trilingual UI, alphabets, TTS)
- **Devices**: Tablets and phones (touch-first), desktop secondary
- **Legacy features to rebuild**: Letter tracing, number tracing (0-20),
  matching games (5 modes), coloring book (100+ templates), free drawing,
  progress/banana rewards, parental session timer, audio/TTS

## Governance

- This constitution supersedes all other development practices
- Every PR MUST verify compliance with these principles before merge
- Amendments require: (1) documented rationale, (2) owner approval,
  (3) migration plan for existing code
- Version follows semantic versioning:
  - MAJOR: principle removal or backward-incompatible redefinition
  - MINOR: new principle or materially expanded guidance
  - PATCH: clarifications, wording, typo fixes

**Version**: 1.0.0 | **Ratified**: 2026-02-26 | **Last Amended**: 2026-02-26
