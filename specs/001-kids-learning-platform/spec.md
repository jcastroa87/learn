# Feature Specification: Kids Learning Platform

**Feature Branch**: `001-kids-learning-platform`
**Created**: 2026-02-26
**Status**: Draft
**Input**: Rebuild Gorila Studio as a full-stack kids learning platform with 9 activity modules, parent/child profiles, trilingual support (ES/RU/EN), and modern iPad-first UI inspired by Keiki.app

## Out of Scope

The following are explicitly NOT part of this feature:

- Native mobile apps (iOS/Android) — this is a web application only
- Multiplayer or social features (no sharing, no leaderboards between users)
- Admin panel for content management (templates, waypoints, and matching data are managed via code/data files, not a CMS)
- Push notifications or email marketing
- In-app purchases or subscription billing (the app is 100% free)
- Offline-first mode with bidirectional sync engine
- Video or audio content streaming (songs, cartoons)
- Chat or messaging between parent accounts
- Third-party authentication (Google, Apple, Facebook login)
- Advanced analytics or A/B testing infrastructure

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Parent Registration and Child Profile Setup (Priority: P1)

A parent downloads the app, creates an account with email and password, and sets up one or more child profiles. Each child profile captures the child's name, age, preferred avatar, and preferred language. The parent can switch between child profiles from a profile selector. Each child sees only their own progress and rewards.

**Why this priority**: Without accounts and profiles, nothing else works. This is the foundation for personalized progress tracking, parental controls, and multi-child households.

**Independent Test**: A parent can register, create two child profiles with different ages and languages, switch between them, and verify each profile is independent.

**Acceptance Scenarios**:

1. **Given** a new visitor, **When** they tap "Create Account" and fill in email + password, **Then** their account is created and they are prompted to add a child profile
2. **Given** a logged-in parent with no children, **When** they add a child profile (name: "Mia", age: 4, language: Spanish, avatar: gorilla), **Then** the profile appears in the profile selector
3. **Given** a parent with 2 child profiles, **When** they switch from child A to child B, **Then** the main menu shows child B's progress, bananas, and language preference
4. **Given** a parent, **When** they edit a child's profile (change age or language), **Then** the changes reflect immediately in that child's experience
5. **Given** a parent, **When** they access their parent settings, **Then** they can see a list of all child profiles and manage session time limits per child

---

### User Story 2 - Main Menu and Activity Navigation (Priority: P1)

After selecting a child profile, the child lands on a colorful main menu (hub) showing all 9 activity modules as large, tappable cards with icons and labels. The menu is organized in a grid layout optimized for iPad. Each card shows a preview icon and the child's completion progress for that module. A top bar displays the child's avatar, name, banana count, and a language switcher. Navigation is simple: tap to enter an activity, swipe or tap a back button to return to the menu.

**Why this priority**: The main menu is the central navigation hub. Every other story depends on being able to reach the activities.

**Independent Test**: A child can see all 9 activity cards, see their banana count, switch language, tap into any activity, and return to the menu.

**Acceptance Scenarios**:

1. **Given** a child profile is selected, **When** the main menu loads, **Then** 9 activity cards are displayed in a responsive grid (3x3 on iPad landscape, 2-column on phone portrait)
2. **Given** the main menu, **When** the child taps an activity card, **Then** they navigate into that activity's screen
3. **Given** the child is inside an activity, **When** they tap the back/home button, **Then** they return to the main menu
4. **Given** a child with bananas earned, **When** the menu loads, **Then** the banana counter reflects the correct total
5. **Given** a trilingual setup, **When** the child (or parent) taps the language switcher, **Then** all UI labels, activity content, and TTS language update to the selected language (ES/RU/EN)

---

### User Story 3 - Letter Tracing Activity (Priority: P2)

A child enters the letter tracing module and sees the current letter displayed large on screen with a faint guide path. An animated demo shows how to trace the letter. The child traces with their finger, following waypoints. The system provides real-time feedback: the trace turns rainbow-colored as they follow the path, and a success animation plays when the letter is completed. A letter picker allows jumping to any letter. The available alphabet changes based on the child's language (27 Spanish letters, 33 Russian letters, 26 English letters). Completed letters are visually marked. Completing a letter earns bananas.

**Why this priority**: Letter tracing is the core educational feature — it was the flagship module of the legacy app and the most complex.

**Independent Test**: A child can select a letter, watch the demo, trace it successfully, earn bananas, and see completion state persist after leaving and returning.

**Acceptance Scenarios**:

1. **Given** a child enters letter tracing with language set to Spanish, **When** the module loads, **Then** the Spanish alphabet (A-Z + Ñ) is available in the letter picker
2. **Given** a letter is displayed, **When** the module first loads that letter, **Then** an animated demo traces the letter path automatically
3. **Given** the child traces along the guide path, **When** their finger is within 35px of a waypoint (scaled to canvas DPI), **Then** the trace renders in rainbow colors and waypoints advance
4. **Given** the child completes all strokes/waypoints for a letter, **When** completion threshold is reached (85%+), **Then** a success animation plays and bananas are awarded
5. **Given** the child completed letter "A" yesterday, **When** they return to letter tracing today, **Then** letter "A" shows as completed in the picker

---

### User Story 4 - Number Tracing Activity (Priority: P2)

A child enters number tracing and sees numbers 0–20. Each number has a large display with guide path, animated demo, and finger-tracing interaction identical to letter tracing. Additionally, each number shows a visual quantity representation (e.g., 5 apples for the number 5) to reinforce counting concepts. Completing a number earns bananas.

**Why this priority**: Number tracing complements letter tracing as the second core educational module.

**Independent Test**: A child can select number 7, see 7 visual objects, trace the number, earn bananas, and see progress saved.

**Acceptance Scenarios**:

1. **Given** a child enters number tracing, **When** the module loads, **Then** numbers 0 through 20 are available in the picker
2. **Given** number 5 is selected, **When** it displays, **Then** the number "5" is shown with its guide path AND 5 visual objects (emojis/icons) representing the quantity
3. **Given** the child traces number 5 correctly, **When** completion threshold is reached, **Then** bananas are awarded and the number is marked complete
4. **Given** numbers are language-independent, **When** the child switches language, **Then** the numbers remain the same but UI labels update

---

### User Story 5 - Matching Game Activity (Priority: P2)

A child enters the matching game and chooses from 5 modes: letters, numbers, colors, shapes, and animals. In each mode, items appear in two columns. The child taps an item on the left, then taps its match on the right. A visual line connects matched pairs. Audio pronounces the matched item in the child's language using text-to-speech. A round ends when all pairs are matched. Perfect rounds (zero errors) earn bonus bananas. Content is trilingual — items show labels and pronunciation in the child's selected language.

**Why this priority**: Matching games reinforce learning from tracing through a different cognitive mechanism (recognition vs. production).

**Independent Test**: A child can play the colors matching mode, match all pairs, hear pronunciation, earn bananas for a perfect round.

**Acceptance Scenarios**:

1. **Given** a child enters matching, **When** the module loads, **Then** 5 mode buttons are shown: letters, numbers, colors, shapes, animals
2. **Given** the child selects "colors" mode, **When** items appear, **Then** color swatches are shown on the left and color names (in child's language) on the right
3. **Given** the child taps a left item then a correct right item, **When** matched, **Then** a line connects them, a success sound plays, and the word is pronounced via TTS
4. **Given** the child taps a wrong match, **When** mismatched, **Then** an error sound plays and the error is counted (no penalty, just tracking)
5. **Given** the child completes a round with zero errors, **When** the round ends, **Then** bonus bananas are awarded beyond the standard completion reward

---

### User Story 6 - Coloring Book Activity (Priority: P3)

A child enters the coloring module and selects from a library of 100+ templates organized by categories (animals, vehicles, nature, food, fantasy). Each template is a line-drawing that the child can color using: tap-to-fill (flood fill a region with the selected color), paintbrush (free paint over the template), a color palette with 12+ colors, and stickers that can be placed on the canvas. A rainbow mode allows painting with an auto-cycling color. The child can undo actions. Finished artwork can be saved. Completing a coloring page earns bananas (new improvement over legacy, which did not reward coloring).

**Why this priority**: Coloring is a creativity module — important but less educational-critical than tracing and matching.

**Independent Test**: A child can select a template, fill a region with a color, use the paintbrush, place a sticker, undo, save, and earn bananas.

**Acceptance Scenarios**:

1. **Given** a child enters coloring, **When** the template gallery loads, **Then** templates are shown organized by category with thumbnail previews
2. **Given** a template is selected, **When** it loads on canvas, **Then** the child sees the line drawing, a color palette, and tool buttons (fill, brush, sticker, undo)
3. **Given** the fill tool is selected with red color, **When** the child taps inside a region, **Then** that region fills with red without bleeding outside the lines
4. **Given** the child places 3 stickers and paints, **When** they tap undo 3 times, **Then** the last 3 actions are reversed in order
5. **Given** the child finishes coloring, **When** they tap save, **Then** the artwork is saved to their profile gallery and bananas are awarded

---

### User Story 7 - Free Drawing Activity (Priority: P3)

A child enters the free drawing canvas with a blank (or background-selected) surface. Tools available: multiple brush sizes, color palette, rainbow brush, eraser, background selector (solid colors, patterns, scenes), sticker placement, and undo. The child can save their drawing as an image to their profile gallery. Completing a drawing earns bananas (new improvement over legacy).

**Why this priority**: Free drawing supports creativity and motor skills but has less structured educational content.

**Independent Test**: A child can select a background, draw with rainbow brush, place stickers, erase, undo, save, and earn bananas.

**Acceptance Scenarios**:

1. **Given** a child enters free drawing, **When** the canvas loads, **Then** a blank canvas appears with tool palette (brushes, colors, eraser, backgrounds, stickers, undo, save)
2. **Given** the rainbow brush is selected, **When** the child draws, **Then** the stroke color cycles through the spectrum continuously
3. **Given** the child selects a beach background, **When** applied, **Then** the canvas background changes to the beach scene and existing drawings remain on top
4. **Given** the child finishes a drawing, **When** they tap save, **Then** the drawing is stored in their profile gallery and bananas are awarded

---

### User Story 8 - Memory Cards Game (Priority: P3)

A child enters the memory cards module and sees a grid of face-down cards. Cards feature content matching the child's learning level: letters, numbers, animals, colors, or shapes (selectable by mode). The child taps to flip a card, then taps another to find its match. Matched pairs stay face-up with a success animation. Mismatched pairs flip back after a brief reveal. The round completes when all pairs are found. Fewer taps to complete earns more bananas. Grid size adapts to difficulty: 2x3 for beginners, up to 4x4 for advanced.

**Why this priority**: Memory cards are a proven educational mechanic that reinforces content from other modules through a recall mechanism.

**Independent Test**: A child can play a 2x3 grid in animals mode, find all pairs, see matched animations, and earn bananas based on performance.

**Acceptance Scenarios**:

1. **Given** a child enters memory cards, **When** the module loads, **Then** mode selection (letters, numbers, animals, colors, shapes) and difficulty selection are shown
2. **Given** a 2x3 grid is generated, **When** it loads, **Then** 6 face-down cards are displayed (3 pairs)
3. **Given** the child flips two matching cards, **When** they match, **Then** both cards stay face-up with a success animation and sound
4. **Given** the child flips two non-matching cards, **When** they don't match, **Then** both flip back face-down after 1 second
5. **Given** all pairs are found, **When** the round ends, **Then** bananas are awarded with bonus for fewer total taps

---

### User Story 9 - Puzzle / Jigsaw Activity (Priority: P4)

A child enters the puzzle module and selects an image from a themed gallery (animals, vehicles, food, nature). The image breaks into jigsaw-style pieces that the child must drag into correct positions. Pieces snap into place when close enough. Difficulty levels control piece count: easy (4 pieces), medium (9 pieces), hard (16 pieces). Completing a puzzle earns bananas. A preview of the complete image is available as a hint.

**Why this priority**: Puzzles develop spatial reasoning and problem-solving. Included as a new module inspired by Keiki.

**Independent Test**: A child can pick an animal image, complete a 4-piece puzzle by dragging pieces, see them snap into place, and earn bananas.

**Acceptance Scenarios**:

1. **Given** a child enters puzzles, **When** the gallery loads, **Then** puzzle images are shown by category with difficulty indicators
2. **Given** a puzzle is selected at easy difficulty, **When** it loads, **Then** the image splits into 4 draggable pieces scattered on the canvas
3. **Given** the child drags a piece near its correct position, **When** it's within 30px of the target slot (scaled to canvas DPI), **Then** the piece snaps into place with a success animation and sound
4. **Given** all pieces are placed, **When** the puzzle completes, **Then** the full image is revealed with a celebration animation and bananas are awarded
5. **Given** the child is stuck, **When** they tap the hint button, **Then** a semi-transparent preview of the complete image is shown

---

### User Story 10 - Fill the Gaps (Shape Matching) Activity (Priority: P4)

A child enters the fill-the-gaps module and sees a scene with missing pieces (empty silhouettes). Below the scene, draggable objects are provided. The child must drag each object to its matching silhouette based on shape, color, or category. Scenes are themed (farm, ocean, space, kitchen). Completing a scene earns bananas.

**Why this priority**: Fill the gaps develops attention to detail and logical categorization. New module inspired by Keiki.

**Independent Test**: A child can view a farm scene with 5 missing animals, drag each animal to its correct silhouette, and earn bananas upon completion.

**Acceptance Scenarios**:

1. **Given** a child enters fill the gaps, **When** a scene loads, **Then** the scene displays with visible empty silhouettes and draggable objects below
2. **Given** the child drags an object to its correct silhouette, **When** it's within 30px of the target (scaled to canvas DPI), **Then** it snaps into place with a sound effect
3. **Given** the child drags an object to the wrong silhouette, **When** released, **Then** the object returns to its original position with a gentle error indicator
4. **Given** all gaps are filled, **When** the scene completes, **Then** a celebration animation plays and bananas are awarded

---

### User Story 11 - Sorting / Classification Activity (Priority: P4)

A child enters the sorting module and sees objects appearing one at a time (or in a group) that must be sorted into 2–3 labeled categories. Categories are visual and labeled in the child's language. Examples: sort animals by habitat (farm vs. ocean), sort objects by color (red bin vs. blue bin), sort food by type (fruits vs. vegetables). The child drags each object to the correct category. Correct sorts play a success sound; incorrect sorts bounce back with gentle feedback. Completing a sorting round earns bananas.

**Why this priority**: Sorting is a proven pre-math skill (classification/categorization). New module inspired by Keiki.

**Independent Test**: A child can sort 6 animals into "farm" and "ocean" categories, receive feedback per sort, and earn bananas on completion.

**Acceptance Scenarios**:

1. **Given** a child enters sorting, **When** the module loads, **Then** a sorting challenge is presented with 2–3 labeled category bins and objects to sort
2. **Given** an object is dragged to the correct category, **When** dropped, **Then** it stays in the bin with a success sound
3. **Given** an object is dragged to the wrong category, **When** dropped, **Then** it bounces back to the staging area with a gentle error sound
4. **Given** all objects are sorted correctly, **When** the round completes, **Then** bananas are awarded with bonus for zero errors

---

### User Story 12 - Progress, Rewards, and Parental Dashboard (Priority: P2)

The banana reward system is the core motivation loop. Every activity awards bananas upon completion. Bananas accumulate per child profile and are displayed prominently in the main menu. A parent can access a dashboard showing each child's progress: activities completed, time spent per module, bananas earned, letters/numbers mastered, and a daily/weekly activity chart. The session timer allows parents to set a time limit per child (default: 20 minutes). When time is running low (last minute), a gentle visual warning appears. When time expires, a friendly lock screen appears that only the parent can dismiss (via a simple parental gate like "solve this math problem" or "hold this button for 3 seconds").

**Why this priority**: Progress tracking and parental controls are essential for trust (parents need to see value) and child safety (screen time limits). This is co-P2 because the reward system must exist for all P2+ activities to deliver their banana rewards.

**Independent Test**: A parent can view the dashboard for a child who has completed some activities, see accurate stats, set a 5-minute timer, and observe the warning and lockout flow.

**Acceptance Scenarios**:

1. **Given** a child has completed 5 letters and 3 matching rounds, **When** the parent opens the dashboard, **Then** they see accurate counts for each activity, total bananas, and time spent
2. **Given** a parent sets a 20-minute session limit for a child, **When** the child plays for 19 minutes, **Then** a visual warning appears: the screen border pulses with a soft color overlay and a countdown timer becomes visible
3. **Given** the session timer reaches zero, **When** time expires, **Then** a lock screen blocks interaction showing a friendly "Time's up!" message; the parent dismisses it by pressing and holding a button for 3 seconds (parental gate)
4. **Given** the session timer is active, **When** the app goes to background (tab switch, screen lock), **Then** the timer pauses and resumes when the app regains focus (fixing legacy bug)
5. **Given** a child earns bananas in coloring (new), **When** they return to the menu, **Then** their banana counter is updated (all 9 modules now award bananas)

---

### User Story 13 - Audio System and Text-to-Speech (Priority: P2)

The app provides audio feedback throughout: success sounds on completion, tap sounds on interaction, whoosh sounds on navigation, and pop sounds on bubble/sticker placement. All sounds are synthesized (no external audio files required). Text-to-speech pronounces letters, numbers, words, and color names in the child's selected language (Spanish, Russian, or English). TTS activates during matching game matches, letter tracing completion, and wherever vocabulary is being taught. Navigating away mid-pronunciation cancels the current speech (fixing legacy bug where speech continued after navigation).

**Why this priority**: Audio feedback is critical for engagement and educational value (pronunciation). It's a cross-cutting concern needed by all P2 activities.

**Independent Test**: Sounds play on tap, success, and navigation. TTS pronounces "rojo" in Spanish, "красный" in Russian, and "red" in English when matching the red color.

**Acceptance Scenarios**:

1. **Given** the child completes a letter trace, **When** the success animation plays, **Then** a success sound effect plays simultaneously
2. **Given** the child matches "blue" in the matching game with language set to English, **When** the match is made, **Then** TTS pronounces "blue" in English
3. **Given** TTS is mid-pronunciation, **When** the child navigates back to the menu, **Then** the speech is cancelled immediately (no lingering audio)
4. **Given** a parent toggles sound off in settings, **When** the child interacts with any activity, **Then** no sounds or TTS play until re-enabled

---

### User Story 14 - Parent Login and Returning Session (Priority: P1)

A returning parent opens the app and sees a login screen with email and password fields. After logging in, they see the child profile selector with their previously created profiles. They select a child and land on the main menu with that child's saved progress, bananas, and language preference intact. The session persists via HTTP-only cookies so the parent does not need to log in again on the same device until the session expires or they explicitly log out.

**Why this priority**: Login is the entry point for all returning users. Without it, only new registration works.

**Independent Test**: A parent can log in with valid credentials, see their children's profiles, select one, and verify all progress is preserved from a previous session.

**Acceptance Scenarios**:

1. **Given** a registered parent, **When** they enter valid email and password, **Then** they are logged in and see the child profile selector
2. **Given** a parent enters invalid credentials, **When** they submit the form, **Then** they see a generic "Invalid email or password" error (no field-specific hints)
3. **Given** a parent with an active session cookie, **When** they reopen the app, **Then** they skip the login screen and go directly to the profile selector
4. **Given** a logged-in parent, **When** they tap "Log out", **Then** the session is destroyed and they see the login screen

---

### User Story 15 - Email Verification and Password Reset (Priority: P1)

After registration, the parent receives a verification email with a confirmation link. Until they click the link, they see a "Verify your email" screen and cannot access the main app. For password reset, the parent taps "Forgot password" on the login screen, enters their email, receives a reset link, and sets a new password. The reset token expires after 60 minutes.

**Why this priority**: Email verification prevents fake accounts and is required by FR-048. Password reset is essential for account recovery.

**Independent Test**: A parent can register, receive a verification email, click the link, gain access. Separately, a parent can request a password reset, receive the email, set a new password, and log in with it.

**Acceptance Scenarios**:

1. **Given** a newly registered parent, **When** they try to access the app before verifying, **Then** they see a "Check your email" screen with a resend option
2. **Given** a parent clicks the verification link, **When** the link is valid, **Then** their account is verified and they are redirected to the profile setup
3. **Given** a parent on the login screen, **When** they tap "Forgot password" and enter their email, **Then** they see "Check your email" regardless of whether the email exists
4. **Given** a parent clicks a valid reset link, **When** they enter a new password (minimum 8 characters), **Then** their password is updated and they can log in with it
5. **Given** a reset token older than 60 minutes, **When** the parent clicks the link, **Then** they see "This link has expired" with an option to request a new one

---

### User Story 16 - Cosmetics Shop (Priority: P3)

A child accesses the cosmetics shop from the main menu (via a dedicated shop button or banana counter). The shop displays purchasable items organized in tabs: avatars, stickers, and backgrounds. Each item shows a preview, its banana cost, and whether it's already unlocked. The child taps an item to preview it, then confirms the purchase. Bananas are deducted and the item becomes available immediately. A base set of free cosmetics (3 avatars, 10 stickers, 3 backgrounds) is available to all children without purchase.

**Why this priority**: The cosmetics shop gives purpose to the banana economy. Without it, bananas are just a number. P3 because the shop is a motivation enhancer, not a core educational feature.

**Independent Test**: A child with 50 bananas can browse the shop, preview an avatar costing 20 bananas, purchase it, see their balance drop to 30, and see the new avatar available in their profile.

**Acceptance Scenarios**:

1. **Given** a child opens the shop, **When** the shop loads, **Then** items are displayed in tabs (avatars, stickers, backgrounds) with prices and lock/unlock status
2. **Given** a child with 50 bananas taps an item costing 20, **When** they confirm purchase, **Then** 20 bananas are deducted, the item is unlocked, and a success animation plays
3. **Given** a child with 10 bananas views an item costing 30, **When** they see the item, **Then** the purchase button is disabled and shows "30 bananas needed"
4. **Given** a new child with 0 bananas, **When** they open the shop, **Then** the base free items (3 avatars, 10 stickers, 3 backgrounds) are already unlocked
5. **Given** a child unlocks a sticker in the shop, **When** they enter coloring or free drawing, **Then** the new sticker appears in the sticker palette

---

### User Story 17 - Artwork Gallery (Priority: P3)

A child can access their artwork gallery from the main menu or after saving a drawing/coloring. The gallery shows thumbnails of all saved artwork in chronological order (newest first). Tapping a thumbnail opens the artwork full-screen. The child can delete artwork from the gallery. The parent can also view each child's gallery from the parental dashboard. When the gallery reaches the 50-artwork limit, saving new artwork automatically removes the oldest piece, and the child sees a notice before saving.

**Why this priority**: The gallery gives value to the save action in coloring and drawing. Without it, saved artwork is invisible. P3 because it's a content viewer, not a core activity.

**Independent Test**: A child with 5 saved artworks can open the gallery, see all 5 thumbnails, tap to view full-screen, delete one, and confirm it drops to 4.

**Acceptance Scenarios**:

1. **Given** a child with saved artwork, **When** they open the gallery, **Then** thumbnails are displayed in a grid sorted newest-first
2. **Given** a child taps a thumbnail, **When** it opens, **Then** the artwork displays full-screen with options to delete or go back
3. **Given** a child confirms deletion of an artwork, **When** deleted, **Then** the artwork is removed from the gallery and storage count decreases
4. **Given** a child has 50 saved artworks and saves a new one, **When** they tap save, **Then** they see a notice that the oldest artwork will be replaced, and can confirm or cancel
5. **Given** a parent opens the dashboard, **When** they navigate to a child's gallery, **Then** they see the same artwork thumbnails the child sees

---

### Edge Cases

- What happens when a child has no internet connection? The app is online-first: login and progress saving require connectivity. Static assets (templates, waypoints, images) are cached for fast loading. If connection is lost mid-session, the app MUST show a friendly "no connection" message and retry saving progress when connectivity returns.
- What happens when a parent creates more than 5 child profiles? The system MUST support at least 5 child profiles per parent account.
- What happens when a child rapidly taps during a matching game? The system MUST ignore taps during match-reveal animations to prevent double-matching.
- What happens when canvas undo history grows very large? The system MUST cap undo history (max 30 steps) and discard oldest actions to prevent memory issues (fixing legacy memory crash).
- What happens when TTS is not available for a language on the device? The system MUST gracefully degrade — skip pronunciation without errors.
- What happens when the child rotates the iPad mid-activity? The canvas and UI MUST adapt smoothly to orientation changes without losing state.
- What happens when a parent tries to register with an already-used email? The system MUST reject with a clear error message without revealing if the email exists (security best practice).
- What happens when a parent requests a password reset for a non-existent email? The system MUST show the same "check your email" message to prevent email enumeration.
- What happens when a child tries to buy a cosmetic but doesn't have enough bananas? The system MUST show the banana cost and current balance, with the purchase button disabled.
- What happens when the same child profile is used on two devices at once? Last-write-wins: the most recent progress update is authoritative. The stale device refreshes on its next API call.
- What happens when an artwork upload fails mid-save? The system MUST retain the artwork locally and retry on the next save action or app reload.
- What happens when a parent wants to delete their own account? The system MUST provide an account deletion option that soft-deletes the parent account and cascades soft-delete to all child profiles and associated data (progress, artwork, cosmetics).

## Clarifications

### Session 2026-02-26

- Q: ¿Qué nivel de cumplimiento de privacidad infantil (COPPA/GDPR-K) se requiere? → A: Privacidad básica — no recopilar datos innecesarios del niño, consentimiento parental implícito al crear perfil hijo. Sin certificación formal.
- Q: ¿Las bananas tienen uso más allá de contador? → A: Sí, sirven como moneda para desbloquear cosméticos: avatares, stickers y fondos adicionales para el niño.
- Q: ¿Qué estrategia offline se requiere? → A: Online-first. Requiere conexión para login y guardar progreso. Assets estáticos (templates, waypoints, imágenes) se cachean para carga rápida. No se requiere motor de sincronización offline.
- Q: ¿Dónde se almacena el artwork guardado por el niño? → A: Server-side. El artwork se exporta como imagen comprimida (PNG/WebP) y se sube al servidor. Visible en la galería del niño y en el dashboard parental.
- Q: ¿Se requiere verificación de email y recuperación de contraseña? → A: Sí. Email verificado obligatorio al registrar + flujo de reset de contraseña por email.

## Requirements *(mandatory)*

### Functional Requirements

**Authentication & Profiles**
- **FR-001**: System MUST allow parent registration via email and password (minimum 8 characters) with mandatory email verification
- **FR-002**: System MUST allow parents to create, edit, and remove child profiles (name, age, avatar, language)
- **FR-003**: System MUST support at least 5 child profiles per parent account
- **FR-004**: System MUST isolate progress and rewards per child profile
- **FR-005**: System MUST support session persistence via HTTP-only cookies
- **FR-047**: System MUST provide a password reset flow via email (send reset link, validate token, set new password)
- **FR-048**: System MUST block access to authenticated features until email is verified

**Activity Modules**
- **FR-006**: System MUST provide 9 activity modules: letter tracing, number tracing, matching (5 modes), coloring, free drawing, memory cards, puzzles, fill the gaps, sorting
- **FR-007**: Letter tracing MUST support 3 alphabets: Spanish (27), Russian (33), English (26)
- **FR-008**: Number tracing MUST cover 0–20 with visual quantity representation
- **FR-009**: All 9 activities MUST award bananas upon completion per the following schedule:
  - Letter tracing: 3 bananas per letter completed
  - Number tracing: 3 bananas per number completed
  - Matching game: 5 bananas per round completed + 3 bonus for perfect round (zero errors)
  - Coloring: 5 bananas per artwork saved
  - Free drawing: 5 bananas per artwork saved
  - Memory cards: 5 bananas per round + 3 bonus for completing in minimum taps
  - Puzzles: 5 bananas (easy), 8 bananas (medium), 12 bananas (hard)
  - Fill the gaps: 5 bananas per scene completed
  - Sorting: 5 bananas per round + 3 bonus for zero errors
- **FR-010**: Coloring module MUST support flood-fill, paintbrush, stickers, rainbow mode, and undo
- **FR-011**: Free drawing MUST support multiple brush sizes, eraser, backgrounds, stickers, and undo
- **FR-012**: Memory cards MUST support 5 content modes and 3 difficulty levels: 2x3 grid (easy, 3 pairs), 3x4 grid (medium, 6 pairs), 4x4 grid (hard, 8 pairs)
- **FR-013**: Puzzles MUST support 3 difficulty levels (4, 9, 16 pieces) with snap-to-place mechanics
- **FR-014**: Fill the gaps MUST present themed scenes with drag-and-drop shape matching
- **FR-015**: Sorting MUST present 2–3 category bins with drag-and-drop classification

**Progress & Rewards**
- **FR-016**: System MUST track completion state per activity item per child with the following transitions:
  - **null → attempted**: Triggered when the child first interacts with an item (starts tracing, opens a template, begins a round, starts a puzzle/scene/sort)
  - **attempted → completed**: Triggered when the child meets the completion criteria (tracing: 85% waypoints covered; matching/memory/sorting: all pairs/items resolved; coloring/drawing: artwork saved; puzzles: all pieces placed; fill the gaps: all silhouettes filled)
- **FR-017**: System MUST accumulate and display banana count per child
- **FR-018**: System MUST persist all progress server-side and sync across devices
- **FR-019**: Matching game MUST track error count per round and award bonus bananas for perfect rounds
- **FR-042**: System MUST provide a cosmetics shop where children can spend bananas to unlock new avatares, stickers (for coloring/drawing), and canvas backgrounds
- **FR-043**: Unlocked cosmetics MUST persist per child profile and be available across all relevant modules
- **FR-044**: System MUST include a base set of free cosmetics available without spending bananas

**Parental Controls**
- **FR-020**: System MUST provide a configurable session time limit per child (default: 20 minutes)
- **FR-021**: Session timer MUST pause when app loses focus and resume when regained
- **FR-022**: System MUST display a visual warning during the final minute of a session
- **FR-023**: System MUST show a parental lock screen when session time expires
- **FR-024**: System MUST provide a parent dashboard with per-child activity stats

**Audio & Language**
- **FR-025**: System MUST support 3 languages: Spanish, Russian, and English
- **FR-026**: All UI text MUST be translatable and switch dynamically when language is changed
- **FR-027**: System MUST provide TTS pronunciation for vocabulary items in all 3 languages
- **FR-028**: System MUST cancel ongoing TTS when navigating between screens
- **FR-029**: System MUST synthesize sound effects without external audio files

**Content Management**
- **FR-030**: Coloring templates MUST be stored as data (not hardcoded functions), organized by category
- **FR-031**: Matching game data MUST be trilingual and stored as structured data
- **FR-032**: Waypoints for letter/number tracing MUST be stored as structured data per alphabet
- **FR-033**: System MUST support saving child artwork (coloring, drawings) as compressed images (PNG/WebP) uploaded to the server, stored per-child
- **FR-045**: Artwork gallery MUST be accessible from the child's profile and from the parent dashboard
- **FR-046**: System MUST enforce a maximum of 50 saved artworks per child. When the limit is reached, the system MUST notify the child that saving will replace the oldest artwork and require confirmation before proceeding (oldest-first rotation on confirm; cancel aborts the save)

**Privacy & Data Minimization**
- **FR-038**: System MUST only collect the minimum data necessary for functionality (child name, age, avatar, language, progress)
- **FR-039**: System MUST NOT collect location, device identifiers, or analytics data from child profiles
- **FR-040**: Parent account creation MUST serve as implicit parental consent for child data storage
- **FR-041**: System MUST allow parents to delete a child profile and all associated data via soft-delete (deleted_at timestamp). Soft-deleted profiles and their data (progress, artwork, cosmetics) are excluded from all queries and inaccessible to the parent and child
- **FR-054**: System MUST allow parents to delete their own account, which cascades soft-delete to all child profiles and associated data

**UX & Accessibility**
- **FR-034**: All interactive elements MUST be large enough for child fingers (minimum 44x44pt touch targets)
- **FR-035**: UI MUST be responsive: iPad landscape as primary, with phone portrait support
- **FR-036**: Canvas activities MUST handle orientation changes without losing state
- **FR-037**: Undo history MUST be capped at 30 steps to prevent memory issues

**UI States**
- **FR-049**: All screens MUST display a child-friendly loading indicator (animated spinner or skeleton) while content loads
- **FR-050**: Empty states MUST show an encouraging illustration with a call-to-action: empty gallery shows "No artwork yet — go draw something!"; empty dashboard shows "No activity yet — time to play!"; cosmetics shop with nothing unlocked shows the free base items prominently
- **FR-051**: Server errors MUST display a friendly error screen ("Oops! Something went wrong") with a retry button; no technical error details shown to the child
- **FR-052**: If artwork upload fails, the system MUST retain the artwork locally and retry upload automatically on next save or app reload; the child sees "Saving..." until confirmed
- **FR-053**: If the same child profile is active on two devices simultaneously, the last-write-wins strategy applies: the most recent progress update overwrites the previous one, and the stale device refreshes its state on next API call

### Key Entities

- **Parent**: Account holder with email, password. Can manage child profiles and view dashboard.
- **Child Profile**: Belongs to a parent. Has name, age, avatar, preferred language, banana count. All progress is scoped to a child profile.
- **Activity Module**: One of 9 types. Has a name, icon, and type-specific content (templates, waypoints, matching data, etc.).
- **Progress Record**: Tracks a child's state (null/attempted/completed) for each item within each activity module.
- **Artwork**: A saved drawing or coloring by a child, stored server-side as compressed image (PNG/WebP). Has child profile reference, activity type (coloring/drawing), creation date, and file path. Maximum 50 per child.
- **Session Config**: Per-child settings including time limit, sound on/off.
- **Cosmetic Item**: Unlockable reward (avatar, sticker, or background). Has a banana cost, category, and preview image. Tracks unlock status per child.

### Assumptions

- The app will be served as a web application (not a native mobile app), accessed via browser on iPad, phones, and desktops.
- TTS will use the Web Speech API (browser-native) rather than a server-side service.
- Sound effects will be synthesized via Web Audio API as in the legacy app.
- Coloring templates will be stored as SVG paths or similar vector data, not as bitmap images.
- The waypoint coordinate system (0–100%) from the legacy app will be preserved and adapted.
- The tracing completion threshold of 85% from legacy will be preserved.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new parent can register and set up their first child profile in under 2 minutes
- **SC-002**: A child can navigate from the main menu to any activity and begin interacting within 3 taps
- **SC-003**: All 9 activity modules load and become interactive within 3 seconds on a standard iPad
- **SC-004**: A child can complete a letter trace, earn bananas, leave the module, return, and see their progress preserved — across devices
- **SC-005**: The parental dashboard accurately reflects all activity completion data within 5 seconds of a child completing an activity
- **SC-006**: Session timer correctly pauses during background and resumes on foreground with less than 2 seconds drift
- **SC-007**: TTS pronunciation is audible within 500ms of trigger in all 3 languages
- **SC-008**: Canvas-based activities (coloring, drawing) perform smoothly on iPad with up to 30 undo history entries without frame drops
- **SC-009**: The UI is fully usable in both landscape and portrait orientations on iPad and phone without overlapping elements
- **SC-010**: 90% of children ages 3–7 can independently navigate the main menu and start an activity without adult help (based on touch target sizes and visual clarity)
