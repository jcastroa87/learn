# Research: Kids Learning Platform

**Branch**: `001-kids-learning-platform` | **Date**: 2026-02-26

## 1. Authentication: Laravel 12 + Next.js 15

**Decision**: Laravel Sanctum (cookie/SPA mode) + Laravel Fortify (headless auth routes)

**Rationale**: Sanctum provides HTTP-only cookie session auth for SPAs. Fortify provides pre-built routes for registration, login, email verification, and password reset — all headless (no frontend views). Together they cover every FR in the auth section without custom code.

**Cross-Origin Strategy**: Next.js `rewrites` proxy — all `/api/*` requests from the browser go to Next.js, which proxies them to Laravel. The browser never makes cross-origin requests, eliminating CORS and `SameSite` cookie issues entirely.

**CSRF Flow**: Sanctum's `/sanctum/csrf-cookie` endpoint sets an `XSRF-TOKEN` cookie. The frontend reads it and sends it as `X-XSRF-TOKEN` header on mutations.

**SSR Auth**: Server Components forward cookies from the incoming request to Laravel via direct server-to-server `fetch`.

**Alternatives Rejected**:
- Laravel Breeze: Bundles frontend scaffolding we don't need (we use Next.js)
- Laravel Passport: Full OAuth2 server, massive overkill for a first-party SPA
- JWT tokens: Spec requires HTTP-only cookies; JWT in localStorage is less secure
- Direct browser-to-Laravel (cross-origin): Requires `SameSite=None`, HTTPS in dev, complex CORS config

## 2. Canvas Library

**Decision**: Konva.js via react-konva

**Rationale**: Best React integration (declarative components), built-in scene graph with per-node events, native drag-and-drop with snap, automatic HiDPI/Retina scaling, dirty-region rendering for 60fps, multi-layer architecture for separating static and dynamic content. SSR-compatible via `next/dynamic`.

**Alternatives Rejected**:
- Fabric.js: No official React wrapper, known SSR issues with Next.js App Router, no dirty-region rendering
- PixiJS: WebGL overkill for 2D drawing, compatibility concerns on older iPads
- Paper.js: No React bindings, aimed at generative art
- Vanilla Canvas API: Would require reimplementing scene graph, hit testing, drag-and-drop, layer management from scratch

## 3. Coloring Book Flood Fill

**Decision**: Hybrid — SVG paths as Konva `Path` components for region tap-to-fill + pixel-based scanline flood fill (q-floodfill) for freehand fill tool

**Rationale**: SVG paths enable instant tap-to-fill by simply updating the `fill` prop — zero pixel manipulation. Scanline flood fill on offscreen canvas handles freehand painted regions (~30-40ms per fill on 800x660 canvas).

**Alternatives Rejected**:
- Pure pixel flood fill: Loses vector sharpness, slower, harder to undo
- SVG in DOM: Can't combine with freehand painting and canvas export

## 4. Undo/Redo Strategy

**Decision**: Command Pattern with structural sharing, capped at 30 entries in a circular buffer

**Rationale**: Full canvas snapshots at iPad Retina resolution (4096x3072 pixels) would consume ~48MB per snapshot × 30 = 1.4GB — exceeds mobile Safari memory limits. Command pattern stores only deltas (add node, change fill, move piece) with O(1) memory per command.

**Command types**: AddStroke, ChangeFill, AddSticker, MoveNode, RemoveNode. Continuous drawing batched into single command on `pointerup`.

**Alternatives Rejected**:
- Full ImageData snapshots: 1.4GB for 30 steps, causes GC pauses
- PNG-compressed snapshots: 50-200ms per snapshot, perceptible lag
- Immutable state tree: Impedance mismatch with Konva's mutable scene graph

## 5. Canvas Export

**Decision**: `stage.toBlob()` as WebP (PNG fallback), uploaded via FormData

**Rationale**: `toBlob()` is async and avoids 33% Base64 overhead. WebP achieves 25-35% smaller files than PNG. All target browsers (Safari 16+, Chrome) support WebP.

## 6. Internationalization (i18n)

**Decision**: react-i18next (i18next ecosystem, NOT next-intl)

**Rationale**: Language is per-child-profile, not per-URL. `i18n.changeLanguage('ru')` instantly re-renders all components — no navigation, no reload, no state loss. Educational content structured as i18next namespaces (alphabet, matching-game) separate from UI translations.

**Alternatives Rejected**:
- next-intl: Architecture ties locale to URL segments; changing locale triggers refresh/navigation, loses client state
- Custom React Context: Reinvents interpolation, pluralization, namespaces
- react-intl: Heavier bundle, locale change requires remounting IntlProvider

## 7. Drag and Drop

**Decision**: @use-gesture/react + react-spring

**Rationale**: Game-like interactions (puzzle snapping, silhouette fill, category sorting) need raw gesture data with custom snap thresholds, not structured list reordering. @use-gesture provides pointer+touch unified API with explicit iPad Safari documentation. react-spring provides physics-based animations for snap-to-position and bounce-back effects. 30px snap threshold is trivial to implement in `onDragEnd`.

**Alternatives Rejected**:
- @dnd-kit: Designed for structured DnD (sortable lists, Kanban); Touch sensor situation in flux with new API
- react-beautiful-dnd: Unmaintained
- Pragmatic Drag and Drop: Touch issues reported, HTML5 DnD limitations
- Native HTML5 DnD: Doesn't work on touch without polyfills

## 8. Audio & TTS

**Decision**: Web Audio API for synthesized effects + Web Speech API for TTS (preserved from legacy)

**Rationale**: Legacy app already synthesizes sounds (success, tap, whoosh, pop) via Web Audio API without external files — no reason to change. Web Speech API provides browser-native TTS in es-ES, en-US, and ru-RU. Russian TTS has lower browser support — graceful degradation per edge case.

**No alternatives needed**: These are browser-native APIs with no external dependencies.
