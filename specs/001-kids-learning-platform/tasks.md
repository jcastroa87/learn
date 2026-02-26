# Tasks: Kids Learning Platform

**Input**: Design documents from `/specs/001-kids-learning-platform/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md
**Branch**: `001-kids-learning-platform` | **Date**: 2026-02-26

**Tests**: Not explicitly requested — test tasks omitted. Add test phases per story if TDD is desired.

**Organization**: Tasks grouped by user story in priority order (P1 → P2 → P3 → P4). Each story is independently testable after its phase completes.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- All paths are relative to repository root

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Create monorepo structure, initialize both projects, configure Docker

- [x] T001 Create monorepo directory structure: `backend/`, `frontend/`, `docker-compose.yml` per plan.md project structure
- [x] T002 Initialize Laravel 12 project in `backend/` with PHP 8.3+ dependencies (Sanctum, Fortify)
- [x] T003 Initialize Next.js 15 project in `frontend/` with TypeScript strict mode, react-konva, react-i18next, @use-gesture/react, react-spring
- [x] T004 [P] Create `docker-compose.yml` with app (Laravel), db (PostgreSQL 16), and frontend (Next.js) services
- [x] T005 [P] Create environment files: `backend/.env.example` and `frontend/.env.example` per quickstart.md

**Checkpoint**: Both projects run locally and via Docker. `docker compose up` starts all 3 services.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can begin

**CRITICAL**: No user story work can begin until this phase is complete

### Database & Models

- [x] T006 Create database migrations (reversible: up + down per Constitution III) for all 8 tables in `backend/database/migrations/`: parents, child_profiles, progress_records, artworks, cosmetic_items, child_cosmetics, session_configs (with all indexes, FKs, soft deletes per data-model.md)
- [x] T007 [P] Create Parent model (extends User) with SoftDeletes, relationships (hasMany ChildProfile) in `backend/app/Models/Parent.php`
- [x] T008 [P] Create ChildProfile model with SoftDeletes, relationships (belongsTo Parent, hasMany ProgressRecord/Artwork, belongsToMany CosmeticItem, hasOne SessionConfig) in `backend/app/Models/ChildProfile.php`
- [x] T009 [P] Create ProgressRecord model with SoftDeletes, relationships (belongsTo ChildProfile), status constants, metadata casting in `backend/app/Models/ProgressRecord.php`
- [x] T010 [P] Create Artwork model with SoftDeletes, relationships (belongsTo ChildProfile) in `backend/app/Models/Artwork.php`
- [x] T011 [P] Create CosmeticItem model with SoftDeletes, relationships (belongsToMany ChildProfile) in `backend/app/Models/CosmeticItem.php`
- [x] T012 [P] Create SessionConfig model with SoftDeletes, relationships (belongsTo ChildProfile) in `backend/app/Models/SessionConfig.php`
- [x] T013 Create CosmeticItemSeeder with 16 base free items (3 avatars, 10 stickers, 3 backgrounds) per data-model.md seeded data in `backend/database/seeders/CosmeticItemSeeder.php`
- [x] T136 [P] Create PurchasableCosmeticSeeder with 10-15 purchasable items: avatars (10-25 bananas), stickers (5-15 bananas), backgrounds (15-30 bananas) per data-model.md price ranges in `backend/database/seeders/PurchasableCosmeticSeeder.php`

### Backend Infrastructure

- [x] T014 Configure Laravel Sanctum for SPA cookie authentication (stateful domains, session driver, CORS) in `backend/config/sanctum.php` and `backend/config/cors.php`; update `config/auth.php` providers model to `App\Models\Parent::class`
- [x] T015 Configure Laravel Fortify for headless auth routes (register, login, email verification, password reset — no views) in `backend/app/Providers/FortifyServiceProvider.php`
- [x] T016 Implement JsonResponseEnvelope middleware wrapping all responses in `{ success, data, error }` format per Constitution IV in `backend/app/Http/Middleware/JsonResponseEnvelope.php`
- [x] T017 [P] Create authorization policies: ChildProfilePolicy (parent owns child), ArtworkPolicy, SessionConfigPolicy in `backend/app/Policies/`
- [x] T018 [P] Create base Form Request classes: StoreChildProfileRequest, UpdateChildProfileRequest, RecordProgressRequest, StoreArtworkRequest in `backend/app/Http/Requests/`
- [x] T019 Register API route structure with auth middleware groups in `backend/routes/api.php` and `backend/routes/web.php`

### Frontend Infrastructure

- [x] T020 Configure Next.js rewrites proxy (`/api/*` → Laravel, `/sanctum/*` → Laravel) in `frontend/next.config.ts`
- [x] T021 [P] Configure react-i18next with ES/RU/EN namespaces (ui, activities) and changeLanguage support in `frontend/src/lib/i18n.ts`
- [x] T022 [P] Create TypeScript type definitions for all API responses, entities, and enums in `frontend/src/types/`
- [x] T023 [P] Create API client with CSRF cookie handling (fetch XSRF-TOKEN, send X-XSRF-TOKEN header) in `frontend/src/lib/api.ts`
- [x] T024 [P] Create base UI components: Button, Card, Modal, LoadingSpinner, EmptyState per FR-049/FR-050 in `frontend/src/components/ui/`
- [x] T025 Create base app layout with responsive structure (iPad landscape primary, phone portrait secondary) in `frontend/src/app/layout.tsx`

**Checkpoint**: Foundation ready — migrations run, models exist, auth configured, frontend proxies to backend, i18n works. User story implementation can begin.

---

## Phase 3: US1 + US14 + US15 — Auth, Profiles, Verification (P1) MVP

**Goal**: A parent can register, verify email, log in, create/manage child profiles, reset password, and persist sessions via cookies.

**Independent Test**: Register → verify email → log in → create 2 child profiles → switch between them → log out → log back in → profiles still there. Separately: forgot password → reset → log in with new password.

### Backend

- [x] T026 [P] [US1] Customize Fortify registration to exclude `name` field (email + password only), return `{ id, email }` with 201 status in `backend/app/Http/Controllers/Auth/RegisteredUserController.php`
- [x] T027 [P] [US14] Customize Fortify login response to return `{ id, email }` in `backend/app/Http/Controllers/Auth/AuthenticatedSessionController.php`
- [x] T028 [P] [US15] Configure email verification and password reset routes with correct JSON envelope responses in `backend/app/Providers/FortifyServiceProvider.php`
- [x] T029 [P] [US1] Implement GET /api/user endpoint returning `{ id, email, email_verified_at }` in `backend/routes/api.php`
- [x] T030 [US1] Implement ChildProfileController with CRUD: list (GET /api/children), create (POST — auto-populate child_cosmetics with all free cosmetics on creation per FR-044), update (PUT), delete (DELETE) with max 5 profiles validation in `backend/app/Http/Controllers/ChildProfileController.php`
- [x] T031 [US1] Implement SessionConfigController: get and update per child (auto-create on child profile creation, default 20min + sound on) in `backend/app/Http/Controllers/SessionConfigController.php`

### Frontend

- [x] T032 [US1] Create registration page with email + password form, validation feedback in `frontend/src/app/(auth)/register/page.tsx`
- [x] T033 [P] [US14] Create login page with email + password form, generic error message, "Forgot password" link in `frontend/src/app/(auth)/login/page.tsx`
- [x] T034 [P] [US15] Create email verification screen with "Check your email" message and resend button in `frontend/src/app/(auth)/verify-email/page.tsx`
- [x] T035 [P] [US15] Create forgot password page and reset password page (token + new password form) in `frontend/src/app/(auth)/forgot-password/page.tsx` and `frontend/src/app/(auth)/reset-password/page.tsx`
- [x] T036 [US1] Create useAuth hook: register, login, logout, fetchUser, session check in `frontend/src/hooks/useAuth.ts`
- [x] T037 [US1] Create child profile creation/editing form component (name, age, avatar picker, language selector) in `frontend/src/components/activities/ChildProfileForm.tsx`
- [x] T038 [US1] Create child profile selector page (list profiles, switch active child, add new) with parent dashboard link and settings gear icon in `frontend/src/app/(app)/profiles/page.tsx`
- [x] T039 [US1] Create useChildProfile hook: CRUD operations, active child state, profile switching in `frontend/src/hooks/useChildProfile.ts`
- [x] T040 [US1] Create authenticated layout with session check and redirect to login if unauthenticated in `frontend/src/app/(app)/layout.tsx`

### Parent Account Deletion (FR-054)

- [x] T137 [US1] Implement parent account deletion endpoint (DELETE /api/user): soft-delete parent + cascade soft-delete all child profiles, progress, artworks, cosmetics, session configs in `backend/app/Http/Controllers/Auth/AccountController.php`
- [x] T138 [US1] Create parent account settings page with delete account button + confirmation dialog ("This will permanently remove your account and all child data") in `frontend/src/app/(app)/settings/page.tsx`

**Checkpoint**: Full auth flow works end-to-end. Parent can register, verify, login, create children, switch profiles, delete account. Sessions persist via cookies.

---

## Phase 4: US2 — Main Menu & Activity Navigation (P1)

**Goal**: After selecting a child, they see a hub with 9 activity cards, banana count, language switcher, and can navigate to/from activities.

**Independent Test**: Select child → see 9 cards in 3x3 grid (iPad) → see banana count → switch language → tap activity → return to menu.

- [x] T041 [US2] Create TopBar component: child avatar, name, banana counter, language switcher (ES/RU/EN) in `frontend/src/components/layout/TopBar.tsx`
- [x] T042 [P] [US2] Create ActivityCard component: icon, label, progress indicator per module in `frontend/src/components/layout/ActivityCard.tsx`
- [x] T043 [US2] Create main menu page with responsive 9-card grid (3x3 iPad landscape, 2-col phone portrait), TopBar, shop entry button (banana tap → shop), and gallery entry button in `frontend/src/app/(app)/menu/page.tsx`
- [x] T044 [US2] Implement language switching: call i18n.changeLanguage() on switcher tap, persist to child profile via API in `frontend/src/components/layout/TopBar.tsx`
- [x] T045 [US2] Create activity layout wrapper with back/home button navigation in `frontend/src/app/(app)/activities/layout.tsx`

**Checkpoint**: Main menu displays all 9 modules. Language switching works. Navigation in/out of activities works (activities are placeholder pages for now).

---

## Phase 5: US12 + US13 — Progress, Rewards, Dashboard, Audio (P2)

**Goal**: Banana reward system works across all modules. Session timer controls screen time. Parent can view dashboard. Audio feedback and TTS operational.

**Independent Test**: Complete an activity → bananas awarded → menu counter updates. Set 1-min timer → see warning → see lock screen → parent dismisses. Dashboard shows accurate stats. TTS pronounces words in 3 languages.

### Backend

- [x] T046 [US12] Implement BananaService: award logic per module type (3/5/8/12 bananas + bonuses per FR-009), deduct for cosmetic purchases in `backend/app/Services/BananaService.php`
- [x] T047 [US12] Implement ProgressService: state transition enforcement (null→attempted→completed per FR-016), no reverse transitions, duration_seconds accumulation in `backend/app/Services/ProgressService.php`
- [x] T048 [US12] Implement ProgressController: GET by module (paginated), GET summary, POST record (with banana awarding via BananaService) in `backend/app/Http/Controllers/ProgressController.php`
- [x] T049 [US12] Implement DashboardController: child stats, progress_summary, recent_activity, daily_activity (7-day aggregation), time_spent (derived from duration_seconds) in `backend/app/Http/Controllers/DashboardController.php`

### Frontend — Progress & Timer

- [x] T050 [US12] Create useProgress hook: fetch progress by module, fetch summary, record progress with duration_seconds (includes useActivityTimer utility to measure per-item elapsed time — each activity page starts timer on item load and sends elapsed seconds on progress record) in `frontend/src/hooks/useProgress.ts`
- [x] T051 [US12] Create useSessionTimer hook: countdown from configured limit, pause on visibilitychange, warning at 1 min (FR-022), lock at 0 in `frontend/src/hooks/useSessionTimer.ts`
- [x] T052 [US12] Create SessionTimerWarning component: pulsing screen border overlay + countdown timer in `frontend/src/components/ui/SessionTimerWarning.tsx`
- [x] T053 [US12] Create LockScreen component: "Time's up!" message + 3-second hold-to-dismiss parental gate in `frontend/src/components/ui/LockScreen.tsx`
- [x] T054 [US12] Create parent dashboard page: per-child stats cards, progress per module, daily/weekly activity chart, time spent, recent activity list in `frontend/src/app/(app)/dashboard/page.tsx`

### Frontend — Audio & TTS

- [x] T055 [US13] Create audio synthesis utility: success, tap, whoosh, pop sounds via Web Audio API (no external files) in `frontend/src/lib/audio.ts`
- [x] T056 [US13] Create useAudio hook: play sounds, TTS pronunciation via Web Speech API, cancel on navigation, respect sound_enabled setting in `frontend/src/hooks/useAudio.ts`
- [x] T057 [US13] Integrate TTS language mapping (es-ES, en-US, ru-RU) with i18n language state, graceful degradation if voice unavailable in `frontend/src/hooks/useAudio.ts`

**Checkpoint**: Progress recording and banana awarding work. Session timer pauses/resumes correctly. Dashboard shows real data. Sounds and TTS play in all 3 languages.

---

## Phase 6: US3 — Letter Tracing (P2)

**Goal**: Child traces letters with finger, sees rainbow feedback, earns bananas. Alphabet changes per language. Progress persists.

**Independent Test**: Set language to Spanish → see A-Z+Ñ → watch animated demo → trace letter A within 35px of waypoints → 85% completion triggers success → 3 bananas awarded → return and see A marked complete.

- [x] T058 [P] [US3] Create letter waypoint data files: Spanish (27), Russian (33), English (26) coordinate arrays (0-100% system) in `frontend/src/data/waypoints/letters/`
- [x] T059 [US3] Create TracingCanvas component using react-konva: guide path layer, animated demo trace, rainbow-colored user trace, waypoint proximity detection (35px scaled to DPI) in `frontend/src/components/canvas/TracingCanvas.tsx`
- [x] T060 [US3] Implement tracing completion logic: track visited waypoints, trigger completion at 85%+ coverage in `frontend/src/components/canvas/TracingCanvas.tsx`
- [x] T061 [P] [US3] Create LetterPicker component: scrollable alphabet strip, completion state indicators (empty/attempted/completed) per letter in `frontend/src/components/activities/LetterPicker.tsx`
- [x] T062 [US3] Create letter tracing activity page: integrates TracingCanvas, LetterPicker, success animation, audio feedback, progress recording in `frontend/src/app/(app)/activities/letter-tracing/page.tsx`
- [x] T063 [US3] Connect letter tracing to progress API: record attempted on first trace, completed on 85%+, award 3 bananas per FR-009 in `frontend/src/app/(app)/activities/letter-tracing/page.tsx`

**Checkpoint**: Letter tracing fully functional for all 3 alphabets. Progress persists across sessions.

---

## Phase 7: US4 — Number Tracing (P2)

**Goal**: Child traces numbers 0-20 with quantity visualization. Reuses TracingCanvas from US3.

**Independent Test**: Select number 5 → see 5 visual objects → trace number → bananas awarded → progress saved.

- [x] T064 [P] [US4] Create number waypoint data files (0-20 coordinate arrays) in `frontend/src/data/waypoints/numbers/`
- [x] T065 [US4] Create QuantityVisualization component: renders N visual objects (emojis/icons) for given number in `frontend/src/components/activities/QuantityVisualization.tsx`
- [x] T066 [US4] Create number tracing activity page: reuses TracingCanvas from US3, adds NumberPicker (0-20) and QuantityVisualization in `frontend/src/app/(app)/activities/number-tracing/page.tsx`
- [x] T067 [US4] Connect number tracing to progress API: record state, award 3 bananas per FR-009 in `frontend/src/app/(app)/activities/number-tracing/page.tsx`

**Checkpoint**: Number tracing works for 0-20. Quantity visualization displays correctly. Progress persists.

---

## Phase 8: US5 — Matching Game (P2)

**Goal**: Child plays 5 matching modes with trilingual content, TTS pronunciation, and error tracking.

**Independent Test**: Select "colors" mode → match all pairs → hear TTS pronunciation → complete with zero errors → earn 5+3 bonus bananas.

- [x] T068 [P] [US5] Create trilingual matching game data: 5 modes (letters, numbers, colors, shapes, animals) with word/image pairs in ES/RU/EN in `frontend/src/data/matching/`
- [x] T069 [US5] Create MatchingBoard component: two-column layout, tap-to-select, visual line connections between matched pairs in `frontend/src/components/activities/MatchingBoard.tsx`
- [x] T070 [US5] Implement match detection: correct match (stay connected + success sound + TTS), incorrect match (error sound + error count), round completion in `frontend/src/components/activities/MatchingBoard.tsx`
- [x] T071 [P] [US5] Create ModeSelector component: 5 mode buttons with icons for matching game in `frontend/src/components/activities/ModeSelector.tsx`
- [x] T072 [US5] Create matching game activity page: integrates ModeSelector, MatchingBoard, TTS, progress, rapid-tap prevention during animations in `frontend/src/app/(app)/activities/matching/page.tsx`
- [x] T073 [US5] Connect matching to progress API: record rounds, track errors in metadata, award 5 bananas + 3 bonus for perfect per FR-009 in `frontend/src/app/(app)/activities/matching/page.tsx`

**Checkpoint**: All 5 matching modes work with trilingual content. TTS pronounces matched items. Error tracking and bonus bananas functional.

---

## Phase 9: US6 — Coloring Book (P3)

**Goal**: Child colors templates with tap-to-fill, paintbrush, stickers, rainbow mode, undo. Saved artwork uploads to server.

**Independent Test**: Select animal template → tap-fill a region red → paint with brush → place sticker → undo 3 times → save → 5 bananas awarded → artwork appears in gallery.

- [x] T074 [P] [US6] Create SVG coloring template data files: minimum 5 templates per category (animals, vehicles, nature, food, fantasy = 25+ initial templates; expand iteratively toward 100+ per spec) with path definitions in `frontend/src/data/coloring/`
- [x] T075 [US6] Create ColoringCanvas component using react-konva: SVG Path regions as Konva Path nodes, static template layer + dynamic paint layer in `frontend/src/components/canvas/ColoringCanvas.tsx`
- [x] T076 [US6] Implement tap-to-fill: detect tapped SVG region, update Konva Path fill prop for instant region coloring in `frontend/src/components/canvas/ColoringCanvas.tsx`
- [x] T077 [US6] Implement paintbrush tool: free drawing on dynamic layer with configurable brush size and color (including rainbow auto-cycle) in `frontend/src/components/canvas/ColoringCanvas.tsx`
- [x] T078 [P] [US6] Create ColorPalette component: 12+ colors, rainbow mode toggle, active color indicator in `frontend/src/components/activities/ColorPalette.tsx`
- [x] T079 [US6] Implement sticker placement: drag stickers from palette onto canvas, position with touch in `frontend/src/components/canvas/ColoringCanvas.tsx`
- [x] T080 [US6] Implement useUndoRedo hook: command pattern (AddStroke, ChangeFill, AddSticker, MoveNode, RemoveNode), 30-entry circular buffer, batch continuous drawing on pointerup in `frontend/src/hooks/useUndoRedo.ts`
- [x] T081 [P] [US6] Create template gallery page: category tabs, thumbnail previews, scroll in `frontend/src/app/(app)/activities/coloring/page.tsx`
- [x] T082 [US6] Create coloring workspace page: integrates ColoringCanvas, ColorPalette, tool buttons (fill/brush/sticker/undo/save) in `frontend/src/app/(app)/activities/coloring/[templateId]/page.tsx`
- [x] T083 [US6] Implement artwork export and upload: stage.toBlob() as WebP (PNG fallback), FormData upload via POST /api/children/{childId}/artworks, award 5 bananas in `frontend/src/app/(app)/activities/coloring/[templateId]/page.tsx`

### Backend — Artwork Upload

- [x] T084 [US6] Implement ArtworkController: upload (validate type/size, store file, enforce 50 limit with confirmation), list (paginated), get full-size, delete (soft-delete) in `backend/app/Http/Controllers/ArtworkController.php`

**Checkpoint**: Coloring book fully functional. Templates load from data files. All tools work (fill, brush, rainbow, sticker, undo). Artwork saves to server.

---

## Phase 10: US7 — Free Drawing (P3)

**Goal**: Child draws on blank/background canvas with brush sizes, eraser, stickers, undo. Saved artwork uploads to server.

**Independent Test**: Select beach background → draw with rainbow brush → erase part → place sticker → undo → save → 5 bananas awarded.

- [x] T085 [US7] Create DrawingCanvas component using react-konva: blank canvas, multiple brush sizes, eraser tool, background layer in `frontend/src/components/canvas/DrawingCanvas.tsx`
- [x] T086 [P] [US7] Create BackgroundSelector component: solid colors, patterns, scene thumbnails; merge base + purchased backgrounds from child's unlocked cosmetics per FR-043 in `frontend/src/components/activities/BackgroundSelector.tsx`
- [x] T087 [US7] Create free drawing activity page: integrates DrawingCanvas, ColorPalette (from US6), BackgroundSelector, sticker palette, undo (useUndoRedo from US6), save in `frontend/src/app/(app)/activities/free-drawing/page.tsx`
- [x] T088 [US7] Connect drawing save to artwork upload API: stage.toBlob() as WebP, upload via ArtworkController (from US6), award 5 bananas in `frontend/src/app/(app)/activities/free-drawing/page.tsx`

**Checkpoint**: Free drawing works with all tools. Backgrounds swap without losing drawings. Artwork saves and bananas awarded.

---

## Phase 11: US8 — Memory Cards (P3)

**Goal**: Child plays memory card matching with flip animations, 5 content modes, 3 difficulty levels (2x3, 3x4, 4x4).

**Independent Test**: Select animals mode + easy (2x3) → flip 2 cards → match found → all pairs matched → bananas awarded with bonus for minimum taps.

- [x] T089 [US8] Create card grid generator: shuffle and pair content items, generate 2x3 (3 pairs), 3x4 (6 pairs), 4x4 (8 pairs) layouts per FR-012 in `frontend/src/components/activities/MemoryCardGrid.tsx`
- [x] T090 [US8] Create FlipCard component: face-down/face-up states, flip animation (CSS transform), content display in `frontend/src/components/activities/FlipCard.tsx`
- [x] T091 [US8] Implement memory match logic: two-card selection, match detection (stay face-up + success animation), mismatch (flip back after 1 second), tap count tracking in `frontend/src/components/activities/MemoryCardGrid.tsx`
- [x] T092 [P] [US8] Create MemoryModeSelector component: mode (letters/numbers/animals/colors/shapes) + difficulty (easy/medium/hard) selection in `frontend/src/components/activities/MemoryModeSelector.tsx`
- [x] T093 [US8] Create memory cards activity page: integrates MemoryModeSelector, MemoryCardGrid, FlipCard, success sounds, progress recording in `frontend/src/app/(app)/activities/memory-cards/page.tsx`
- [x] T094 [US8] Connect memory cards to progress API: record rounds, track tap_count in metadata, award 5 bananas + 3 bonus for minimum taps per FR-009 in `frontend/src/app/(app)/activities/memory-cards/page.tsx`

**Checkpoint**: Memory cards work across all 5 modes and 3 difficulty levels. Flip animations smooth. Tap tracking and bonus bananas functional.

---

## Phase 12: US16 — Cosmetics Shop (P3)

**Goal**: Child spends bananas to unlock cosmetics (avatars, stickers, backgrounds). Base free items available to all.

**Independent Test**: Child with 50 bananas → browse shop tabs → buy avatar for 20 bananas → balance drops to 30 → new avatar available in profile. Item costing 30 shows disabled.

### Backend

- [x] T095 [US16] Implement CosmeticController: list all (paginated, filterable by category), list child's unlocked, purchase (validate balance, prevent double-purchase, deduct bananas) in `backend/app/Http/Controllers/CosmeticController.php`

### Frontend

- [x] T096 [US16] Create shop page with tabbed layout (avatars, stickers, backgrounds), banana balance display in `frontend/src/app/(app)/shop/page.tsx`
- [x] T097 [P] [US16] Create CosmeticItemCard component: preview image, banana cost, lock/unlock status, disabled state when insufficient bananas in `frontend/src/components/activities/CosmeticItemCard.tsx`
- [x] T098 [US16] Implement purchase flow: tap item → preview → confirm modal → API call → deduct bananas → unlock animation → update UI in `frontend/src/app/(app)/shop/page.tsx`
- [x] T099 [US16] Integrate unlocked stickers into coloring/drawing sticker palettes (merge base + purchased stickers) in `frontend/src/components/canvas/ColoringCanvas.tsx` and `frontend/src/components/canvas/DrawingCanvas.tsx`
- [x] T100 [US16] Integrate unlocked avatars into profile editor (ChildProfileForm) and TopBar display in `frontend/src/components/activities/ChildProfileForm.tsx`

**Checkpoint**: Shop displays all cosmetics with correct pricing. Purchases work. Unlocked items appear in relevant modules.

---

## Phase 13: US17 — Artwork Gallery (P3)

**Goal**: Child views, browses, and deletes saved artwork. Parent sees gallery from dashboard. 50-item limit with confirmation.

**Independent Test**: Child with 5 artworks → open gallery → see thumbnails newest-first → tap to view full-screen → delete one → count drops to 4. With 50 artworks, saving new one shows confirmation notice.

- [x] T101 [US17] Create gallery page with thumbnail grid (newest-first), paginated, accessible from main menu in `frontend/src/app/(app)/gallery/page.tsx`
- [x] T102 [US17] Create ArtworkViewer component: full-screen display with delete button and back navigation in `frontend/src/components/activities/ArtworkViewer.tsx`
- [x] T103 [US17] Implement 50-artwork limit notification: show confirmation dialog before saving when at limit (oldest-first rotation on confirm, cancel aborts save per FR-046) in `frontend/src/components/ui/ArtworkLimitDialog.tsx`
- [x] T104 [US17] Integrate ArtworkLimitDialog into coloring save (US6 T083) and free drawing save (US7 T088) flows
- [x] T105 [US17] Add gallery tab/section to parent dashboard page (reuse gallery thumbnail component) in `frontend/src/app/(app)/dashboard/page.tsx`

**Checkpoint**: Gallery displays all artwork. Full-screen viewing and deletion work. 50-limit confirmation flow works. Parent sees gallery in dashboard.

---

## Phase 14: US9 — Puzzles / Jigsaw (P4)

**Goal**: Child drags puzzle pieces to correct positions. 3 difficulty levels (4/9/16 pieces). Snap-to-place within 30px. Hint available.

**Independent Test**: Select animal image + easy (4 pieces) → pieces scattered → drag piece near target → snaps at 30px → all placed → celebration → 5 bananas awarded. Hint shows semi-transparent preview.

- [x] T106 [P] [US9] Create puzzle image data files: minimum 3 images per category (animals, vehicles, food, nature = 12+ initial puzzles) organized by difficulty in `frontend/src/data/puzzles/`
- [x] T107 [US9] Create PuzzleCanvas component using react-konva: split image into N draggable pieces (4/9/16), scatter positions, render in `frontend/src/components/canvas/PuzzleCanvas.tsx`
- [x] T108 [US9] Implement drag-and-snap mechanics using @use-gesture/react: 30px snap threshold (scaled to DPI), react-spring snap-to-position animation in `frontend/src/components/canvas/PuzzleCanvas.tsx`
- [x] T109 [P] [US9] Create puzzle gallery page: category tabs, difficulty indicators, image thumbnails in `frontend/src/app/(app)/activities/puzzles/page.tsx`
- [x] T110 [US9] Create hint overlay: semi-transparent complete image shown on hint button press in `frontend/src/components/canvas/PuzzleCanvas.tsx`
- [x] T111 [US9] Create puzzle activity page: integrates PuzzleCanvas, hint, success animation, audio, progress recording in `frontend/src/app/(app)/activities/puzzles/[puzzleId]/page.tsx`
- [x] T112 [US9] Connect puzzles to progress API: record per-image completion, award 5/8/12 bananas by difficulty per FR-009 in `frontend/src/app/(app)/activities/puzzles/[puzzleId]/page.tsx`

**Checkpoint**: Puzzles work across all difficulty levels. Drag-snap is smooth on iPad. Hint overlay works. Difficulty-tiered banana awards correct.

---

## Phase 15: US10 — Fill the Gaps (P4)

**Goal**: Child drags objects to matching silhouettes in themed scenes. Wrong match bounces back. Scene completion earns bananas.

**Independent Test**: Load farm scene → 5 empty silhouettes → drag cow to correct silhouette → snaps → drag pig to wrong silhouette → bounces back → complete scene → 5 bananas.

- [x] T113 [P] [US10] Create scene definition data files: minimum 2 scenes per theme (farm, ocean, space, kitchen = 8+ initial scenes) with silhouette positions and matching object data in `frontend/src/data/fill-the-gaps/`
- [x] T114 [US10] Create SceneRenderer component: background image with empty silhouettes (highlighted outlines) and draggable objects below in `frontend/src/components/activities/SceneRenderer.tsx`
- [x] T115 [US10] Implement drag-to-silhouette mechanics using @use-gesture/react: 30px snap threshold, correct match (snap + sound), wrong match (bounce-back via react-spring) in `frontend/src/components/activities/SceneRenderer.tsx`
- [x] T116 [US10] Create fill the gaps activity page: integrates SceneRenderer, scene selector, success animation, progress recording in `frontend/src/app/(app)/activities/fill-the-gaps/page.tsx`
- [x] T117 [US10] Connect fill the gaps to progress API: record scene completion, award 5 bananas per FR-009 in `frontend/src/app/(app)/activities/fill-the-gaps/page.tsx`

**Checkpoint**: Fill the gaps works with all themed scenes. Drag-snap and bounce-back are smooth. Progress persists.

---

## Phase 16: US11 — Sorting / Classification (P4)

**Goal**: Child drags objects into 2-3 labeled category bins. Correct sorts stay, incorrect bounce back. Zero-error bonus.

**Independent Test**: Sort 6 animals into "farm" and "ocean" bins → correct sorts stay with success sound → wrong sort bounces back → complete → 5 bananas + 3 bonus for zero errors.

- [x] T118 [P] [US11] Create sorting challenge data files: minimum 3 rounds per category type (animals by habitat, objects by color, food by type = 9+ initial rounds) with correct category mappings in `frontend/src/data/sorting/`
- [x] T119 [US11] Create CategoryBin component: labeled visual container, accepts drops, visual feedback on hover/drop in `frontend/src/components/activities/CategoryBin.tsx`
- [x] T120 [US11] Implement drag-to-bin mechanics using @use-gesture/react: correct drop (stay + success sound), incorrect drop (bounce-back via react-spring + error sound), error counting in `frontend/src/components/activities/CategoryBin.tsx`
- [x] T121 [US11] Create sorting activity page: integrates CategoryBin (2-3 bins), draggable objects, round completion, trilingual labels in `frontend/src/app/(app)/activities/sorting/page.tsx`
- [x] T122 [US11] Connect sorting to progress API: record rounds, track errors in metadata, award 5 bananas + 3 bonus for zero errors per FR-009 in `frontend/src/app/(app)/activities/sorting/page.tsx`

**Checkpoint**: Sorting works with all challenge types. Drag-to-bin is smooth. Error tracking and bonus bananas functional.

---

## Phase 17: Polish & Cross-Cutting Concerns

**Purpose**: UI states, resilience, accessibility, security hardening, final validation

### UI States (FR-049 to FR-052)

- [x] T123 [P] Implement loading indicators on all screens (animated spinner or skeleton) per FR-049 across `frontend/src/app/`
- [x] T124 [P] Implement empty states with encouraging illustrations and CTAs per FR-050 in gallery, dashboard, and shop pages
- [x] T125 [P] Implement friendly error screens ("Oops! Something went wrong") with retry button per FR-051 in `frontend/src/components/ui/ErrorBoundary.tsx`
- [x] T126 Implement artwork upload retry: retain locally on failure, auto-retry on next save or reload per FR-052 in `frontend/src/hooks/useArtworkUpload.ts`

### Accessibility & Responsiveness

- [x] T127 [P] Verify and enforce 44x44pt minimum touch targets across all interactive elements per FR-034
- [x] T128 [P] Implement canvas orientation change handling without state loss per FR-036 in all canvas components
- [x] T129 Verify rapid-tap prevention across all tap-based activities: matching (T072), memory cards, and any activity with reveal animations — ensure taps are ignored during animations per edge case

### i18n Completeness

- [x] T130 [P] Create complete ES translation files for all UI strings and activity content in `frontend/src/locales/es/`
- [x] T131 [P] Create complete RU translation files for all UI strings and activity content in `frontend/src/locales/ru/`
- [x] T132 [P] Create complete EN translation files for all UI strings and activity content in `frontend/src/locales/en/`

### Security & Quality

- [x] T133 Security review: verify CSRF on all mutations, server-side input validation on all endpoints, no hardcoded credentials, file upload type/size validation per Constitution II
- [x] T134 Code quality review: remove dead code, ensure no console.log/dd(), verify TypeScript strict (no `any`), readable code per Constitution VII
- [x] T135 Run quickstart.md validation: full Docker setup from scratch, migrations, seed, smoke test all major flows

**Checkpoint**: All UI states handled. Touch targets verified. Translations complete. Security and quality gates pass.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ← no dependencies
Phase 2 (Foundational) ← depends on Phase 1
Phase 3 (US1+14+15 Auth) ← depends on Phase 2
Phase 4 (US2 Menu) ← depends on Phase 3 (needs auth + profiles)
Phase 5 (US12+13 Progress/Audio) ← depends on Phase 3 (needs auth + profiles)
Phase 6 (US3 Letters) ← depends on Phase 5 (needs progress + audio)
Phase 7 (US4 Numbers) ← depends on Phase 6 (reuses TracingCanvas)
Phase 8 (US5 Matching) ← depends on Phase 5 (needs progress + audio + TTS)
Phase 9 (US6 Coloring) ← depends on Phase 5 (needs progress + audio + undo)
Phase 10 (US7 Drawing) ← depends on Phase 9 (reuses ColorPalette, useUndoRedo, ArtworkController)
Phase 11 (US8 Memory) ← depends on Phase 5 (needs progress + audio)
Phase 12 (US16 Shop) ← depends on Phase 5 (needs banana system)
Phase 13 (US17 Gallery) ← depends on Phase 9 (needs ArtworkController from US6)
Phase 14 (US9 Puzzles) ← depends on Phase 5 (needs progress + audio)
Phase 15 (US10 Fill Gaps) ← depends on Phase 5 (needs progress + audio)
Phase 16 (US11 Sorting) ← depends on Phase 5 (needs progress + audio)
Phase 17 (Polish) ← depends on all user story phases
```

### User Story Dependencies

- **US1+14+15 (Auth)**: Foundation only — start immediately after Phase 2
- **US2 (Menu)**: Needs US1 (profiles exist to display)
- **US12+13 (Progress/Audio)**: Needs US1 (child profiles exist)
- **US3 (Letters)**: Needs US12+13 (progress recording + audio)
- **US4 (Numbers)**: Needs US3 (reuses TracingCanvas)
- **US5 (Matching)**: Needs US12+13 (progress + TTS)
- **US6 (Coloring)**: Needs US12+13 (progress + audio)
- **US7 (Drawing)**: Needs US6 (reuses ColorPalette, useUndoRedo, ArtworkController)
- **US8 (Memory)**: Needs US12+13 (progress + audio)
- **US9 (Puzzles)**: Needs US12+13 (progress + audio)
- **US10 (Fill Gaps)**: Needs US12+13 (progress + audio)
- **US11 (Sorting)**: Needs US12+13 (progress + audio)
- **US16 (Shop)**: Needs US12 (banana system)
- **US17 (Gallery)**: Needs US6 (ArtworkController)

### Parallel Opportunities After Phase 5

Once US12+13 (Progress/Audio) completes, these can run in parallel:

```
Stream A: US3 → US4 (tracing: letters then numbers)
Stream B: US5 (matching game)
Stream C: US6 → US7 (creative: coloring then drawing)
Stream D: US8 (memory cards)
Stream E: US9 (puzzles)
Stream F: US10 (fill the gaps)
Stream G: US11 (sorting)
Stream H: US16 (shop)
```

US17 (Gallery) can start as soon as US6 completes.

### Within Each User Story

- Data files [P] can be created in parallel with component work
- Models/services before controllers
- Backend before frontend integration
- Core component before page integration
- Page integration before progress API connection

---

## Parallel Example: Phase 5 (US12 + US13)

```bash
# Backend tasks can run in parallel:
Task T046: "BananaService in backend/app/Services/BananaService.php"
Task T047: "ProgressService in backend/app/Services/ProgressService.php"

# After services complete, controllers:
Task T048: "ProgressController"
Task T049: "DashboardController"

# Frontend hooks can run in parallel:
Task T050: "useProgress hook"
Task T051: "useSessionTimer hook"
Task T055: "audio.ts utility"
Task T056: "useAudio hook"

# Then integration components:
Task T052: "SessionTimerWarning"
Task T053: "LockScreen"
Task T054: "Dashboard page"
```

## Parallel Example: Phase 9 (US6 — Coloring)

```bash
# Data files and palette in parallel:
Task T074: "SVG template data files"
Task T078: "ColorPalette component"
Task T081: "Template gallery page"

# Then sequential canvas work:
Task T075: "ColoringCanvas base"
Task T076: "Tap-to-fill"
Task T077: "Paintbrush tool"
Task T079: "Sticker placement"
Task T080: "useUndoRedo hook"

# Then integration:
Task T082: "Coloring workspace page"
Task T083: "Export and upload"
Task T084: "ArtworkController backend"
```

---

## Implementation Strategy

### MVP First (Phase 1-4: Setup + Auth + Menu)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T025)
3. Complete Phase 3: Auth + Profiles (T026-T040, T137-T138)
4. Complete Phase 4: Main Menu (T041-T045)
5. **STOP and VALIDATE**: Parent can register, login, create children, delete account, see main menu with 9 placeholder cards + shop/gallery entry
6. Deploy/demo if ready — this is the MVP shell

### Core Activities (Phase 5-8: Progress + P2 Activities)

7. Complete Phase 5: Progress + Audio (T046-T057)
8. Complete Phase 6-8: Letter tracing, number tracing, matching (T058-T073)
9. **STOP and VALIDATE**: 3 educational activities work end-to-end with progress, bananas, TTS, session timer

### Creative Modules (Phase 9-13: P3 Activities)

10. Complete Phase 9-10: Coloring + Drawing (T074-T088)
11. Complete Phase 11: Memory Cards (T089-T094)
12. Complete Phase 12-13: Shop + Gallery (T095-T105)
13. **STOP and VALIDATE**: 6 activities + shop + gallery all functional

### New Modules (Phase 14-16: P4 Activities)

14. Complete Phase 14-16: Puzzles, Fill Gaps, Sorting (T106-T122)
15. **STOP and VALIDATE**: All 9 activities operational

### Final Polish (Phase 17)

16. Complete Phase 17: UI states, a11y, translations, security (T123-T135)
17. **FINAL VALIDATION**: Full Docker setup from scratch, all flows tested

**Total tasks**: 138 (T001-T138)

---

## Notes

- [P] tasks = different files, no dependencies on in-progress tasks
- [Story] label maps task to specific user story for traceability
- Each phase checkpoint validates independently before moving forward
- Commit after each task or logical group of tasks
- US6 (Coloring) produces reusable components (ColorPalette, useUndoRedo, ArtworkController) needed by US7, US16, US17
- US3 (Letter Tracing) produces TracingCanvas reused by US4
- All drag-and-drop activities (US9, US10, US11) share @use-gesture/react patterns but have independent components
- Canvas components must be loaded via `next/dynamic` with SSR disabled (Konva requires DOM)
