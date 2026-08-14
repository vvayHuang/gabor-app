# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gabor App is a Nuxt 4 / Vue 3 visual-perception training app. Users identify the orientation of a Gabor patch (a sinusoidal grating in a Gaussian envelope) among grid distractors; difficulty scales adaptively with player level. It ships as a web app and, via Capacitor, an iOS app, with Supabase for auth/persistence and LocalStorage as an offline fallback.

## Commands

```bash
npm run dev         # start dev server
npm run generate     # static build for iOS/Capacitor sync
npm run build        # SSR/production build
npm run preview      # preview a production build
npm run test:e2e     # Playwright e2e tests
npm run test:e2e:ui  # Playwright e2e tests, UI mode
```

iOS workflow after native-relevant changes: `npm run generate && npx cap sync ios && npx cap open ios`, then run from Xcode.

Do **not** run `npm install`, `npm run build`, `npm run test`, or `git push` unless the user explicitly asks — these are disallowed by default in this repo (see `AGENTS.md`).

Note: `@playwright/test` is a devDependency and `test:e2e` scripts exist, but no `playwright.config.ts` or spec files currently exist in the repo — e2e testing is not yet wired up.

## Architecture

### Rendering: two deliberately separate systems

- **`app/components/GaborCanvas.vue`** — the core training stimulus. Must use native Canvas `ImageData`/`putImageData` pixel operations (`getContext('2d', { willReadFrequently: true })`, building `ImageData` directly, avoiding readback). This is a hard constraint carried over from a past performance rewrite — do not replace it with p5.js or anything that reintroduces canvas readback warnings or drops below 60 FPS.
- **`app/components/GaborFlowField.vue` / `TidalWaves.vue` / `TimeSphere.vue`** — decorative generative-art backgrounds using p5.js (Perlin noise, flowing/organic shapes). p5.js is for decoration only, never for the core Gabor patch rendering.

### Game/difficulty engine (`app/composables/useGameState.ts`)

Singleton reactive state (`gameState: START|PLAYING|REST|RESULTS`, `session`) computed from player level (1–100):
- `contrast = max(0.03, 0.94^(level-1))`
- `angleOffset = max(2, 30 * 0.95^(level-1))` degrees
- `cyclesPerMm = 0.38 + level*0.005`
- grid size steps up at levels 8, 20, 45 (3×4 → 4×5 → 5×6 → 6×8)

Scoring: 100 base + speed bonus `max(0, 400 - responseTime/10)` per correct answer. This difficulty curve and scoring formula are intentional design choices — preserve them unless a change is explicitly requested.

### Persistence (`app/composables/useGamePersistence.ts`)

Singleton reactive `stats` synced to both `localStorage` (key `gabor_game_stats`, always) and Supabase (`game_stats` table for aggregate stats, `game_sessions` for per-session history) when a user is authenticated — LocalStorage-first optimistic updates, Supabase as best-effort cloud sync (failures are logged, not thrown). Derived values (`currentLevel`, `levelProgress`, `rankName`, `longestStreak`) are computed from `totalXP`: `currentLevel = floor(sqrt(totalXP/100)) + 1`. Supabase table types are generated into `app/types/database.types.ts`.

### iOS OAuth deep-link flow (`app/pages/login.vue`)

Non-obvious and fragile — preserve unless explicitly changing it:
- Uses **implicit flow** (`flowType: 'implicit'`), not PKCE, to avoid losing `code_verifier` in the iOS simulator webview.
- Redirect URL is `gaborapp://login-callback` on native, `${origin}/prepare` on web.
- On callback, manually writes the `sb-<project-ref>-auth-token` cookie before doing a hard `window.location.href` redirect, to force the webview to reload and pick up the Supabase auth cookie.

### Layout / navigation (`app/layouts/default.vue`)

Single default layout wraps all pages: `GaborFlowField` background, `NavigationRail` (desktop, left sidebar) / `NavigationBar` (mobile, bottom), both driven by route name allow-lists (`prepare`, `records`, `profile`, `tutorial`, plus `settings` on desktop). Status-bar top padding is applied to every route except `index`, `login`, `prepare`. When adding a new page that should appear in navigation or need status-bar spacing, update these allow-lists in `default.vue`.

### Directory layout

- `app/pages/` — file-based routes; `task/game-grid.vue` is the main training flow.
- `app/components/` — UI, navigation, charts, buttons, canvas/visual components.
- `app/composables/` — shared state: game state, persistence, app settings, audio, 3D tilt.
- `public/shape/` — static SVG achievement/badge shapes (keep new badge assets here, not `app/assets`).
- `ios/` — Capacitor iOS project.
- `.nuxt/`, `.output/`, `dist/` (symlink to `.output/public`), `node_modules/` — generated/dependency, do not edit.

## Design system

Material Design 3 tokens, defined in `app/assets/css/main.css`. Key constraints (see `DESIGN.md` for full spec):
- Colors: surface `#F9F9FF`, on-surface `#181C23`, primary `#005BAF`, secondary `#3F5F8F`, tertiary `#8A31AE`, error `#BA1A1A`. Do not add new color tokens ad hoc — reuse existing ones.
- 8px spacing grid; prefer Tailwind scale utilities (e.g. `gap-2.5`) over arbitrary values.
- Rounded corners: `rounded-3xl` for large containers, `rounded-2xl` for cards, `rounded-full` for buttons.
- Text color should use `text-on-surface` / `text-on-surface-variant` without added opacity, to keep WCAG contrast.
- Keep UI minimal — avoid unnecessary nested cards; prefer plain text/heading blocks over cards where the existing pages do (e.g. profile).
- Animation via GSAP: entrance `duration 0.8, power2.out`; exit `duration 0.5, power2.inOut`; button press `scale: 0.95`.
- Max content width `440px` centered on desktop-narrow contexts; desktop nav rail is `288px` wide (`lg:pl-[288px]` offset applied conditionally in `default.vue`).

## Coding conventions

- Vue SFCs with `<script setup lang="ts">`, Composition API only.
- Components: PascalCase. Composables: `use` prefix. Pages: Nuxt file-based routing conventions.
- Secrets live in `.env` (`SUPABASE_URL`, `SUPABASE_KEY`); never commit real credentials.

## Verifying changes

No automated test suite is currently exercised in this repo. For UI changes, check desktop and mobile layouts, dark mode, navigation, and affected states manually. For game/scoring changes, verify feedback, progress, scoring, and persistence (both LocalStorage and, if testable, Supabase sync) manually.
