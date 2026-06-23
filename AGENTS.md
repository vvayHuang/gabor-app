# Repository Guidelines

## Project Structure & Module Organization

This is a Nuxt 4, Vue 3, Tailwind CSS, Supabase, and Capacitor app for Gabor patch visual training.

- `app/pages/`: route views. `task/game-grid.vue` owns the main training flow.
- `app/components/`: reusable UI, navigation, charts, buttons, and visual components.
- `app/composables/`: shared logic for game state, persistence, settings, and audio.
- `app/assets/`: source CSS, icons, and design assets.
- `public/shape/`: static SVG achievement shapes. Keep badge assets here.
- `ios/`: Capacitor iOS project.
- `.nuxt/`, `.output/`, `dist/`, and `node_modules/` are generated or dependency folders; avoid direct edits.

## Coding Style & Naming Conventions

Use Vue SFCs with `<script setup lang="ts">`. Name components in PascalCase, composables with a `use` prefix, and pages by Nuxt route conventions.

Follow Material Design 3 tokens in `app/assets/css/main.css`. Prefer `text-on-surface` and Tailwind scale spacing such as `gap-2.5` over arbitrary values when an equivalent exists. Keep UI minimal; avoid unnecessary nested cards.

## Rendering, Game, and Mobile Constraints

`GaborCanvas.vue` must use native Canvas ImageData operations for core Gabor patches. Do not replace it with p5.js or code that triggers frequent canvas readback warnings. Use p5.js only for decorative generative art.

Preserve dynamic difficulty in `useGameState.ts`, Supabase plus LocalStorage persistence, and the iOS OAuth deep-link flow (`gaborapp://login-callback`) unless explicitly changing them.

## Testing Guidelines

For UI changes, check desktop/mobile layouts, dark mode, navigation, and affected states. For game changes, verify feedback, progress, scoring, and persistence.

## Commit & Pull Request Guidelines

Recent history uses `feat:`, `fix:`, `refactor:`, and `style:`. Example: `fix: prevent progress bar reset during animation`.

PRs should include a summary, affected routes/components, screenshots for UI changes, and verification steps such as `npm run build`.

## Security & Configuration Tips

Keep secrets in `.env`. Do not commit private Supabase credentials. Review Capacitor/iOS changes for effects on login, deep links, storage, or device APIs.

## Commands

- 不要執行 npm install

- 不要執行 npm run build

- 不要執行 npm run test

- 不要執行 git push

## Vue

- 使用 Composition API

- 優先使用 script setup

## Tailwind

- 優先沿用現有設計系統

- 不任意新增顏色 Token

## Completion

- 完成修改後停止

- 說明修改了哪些檔案