# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm start` (runs `ng serve`)
- **Build:** `npm run build` (runs `ng build`, output in `dist/demo/`)
- **No test or lint commands are configured.**

## Architecture

Angular 21 zoneless app using standalone components, NgRx SignalStore for state management, and Angular Material for UI. Deployed to Netlify.

### Path alias

`@shared` maps to `src/shared/index.ts` (configured in tsconfig.json). All shared modules re-export through barrel `index.ts` files. Use `@shared` for imports from shared code.

### State management

`BoxesStore` (`src/shared/store/boxes.store.ts`) is a root-provided NgRx SignalStore. It manages selected box, box options, and box values. State properties are suffixed with `_` (e.g., `selectedBox_`, `boxesValues_`, `sum_`). The store auto-initializes via `withHooks` `onInit`.

### Data layer

`BoxesDataFetchService` (`src/shared/api/boxes-data-fetch.service.ts`) wraps localStorage with an Observable-based API (simulating HTTP calls). Data is persisted under a configurable localStorage key.

### App structure

- `src/main.ts` — Bootstrap (zoneless, no zone.js)
- `src/pages/boxes/` — Main page component with two child components:
  - `boxes-list/` — Displays a grid of selectable boxes using `MatButtonToggle`
  - `boxes-options/` — Displays value options to assign to the selected box
- `src/shared/configs/` — Constants (box options, localStorage key, number of boxes, snackbar config)
- `src/shared/types/` — TypeScript types (`Box`, `Boxes`, `BoxOption`)

### Styling

Tailwind CSS 4 via PostCSS, plus Angular Material with a custom SCSS theme (`src/material-theme.scss`).

### TypeScript

Strict mode enabled with `strictTemplates`, `strictStandalone`, and `strictInjectionParameters` in Angular compiler options.
