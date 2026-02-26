# Data Model: Kids Learning Platform

**Branch**: `001-kids-learning-platform` | **Date**: 2026-02-26

## Entity Relationship Overview

```
Parent (1) ──── (N) ChildProfile
ChildProfile (1) ──── (N) ProgressRecord
ChildProfile (1) ──── (N) Artwork
ChildProfile (N) ──── (N) CosmeticItem  (via child_cosmetics pivot)
ChildProfile (1) ──── (1) SessionConfig
```

## Tables

### parents

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT PK | auto-increment | |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Validated format server-side |
| email_verified_at | TIMESTAMP | NULLABLE | NULL = unverified (FR-048) |
| password | VARCHAR(255) | NOT NULL | Bcrypt hashed, min 8 chars (FR-001) |
| remember_token | VARCHAR(100) | NULLABLE | Laravel session remember |
| created_at | TIMESTAMP | NOT NULL | Constitution III |
| updated_at | TIMESTAMP | NOT NULL | Constitution III |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete (FR-054) |

**Indexes**: `email` (unique)

### child_profiles

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT PK | auto-increment | |
| parent_id | BIGINT FK | NOT NULL, INDEX | → parents.id |
| name | VARCHAR(100) | NOT NULL | Child's display name |
| age | SMALLINT | NOT NULL | 1-12, validated server-side |
| avatar | VARCHAR(50) | NOT NULL | Slug reference to avatar asset |
| language | VARCHAR(5) | NOT NULL, DEFAULT 'es' | 'es', 'ru', or 'en' (FR-025) |
| bananas | INTEGER | NOT NULL, DEFAULT 0 | Accumulated reward count (FR-017) |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete (FR-041) |

**Indexes**: `parent_id` (FK index), `(parent_id, deleted_at)` (scoped queries)

**Validation**: Max 5 active profiles per parent (FR-003), enforced at application level.

### progress_records

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT PK | auto-increment | |
| child_profile_id | BIGINT FK | NOT NULL, INDEX | → child_profiles.id |
| module_type | VARCHAR(30) | NOT NULL | 'letter_tracing', 'number_tracing', 'matching', 'coloring', 'free_drawing', 'memory_cards', 'puzzles', 'fill_the_gaps', 'sorting' |
| item_identifier | VARCHAR(50) | NOT NULL | e.g., 'A', '5', 'colors_round_1', 'template_cat_01' |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'attempted' | 'attempted' or 'completed' (FR-016) |
| metadata | JSONB | NULLABLE | Module-specific: error_count, tap_count, difficulty, duration_seconds (accumulated active time), etc. |
| created_at | TIMESTAMP | NOT NULL | First interaction time |
| updated_at | TIMESTAMP | NOT NULL | Last status change |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete (FR-041 cascade) |

**Indexes**: `child_profile_id` (FK), `(child_profile_id, module_type)` (module progress queries), `(child_profile_id, module_type, item_identifier)` UNIQUE (one record per item per child)

**State Transitions** (FR-016):
- Row created with `status = 'attempted'` on first interaction
- Updated to `status = 'completed'` when completion criteria met
- No reverse transitions (completed stays completed)

### artworks

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT PK | auto-increment | |
| child_profile_id | BIGINT FK | NOT NULL, INDEX | → child_profiles.id |
| activity_type | VARCHAR(20) | NOT NULL | 'coloring' or 'free_drawing' |
| file_path | VARCHAR(500) | NOT NULL | Storage path (e.g., 'artworks/child_1/abc123.webp') |
| file_size | INTEGER | NOT NULL | Bytes, validated max on upload |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

**Indexes**: `child_profile_id` (FK), `(child_profile_id, created_at DESC)` (gallery ordering)

**Limit**: Max 50 per child (FR-046). Enforced at application level — oldest-first rotation.

### cosmetic_items

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT PK | auto-increment | |
| category | VARCHAR(20) | NOT NULL | 'avatar', 'sticker', or 'background' |
| slug | VARCHAR(50) | UNIQUE, NOT NULL | Unique identifier for asset lookup |
| name_key | VARCHAR(100) | NOT NULL | i18n translation key |
| preview_path | VARCHAR(500) | NOT NULL | Path to preview image |
| banana_cost | INTEGER | NOT NULL, DEFAULT 0 | 0 = free base item (FR-044) |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete (Constitution III) |

**Indexes**: `category` (filtered queries), `slug` (unique)

### child_cosmetics (pivot)

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT PK | auto-increment | |
| child_profile_id | BIGINT FK | NOT NULL, INDEX | → child_profiles.id |
| cosmetic_item_id | BIGINT FK | NOT NULL, INDEX | → cosmetic_items.id |
| created_at | TIMESTAMP | NOT NULL | Purchase/unlock time |
| updated_at | TIMESTAMP | NOT NULL | |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete (FR-041 cascade) |

**Indexes**: `(child_profile_id, cosmetic_item_id)` UNIQUE (prevent double-purchase)

### session_configs

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT PK | auto-increment | |
| child_profile_id | BIGINT FK | UNIQUE, NOT NULL | → child_profiles.id (1:1) |
| time_limit_minutes | SMALLINT | NOT NULL, DEFAULT 20 | FR-020 |
| sound_enabled | BOOLEAN | NOT NULL, DEFAULT true | |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete (FR-041 cascade) |

**Indexes**: `child_profile_id` (unique FK)

## Seeded Data

### cosmetic_items (base free set — FR-044)

| category | slug | banana_cost | Notes |
|----------|------|-------------|-------|
| avatar | avatar-gorilla | 0 | Default |
| avatar | avatar-panda | 0 | Free |
| avatar | avatar-bunny | 0 | Free |
| sticker | sticker-star | 0 | Free (10 total) |
| sticker | sticker-heart | 0 | Free |
| sticker | sticker-rainbow | 0 | Free |
| sticker | sticker-sun | 0 | Free |
| sticker | sticker-moon | 0 | Free |
| sticker | sticker-flower | 0 | Free |
| sticker | sticker-butterfly | 0 | Free |
| sticker | sticker-cloud | 0 | Free |
| sticker | sticker-fish | 0 | Free |
| sticker | sticker-bird | 0 | Free |
| background | bg-white | 0 | Default |
| background | bg-sky | 0 | Free |
| background | bg-grass | 0 | Free |

Additional purchasable cosmetics (avatars: 10-25 bananas, stickers: 5-15 bananas, backgrounds: 15-30 bananas) to be defined in seed data.

## Static Data (not in database)

The following data is stored as structured JSON/TypeScript files in the frontend, not in PostgreSQL:

- **Waypoints** (letter tracing): Per-alphabet coordinate arrays (0-100% system)
- **Waypoints** (number tracing): 0-20 coordinate arrays
- **Matching game data**: Trilingual word/image pairs per mode
- **Coloring templates**: SVG path data organized by category
- **Puzzle images**: Image references per category and difficulty
- **Fill the gaps scenes**: Scene definitions with silhouette positions
- **Sorting challenges**: Object sets with correct category mappings
- **Translation files**: i18next JSON files per language (es, ru, en)
