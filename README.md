![Project Screenshot Placeholder](./thumbnail.png)

# IMDB Play

IMDB Play is a Next.js App Router application for browsing movies and series, exploring title details, filtering by genre, searching content, and managing authenticated user actions (favorites, watchlist, progress).

## Project Goals

- Deliver a fast catalog browsing experience for movies and TV series.
- Keep UI architecture consistent through Atomic Design.
- Isolate domain/business logic inside feature modules.
- Maintain quality through unit tests, E2E coverage, accessibility checks, and lint/format gates.

## Tech Stack

- Framework: `Next.js` (App Router, React Server Components)
- Language: `TypeScript` (strict mode)
- UI: `React`, `CSS Modules`, `clsx`, `lucide-react`
- Internationalization: `next-intl`
- Data layer: `Prisma` + `PostgreSQL`
- Validation / server action safety: `zod`, `next-safe-action`
- Logging: `pino` (shared logger)
- Testing:
  - Unit/Component: `Vitest`, `@testing-library/react`
  - E2E: `Playwright`
  - UI component docs: `Storybook`
- Tooling: `ESLint`, `Prettier`, `Husky`, `lint-staged`
- Package manager: `pnpm` (required)

## Architectural Decisions

## 1) App Router + Server-First Rendering

- Pages and route segments use Next.js App Router.
- Server Components are the default to reduce client bundle size.
- Client Components are introduced only when interactivity is required (e.g., horizontal scrollers, filters, search input behavior).

Why:
- Better performance defaults and cleaner data-fetch boundaries.
- Encourages explicit client/server separation.

## 2) Feature-First Domain Logic

Business logic is organized under `src/features/<feature>/` (services, validators, server actions, types).

Why:
- Keeps route files focused on composition.
- Makes domain logic reusable and testable independent of UI.
- Limits accidental coupling between pages and backend concerns.

## 3) Atomic Design for UI Components

UI building blocks live in:

- `src/components/atoms`
- `src/components/molecules`
- `src/components/organisms`

Why:
- Predictable composition model.
- Better reuse and clearer ownership boundaries.
- Storybook-friendly component development.

## 4) Service and Data Isolation

- External API/DB access is encapsulated in feature services.
- Prisma access stays inside services/server actions, not UI components.

Why:
- Strong separation of concerns.
- Easier mocking and unit testing.
- Safer evolution of persistence logic.

## 5) Typed Validation at Boundaries

- Inputs to server actions are validated with `zod`.
- Typed responses are returned from actions/services.

Why:
- Prevents invalid input from leaking into data/services.
- Improves reliability and maintainability in async flows.

## 6) Localization-First Copy

- User-facing text is stored in message files (e.g. `src/messages/en.json`).
- Components/pages use `next-intl` hooks/APIs for translation access.

Why:
- Avoids hardcoded UI copy.
- Keeps localization straightforward as features grow.

## 7) Quality Gates as Delivery Standard

Before completion:

- `pnpm run lint`
- `pnpm run format`
- `pnpm test`
- `pnpm test:e2e` (or documented fixture gating)

Why:
- Ensures baseline code quality and reduces regressions.

## Project Structure

```text
src/
  app/                    # Routes, layouts, page composition
  components/
    atoms/
    molecules/
    organisms/
  features/               # Domain logic by feature
  lib/                    # Shared utilities (a11y, logger, helpers)
  messages/               # i18n dictionaries
e2e/                      # Playwright tests
prisma/                   # Schema, migrations, seed configuration
```

## Getting Started

## Prerequisites

- Node.js (version compatible with this repo)
- `pnpm`
- PostgreSQL (for local DB-backed flows)

## Install

```bash
pnpm install
```

## Environment

Create/update `.env` using `.env.example` as reference.

Important:
- Do not commit `.env`.
- Update `.env.example` when introducing required variables.

## Run Development Server

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Available Scripts

- `pnpm dev` - start local dev server
- `pnpm build` - production build
- `pnpm start` - run built app
- `pnpm run lint` - run ESLint
- `pnpm run format` - check Prettier formatting
- `pnpm run format:fix` - auto-fix formatting
- `pnpm test` - run unit/component tests
- `pnpm test:e2e` - run Playwright E2E tests
- `pnpm storybook` - run Storybook

## Testing Strategy

- Unit tests cover services, validators, server actions, hooks, and complex components.
- Component tests validate behavior and accessibility-oriented interactions.
- E2E tests cover critical user journeys such as authentication, browsing, and search.
- Storybook documents and validates reusable UI states, especially atoms/molecules.

## Accessibility and Responsiveness

- Semantic HTML and keyboard accessibility are baseline requirements.
- WCAG AA contrast and focus visibility are enforced at component level.
- Mobile-first responsive behavior is expected across core flows.

## Logging

Runtime logging should use the shared logger (`src/lib/logger.ts` pattern).
Avoid `console.*` in runtime application code.
